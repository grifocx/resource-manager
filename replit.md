# Nexus - IT Resource Management

## Overview

Nexus is an IT resource management application designed for strategic resource allocation, capacity planning, and portfolio management for modern IT teams. The application provides a dashboard for tracking team resources, work items, allocations, and capacity across projects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Build Tool**: Vite

The frontend follows a page-based architecture with:
- Pages in `client/src/pages/` (Dashboard, Resources, Work, Capacity, Portfolio)
- Shared layout component in `client/src/components/layout/`
- Reusable UI components in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- API queries centralized in `client/src/lib/queries.ts`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful JSON API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Development**: Hot module replacement via Vite middleware

The server structure:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Data access layer interface and implementation
- `server/db.ts` - Database connection configuration
- `server/vite.ts` - Vite dev server integration
- `server/static.ts` - Production static file serving

### Data Model
Defined in `shared/schema.ts` using Drizzle ORM:
- **Users**: Authentication (id, username, password)
- **Teams**: Organizational units (id, name, color)
- **Resources**: Team members (id, name, role, teamId, capacity, avatar, email)
- **Skills**: Competencies that can be assigned to resources
- **ResourceSkills**: Many-to-many relationship between resources and skills
- **WorkItems**: Projects, demands, and KTLO items with status tracking
- **Allocations**: Resource time assignments to work items by week

### Build System
- Development: `tsx` runs TypeScript directly with Vite for frontend HMR
- Production: `esbuild` bundles server, Vite builds frontend to `dist/`
- Database migrations: Drizzle Kit with `db:push` command

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries with schema validation via drizzle-zod

### UI Libraries
- **Radix UI**: Accessible component primitives (dialog, select, tabs, etc.)
- **Recharts**: Dashboard data visualization charts
- **Lucide React**: Icon library
- **date-fns**: Date manipulation utilities
- **embla-carousel-react**: Carousel component

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TailwindCSS v4**: Utility-first CSS framework
- **TypeScript**: Type checking across the full stack

### Session Management
- **connect-pg-simple**: PostgreSQL session store (configured but not actively used yet)
- **express-session**: Session middleware (available for future auth implementation)