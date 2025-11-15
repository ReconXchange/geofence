# TrackShift – Mobile-First Employee Time & Location Tracking (PWA)

TrackShift is a **mobile-first Progressive Web App (PWA)** that helps companies:

- Manage employee schedules  
- Let employees clock in / clock out from their phones  
- Track employee location **only while they’re clocked in**  
- Review attendance, lateness, and route history via an admin dashboard  

The app is designed to work great on phones (home-screen installable, offline-friendly) but also scales up nicely on tablets and desktops.

---

## Core Features

### For Employees
- **Secure login** (email + password or SSO-ready)
- **View today’s schedule** (shift start/end time, location, role)
- **Clock in / clock out** with:
  - Timestamp  
  - Geo-location (GPS) captured at clock-in / clock-out
- **Break tracking** (start / end break)
- **Shift summary** view:
  - Total hours worked today / week
  - Locations visited during the shift (if tracking is enabled)
- **PWA support**
  - Add to Home Screen
  - Offline fallback screens and queued sync when back online

### For Managers / Admins
- **Dashboard overview**
  - Who is currently clocked in and where
  - Late / missed clock-ins
  - Upcoming shifts
- **Schedule management**
  - Create recurring schedules (weekly, bi-weekly)
  - Assign shifts by employee, role, or location
- **Location tracking (while clocked in)**
  - Background location pings at configurable intervals
  - Map view of today’s active employees
- **Attendance & compliance reports**
  - Exportable CSV/Excel of hours, overtime, and locations
- **Role-based access control**
  - Admin, Manager, Employee

### Privacy & Compliance (Conceptual)
- Location is collected **only while an employee is clocked in**  
- Clear in-app disclosure about what is tracked and why  
- Data retention policies configurable at the server level  

---

## Tech Stack

### Frontend (PWA)
- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 18)
- **Language:** TypeScript
- **UI Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query) + React Context for auth
- **PWA Features:**
  - Service Worker (Next.js custom service worker)
  - Web App Manifest (icons, name, theme color)
  - Background sync for offline clock-ins
- **Maps & Location:**
  - HTML5 Geolocation API
  - Optional: Map provider (e.g. Mapbox / Google Maps JS SDK)

### Backend / API
- **Runtime:** Node.js (LTS)
- **Framework:** Express.js or Next.js Route Handlers (REST API)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching / Queues (Optional):** Redis (for live dashboard, background jobs)
- **Authentication:** JWT-based auth or NextAuth.js (if using OAuth/SSO)
- **Background Jobs:**
  - BullMQ / node-cron for scheduled tasks (e.g. auto-closing stale shifts)

### DevOps / Infra
- **Hosting (Example):**
  - Frontend: Vercel / Netlify  
  - Backend: Render / Railway / AWS ECS / Fly.io  
  - Database: Managed PostgreSQL (Supabase, RDS, Neon, etc.)
- **CI/CD:** GitHub Actions for linting, testing, and deployments
- **Env Management:** dotenv, plus environment-specific configs

---

## High-Level Architecture

1. **Mobile PWA client (Next.js)**  
   - Handles UI, local state, and PWA capabilities.  
   - Communicates with backend via REST (JSON) or GraphQL.

2. **API layer (Node.js / Express or Next.js routes)**  
   - Endpoints for:
     - Auth: `/api/auth/login`, `/api/auth/refresh`
     - Time tracking: `/api/shifts`, `/api/clock-in`, `/api/clock-out`
     - Schedules: `/api/schedules`
     - Location updates: `/api/locations`
     - Reports: `/api/reports`

3. **Database (PostgreSQL via Prisma)**  
   Suggested core tables:
   - `User` (id, name, email, role, status)
   - `Shift` (id, userId, scheduledStart, scheduledEnd, actualStart, actualEnd, status)
   - `LocationPing` (id, shiftId, lat, lng, timestamp)
   - `ScheduleTemplate` (for recurring schedules)
   - `AuditLog` (optional for compliance)

---

## Getting Started (Local Development)

### Prerequisites

- Node.js (LTS, e.g. 20+)
- pnpm / npm / yarn
- PostgreSQL running locally (or remote URL)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/trackshift.git
cd trackshift
