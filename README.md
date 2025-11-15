# TrackShift – Mobile-First Employee Time & Location Tracking (PWA)

TrackShift is a **mobile-first Progressive Web App (PWA)** that helps companies:

- Manage employee schedules  
- Let employees clock in / clock out from their phones  
- Track employee location **only while they're clocked in**  
- Provide an admin dashboard to view attendance, active shifts, and basic reports

The app is designed to work great on phones (home-screen installable, offline-friendly) but also scales up nicely on tablets and desktops.

---

## Core Features

### For Employees
- **Secure login** (email + password)
- **View today's schedule** (shift start/end time, location)
- **Clock in / clock out** with:
  - Timestamp  
  - Geo-location (GPS) captured at clock-in / clock-out
- **Break tracking** (start / end break)
- **Shift summary** view:
  - Total hours worked today / week
  - Locations visited during the shift
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
  - Assign shifts by employee
- **Location tracking (while clocked in)**
  - Background location pings at configurable intervals
  - View location history for shifts
- **Attendance & compliance reports**
  - Exportable CSV/JSON of hours, overtime, and locations
- **Role-based access control**
  - Admin, Manager, Employee

### Privacy & Compliance
- Location is collected **only while an employee is clocked in**  
- Clear separation between scheduled shifts and actual worked shifts
- Basic audit logging for compliance

---

## Tech Stack

### Frontend & API
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **UI Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query) + React Context for auth
- **Forms:** React Hook Form
- **PWA:** Custom service worker + manifest.webmanifest
- **Location:** HTML5 Geolocation API
- **Maps:** Prepared for Mapbox/Google Maps integration (stub components)

### Backend
- **API:** Next.js Route Handlers (`/app/api/...`)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT-based authentication (HTTP-only cookies)
- **Background tasks:** Simple cron-like jobs or on-demand routes

### Dev Tooling
- **Package Manager:** pnpm (or npm/yarn)
- **Linting:** ESLint + Next.js defaults
- **Formatting:** Prettier
- **Testing:** Vitest

---

## Getting Started

### Prerequisites

- Node.js 20+ (LTS)
- pnpm (or npm/yarn)
- PostgreSQL (running locally or remote URL)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trackshift
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A strong random string for JWT signing
   - `JWT_REFRESH_SECRET`: A strong random string for refresh tokens

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma:generate
   
   # Run migrations
   pnpm prisma:migrate
   
   # Seed sample data
   pnpm prisma:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials

After seeding, you can log in with:

- **Admin:** `admin@trackshift.com` / `admin123`
- **Manager:** `manager@trackshift.com` / `manager123`
- **Employee:** `employee@trackshift.com` / `employee123`

---

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio (database GUI)
- `pnpm prisma:seed` - Seed database with sample data

---

## Project Structure

```
/workspace
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   │   ├── employee/      # Employee views
│   │   └── admin/         # Admin/Manager views
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── auth/             # Auth utilities
│   ├── api-client/       # API client helpers
│   └── prisma.ts         # Prisma client instance
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── public/               # Static assets
└── scripts/              # Utility scripts
```

---

## Development Phases

See `PLAN.md` for detailed development progress and phases.

---

## License

[Add your license here]
