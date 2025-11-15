# TrackShift

A production-ready, mobile-first Progressive Web App (PWA) for employee time tracking and schedule management.

## Features

### For Employees
- 📱 Mobile-first, responsive interface
- ⏰ Clock in/out from any device
- 📍 Automatic location tracking (only while clocked in)
- 📅 View today's schedule and shift history
- ⏸️ Start and end breaks
- 📊 See hours worked (daily, weekly)

### For Managers/Admins
- 👥 Manage employee schedules
- 🗺️ View active employees and their locations
- 📈 Track attendance and generate reports
- 📋 Create recurring schedule templates
- 📥 Export data (CSV/JSON)
- 🔍 Basic audit trail of changes

### Privacy & Compliance
- Location data collected ONLY between clock-in and clock-out
- Clear distinction between scheduled and actual worked hours
- Audit log for accountability
- Secure authentication with JWT

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth
- **PWA**: Custom service worker + manifest
- **Geolocation**: HTML5 Geolocation API

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

## Getting Started

### 1. Clone and Install

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` with your settings:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trackshift"
JWT_SECRET="your-super-secret-jwt-key"
```

### 3. Set Up Database

```bash
# Run migrations
pnpm prisma:migrate

# Seed sample data (optional)
pnpm prisma:seed

# Open Prisma Studio to view data
pnpm prisma:studio
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Sample Users (after seeding)

- **Admin**: admin@trackshift.com / admin123
- **Employee**: employee@trackshift.com / employee123

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm prisma:seed` - Seed database with sample data

## Project Structure

```
/workspace/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── shifts/       # Shift management
│   │   ├── location-pings/ # Location tracking
│   │   └── reports/      # Reports & exports
│   ├── auth/             # Auth pages (login, register)
│   ├── dashboard/        # Main app dashboards
│   │   ├── employee/    # Employee views
│   │   └── admin/       # Admin/manager views
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # Reusable React components
├── lib/                   # Utility functions
│   ├── auth/             # Auth helpers
│   ├── api-client/       # API client utilities
│   └── pwa/              # PWA utilities
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Prisma schema
│   └── seed.ts           # Seed script
└── public/               # Static assets
    └── manifest.webmanifest  # PWA manifest
```

## PWA Installation

TrackShift can be installed as a Progressive Web App:

1. Open the app in a supported browser (Chrome, Safari, Edge)
2. Look for the "Install" prompt in the address bar
3. Click "Install" to add TrackShift to your home screen

The app will work offline and provide a native app-like experience.

## Development Guidelines

- **Mobile-First**: All UI components are designed for mobile first
- **Type Safety**: Strict TypeScript everywhere
- **Privacy**: Location tracking only during active shifts
- **Security**: HTTP-only cookies, password hashing, JWT tokens

## API Documentation

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user

### Shifts
- `GET /api/shifts` - List shifts
- `POST /api/shifts/clock-in` - Clock in
- `POST /api/shifts/clock-out` - Clock out
- `GET /api/shifts/current` - Get active shift

### Location
- `POST /api/location-pings` - Submit location ping

### Reports (Admin)
- `GET /api/reports/attendance` - Get attendance report

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
