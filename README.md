# Resource-IT

Resource-IT is a comprehensive IT resource management, capacity planning, and portfolio management application. It helps organizations track work items, manage team resources, forecast capacity, and oversee portfolio strategy.

## Features

-   **Dashboard**: A high-level overview of resource utilization, active projects, team members, and critical items, including visual charts for team utilization and work distribution.
-   **Resource Management**: Manage team members, their roles, team assignments, and weekly capacity.
-   **Work Items**: Track Projects, Demands, and KTLO (Keep the Lights On) tasks with details like priority, status, dates, and progress.
-   **Capacity Planning**: Forecast resource needs and manage allocations across weeks. visualized in a grid view to identify over/under-utilization.
-   **Portfolio Strategy**: Organize work items into Programs and Portfolios to track budgets and overall progress at a strategic level.

## Tech Stack

**Frontend:**
-   **Framework**: React (v19) with Vite
-   **Routing**: Wouter
-   **Styling**: Tailwind CSS, Shadcn/ui (Radix UI)
-   **Charts**: Recharts
-   **State Management**: TanStack React Query

**Backend:**
-   **Server**: Express.js
-   **Database ORM**: Drizzle ORM
-   **Database**: PostgreSQL
-   **Validation**: Zod

## Project Structure

-   `client/`: Contains the frontend React application.
    -   `src/components/`: Reusable UI components.
    -   `src/pages/`: Main application pages (Dashboard, Resources, Work, Capacity, Portfolio).
    -   `src/lib/`: Utility functions and API query hooks.
-   `server/`: Contains the backend Express application.
    -   `routes.ts`: API route definitions.
    -   `storage.ts`: Database storage implementation.
-   `shared/`: Shared code between client and server (e.g., Drizzle schema).

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    Ensure you have a PostgreSQL database available. The application uses Drizzle ORM.
    You may need to configure the `DATABASE_URL` environment variable.

    To push the schema to the database:
    ```bash
    npm run db:push
    ```

3.  **Run Development Server**:
    Start the backend and frontend development servers concurrently:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5000` (or the port specified in the console).

4.  **Build for Production**:
    To build the application for production:
    ```bash
    npm run build
    ```

5.  **Start Production Server**:
    ```bash
    npm start
    ```

## Scripts

-   `dev`: Runs the full stack in development mode.
-   `dev:client`: Runs only the Vite frontend dev server.
-   `build`: Builds the frontend and backend.
-   `start`: Starts the production server.
-   `check`: Runs TypeScript type checking.
-   `db:push`: Pushes Drizzle schema changes to the database.
