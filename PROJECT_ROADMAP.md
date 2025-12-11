# Project Roadmap - Resource-IT (Nexus)

## Current Status Overview

Resource-IT is an IT resource management application with capacity planning, work item tracking, and portfolio management. The application has a working full-stack implementation with React, Express, and PostgreSQL.

---

## Completed Features

### Core Application
- [x] Dashboard with summary cards (Utilization, Active Projects, Team Members, Critical Items)
- [x] Interactive dashboard cards with navigation drill-downs
- [x] Resources page with team member management
- [x] Work Items page with Projects, Demands, and KTLO tracking
- [x] Capacity planning page with weekly allocation grid
- [x] Portfolio page with Programs and Portfolios hierarchy
- [x] Settings page with theme toggle (Light/Dark/System), compact mode, notifications, default capacity view

### Data Model
- [x] Teams with department associations
- [x] Resources with roles, capacity, and skills
- [x] Skills catalog with categories
- [x] Resource-Skills many-to-many relationship
- [x] Work Items with type, status, priority, dates, progress
- [x] Work Item Skills (required skills per work item with level)
- [x] Allocations (weekly hour assignments per resource/work item)
- [x] Portfolios and Programs hierarchy
- [x] `estimated_hours` and `complexity` fields on work items

### Resource Planning Backend
- [x] `POST /api/planning/suggest-resources` - Smart resource matching based on skills + availability
- [x] `POST /api/planning/allocate` - Auto-allocation that distributes effort across weeks
- [x] Auto-shift allocations when work item dates change (reactivity)
- [x] Net availability calculation per resource
- [x] Skill match scoring algorithm (60% skills, 40% availability weighting)

### UI/UX
- [x] Settings button navigates to Settings page
- [x] Sign Out button shows informational toast (auth not implemented)
- [x] User profile section clickable (navigates to Settings)
- [x] Responsive sidebar with mobile support
- [x] Dark mode support via next-themes

---

## Not Yet Implemented

### Authentication System
- [ ] User login and registration pages
- [ ] Session management with Passport.js
- [ ] Dynamic user profile (replace hardcoded "John Doe")
- [ ] Actual Sign Out functionality
- [ ] Profile editing (name, role, avatar)

### Planning Intelligence UI
- [ ] "Find Resource" button and Smart Suggestion Modal on Work Item details
- [ ] Display suggested resources with skill match badges and availability heatmaps
- [ ] "Assign" action from modal triggering auto-allocation

### Capacity View Enhancements
- [ ] Visual distinction for baseline work (Admin/O&M) vs project work
- [ ] Overcapacity indicators (red striped overlay)
- [ ] Cell click to show allocation breakdown ("5h Admin, 20h Project A")

### Conflict Detection
- [ ] `GET /api/planning/conflicts` endpoint
- [ ] Toast/visual warnings for overbooking
- [ ] Conflict detection when allocating resources

### Work Item Form Updates
- [ ] "Estimated Effort (Hours)" input field in UI
- [ ] "Required Skills" multi-select in Work Item form
- [ ] Resource Planning tab/section on Work Item details

---

## Technical Notes

### Stack
- **Frontend**: React 18, Vite, Tailwind CSS v4, shadcn/ui, TanStack Query, Wouter
- **Backend**: Express.js, Drizzle ORM, PostgreSQL
- **Theming**: next-themes for light/dark/system mode

### Key Files
- `shared/schema.ts` - Drizzle schema definitions
- `server/routes.ts` - API endpoints
- `server/planning.ts` - Resource planning algorithms
- `server/storage.ts` - Data access layer
- `client/src/pages/` - Page components
- `client/src/components/layout/Layout.tsx` - Main layout with sidebar

### Database
- PostgreSQL with Drizzle ORM
- Migrations via `npm run db:push`

---

## Future Considerations

1. **Baseline Allocations**: Create system-wide "Internal" work items for Admin, O&M, Training categories
2. **Load Strategies**: Add front-load option to auto-allocate (currently only even distribution)
3. **Notifications**: Implement real notification system (currently just a toggle in settings)
4. **Compact Mode**: Wire up the compact mode toggle to actually affect UI density
5. **Capacity View Settings**: Persist default view preference (weekly/monthly/quarterly)
