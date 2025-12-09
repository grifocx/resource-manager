# Analysis and Feature Ideas

## Mockup Items with No Functionality

After analyzing the codebase, the following items were identified as mockup elements that currently lack backend integration or frontend logic:

1.  **Sidebar "Settings" Button**:
    -   **Location**: `client/src/components/layout/Layout.tsx`
    -   **Description**: A button labeled "Settings" in the sidebar.
    -   **Current State**: It is a static HTML button with no `onClick` handler and does not navigate to any route.

2.  **Sidebar "Sign Out" Button**:
    -   **Location**: `client/src/components/layout/Layout.tsx`
    -   **Description**: A button labeled "Sign Out" in the sidebar.
    -   **Current State**: It is a static HTML button with no `onClick` handler. There is no authentication flow implemented to support signing out.

3.  **User Profile Display**:
    -   **Location**: `client/src/components/layout/Layout.tsx`
    -   **Description**: The user profile section at the bottom of the sidebar showing "John Doe", "Manager", and an avatar.
    -   **Current State**: The data is hardcoded. There is no functionality to view a profile page or edit user details.

4.  **Dashboard Summary Cards Interaction**:
    -   **Location**: `client/src/pages/Dashboard.tsx`
    -   **Description**: Summary cards for "Total Utilization", "Active Projects", "Team Members", and "Critical Items".
    -   **Current State**: These cards display data but are not interactive. Clicking on them does not drill down into the detailed views (e.g., clicking "Active Projects" does not take you to the Work Items page filtered by Active status).

## Feature Ideas

Based on the analysis and the current state of the application, the following feature ideas are proposed to enhance the application's functionality:

### 1. User Authentication & Profile System
**Description**: Implement a full authentication system using Passport.js (which is already a dependency) to replace the static user profile.
-   **Functionality**:
    -   User Login and Registration pages.
    -   Secure session management.
    -   "Sign Out" functionality in the sidebar.
    -   Dynamic user profile data in the sidebar.
    -   Profile Management page to view and edit user details (Name, Role, Avatar).

### 2. Application Settings Page
**Description**: Create a dedicated Settings page accessible via the Sidebar "Settings" button.
-   **Functionality**:
    -   **Theme Preferences**: Toggle between Light, Dark, and System themes (using `next-themes`).
    -   **Profile Editing**: Allow users to update their personal information and password from this page.
    -   **Display Settings**: Options to customize default views (e.g., default time range for Capacity planning).

### 3. Interactive Dashboard Drill-downs
**Description**: Enhance the Dashboard to be a navigation hub rather than just a read-only display.
-   **Functionality**:
    -   **Active Projects Card**: Clicking navigates to `/work` with the "Projects" tab selected and "In Progress" filter applied.
    -   **Critical Items Card**: Clicking navigates to `/work` with the "Critical" priority filter applied.
    -   **Team Members Card**: Clicking navigates to `/resources`.
    -   **Total Utilization Card**: Clicking navigates to `/capacity`.
