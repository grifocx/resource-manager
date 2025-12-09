# Resource Planning Implementation Specification

## 1. Overview
This document outlines the implementation plan for "True Resource Planning" analysis. The goal is to transform the current static capacity view into a dynamic, intelligent system that:
1.  Matches work items to resources based on **Skills** and **Availability**.
2.  Accounts for **Baseline Allocations** (Admin, O&M) that reduce effective capacity.
3.  Provides **Smart Suggestions** for resource assignment.
4.  **Auto-distributes** effort based on work item timelines.
5.  **Reacts** to schedule changes.

## 2. Database Schema Extensions

### 2.1. Work Items (`work_items`)
Enhance `work_items` to track effort and skill requirements.

*   **New Columns**:
    *   `estimated_hours` (integer): Total effort required for the work item.
    *   `required_skills` (jsonb): Array of skill IDs required (e.g., `[1, 5, 12]`). Alternatively, we can use a join table `work_item_skills`, but a JSON column is lighter if queries are simple. Given we need to filter, a join table `work_item_skills` is safer for SQL queries.
    *   `complexity` (varchar): 'Low', 'Medium', 'High' (optional, for weighting).

### 2.2. Work Item Skills (`work_item_skills`) - *New Table*
To support "suggested resources based on skills".

```sql
CREATE TABLE work_item_skills (
  work_item_id INTEGER REFERENCES work_items(id),
  skill_id INTEGER REFERENCES skills(id),
  level_required INTEGER DEFAULT 1, -- 1-5 scale (optional)
  PRIMARY KEY (work_item_id, skill_id)
);
```

### 2.3. Baseline / Internal Work
Instead of a separate table for "Admin/O&M", we will leverage the existing `work_items` table with a specific `type` or `category`.
*   **Existing**: `type` column ('Project', 'KTLO').
*   **Strategy**: System-wide "Internal" work items will be created for categories like "Admin", "O&M", "Training".
*   Allocations to these items represent the "Baseline" consumption.

## 3. Core Logic & Algorithms

### 3.1. Net Availability Calculation
Effective Capacity for a Resource $R$ in Week $W$:
$$ \text{NetAvailable}(R, W) = \text{TotalCapacity}(R) - \sum(\text{Allocations}_{\text{Admin/O\&M}}) - \sum(\text{Allocations}_{\text{ExistingProjects}}) $$

### 3.2. Smart Resource Matching (Scoring Algorithm)
When finding a resource for Work Item $T$ (Task):

1.  **Skill Match Score ($S_{skill}$)**:
    *   $100\%$ if Resource has all required skills.
    *   Partial % for partial matches.
2.  **Availability Score ($S_{avail}$)**:
    *   Calculate average Net Availability over the duration of $T$.
    *   Higher availability = Higher score.
3.  **Total Score**:
    $$ Score = (w_1 \times S_{skill}) + (w_2 \times S_{avail}) $$
    *   *Constraint*: If Resource has 0 skills from requirements, Score = 0 (unless "Any" is allowed).

### 3.3. Auto-Allocation Logic
When assigning Resource $R$ to Work Item $T$:
1.  **Inputs**: `TotalEstimatedHours`, `StartDate`, `EndDate`.
2.  **Duration**: Calculate number of work weeks ($N$).
3.  **Weekly Load**: $\text{HoursPerWeek} = \text{TotalEstimatedHours} / N$.
4.  **Action**: Create/Update `allocations` records for each week in the range with `HoursPerWeek`.
    *   *Warning*: If `HoursPerWeek` > `NetAvailable`, trigger "Overbooking Warning".

### 3.4. Reactivity (Update Logic)
Triggers:
*   **Event**: Work Item `StartDate` or `EndDate` changes.
*   **Action**:
    1.  Fetch all existing allocations for this Work Item.
    2.  Recalculate `HoursPerWeek` based on new duration.
    3.  Shift/Resize allocation records to fit new dates.
    4.  Notify user if this causes new overbooking conflicts.

## 4. API Extensions (`server/routes.ts`)

### 4.1. `POST /api/planning/suggest-resources`
*   **Input**: `{ workItemId: number }` OR `{ skillIds: number[], startDate: string, endDate: string }`
*   **Logic**:
    *   Fetch all resources.
    *   Filter by Skills.
    *   Calculate Availability for date range.
    *   Return sorted list of Resources with `{ resource, matchScore, avgAvailability }`.

### 4.2. `POST /api/planning/allocate`
*   **Input**: `{ resourceId: number, workItemId: number, totalHours: number, strategy: 'even' | 'front-load' }`
*   **Logic**:
    *   Delete existing allocations for this pair (optional, or merge).
    *   Generate new weekly allocations.
    *   Commit to DB.

### 4.3. `GET /api/planning/conflicts`
*   **Input**: `{ rangeStart: string, rangeEnd: string }`
*   **Output**: List of Resources who are overbooked (>100% capacity) in any week.

## 5. UI/UX Implementation Plan

### 5.1. Work Item Details Update (`/work`)
*   Add **"Resource Planning"** tab or section.
*   Input for **"Estimated Effort (Hours)"**.
*   **"Required Skills"** selector (Multi-select).
*   **"Find Resource"** button triggering the Smart Suggestion Modal.

### 5.2. Smart Suggestion Modal
*   Displays list of suggested resources.
*   Columns: Name, Role, Skill Match (Badge), Availability (Mini Heatmap).
*   Action: "Assign" -> Triggers Auto-allocation.

### 5.3. Capacity View Update (`/capacity`)
*   **Visual Distinction**:
    *   Base layer: Admin/O&M (Gray).
    *   Middle layer: Projects (Colored by Project).
    *   Top layer: Overcapacity (Red striped).
*   **Interactivity**: Click a cell to see the breakdown ("5h Admin, 20h Project A, 10h Project B").

## 6. Implementation Roadmap

### Phase 1: Schema & Backend Foundation
1.  [ ] Migration: Add `estimated_hours` to `work_items`.
2.  [ ] Migration: Create `work_item_skills` table.
3.  [ ] API: Implement `suggest-resources` endpoint.
4.  [ ] API: Implement `auto-allocate` endpoint.

### Phase 2: Work Item Planning UI
5.  [ ] Frontend: Update Work Item form to capture `estimated_hours` and Skills.
6.  [ ] Frontend: Create "Smart Assign" Modal with API integration.

### Phase 3: Capacity Visualization & Intelligence
7.  [ ] Frontend: Update Capacity grid to distinguish "Baseline" vs "Project" work.
8.  [ ] Frontend: Add conflict warnings (Toast or Visual indicator).
9.  [ ] Backend: Add logic to shift allocations when dates change (Hook into `PATCH /work-items`).
