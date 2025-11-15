# TrackShift Quick Start Guide

## Prerequisites

- Node.js 20+ installed
- PostgreSQL database (local or remote)
- pnpm installed (or npm/yarn)

## Setup Steps

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A strong random string (generate with `openssl rand -base64 32`)
   - `JWT_REFRESH_SECRET`: Another strong random string

3. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma:generate
   
   # Run migrations
   pnpm prisma:migrate
   
   # Seed sample data
   pnpm prisma:seed
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Test Credentials

After seeding, you can log in with:

- **Admin:** `admin@trackshift.com` / `admin123`
- **Manager:** `manager@trackshift.com` / `manager123`
- **Employee:** `employee@trackshift.com` / `employee123`

## PWA Icons

To complete PWA setup, add icon files to the `public/` folder:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

You can generate these using tools like:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `components/` - React components
- `lib/` - Utilities and helpers
- `prisma/` - Database schema and migrations
- `public/` - Static assets and PWA files
- `hooks/` - Custom React hooks
- `contexts/` - React contexts (auth, etc.)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm prisma:studio` - Open Prisma Studio (database GUI)
- `pnpm prisma:seed` - Seed database with sample data

## Next Steps

1. Add PWA icons (see above)
2. Configure your production database
3. Set up environment variables for production
4. Deploy to your hosting platform (Vercel, Railway, etc.)

## Troubleshooting

**Database connection issues:**
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check database permissions

**Authentication issues:**
- Clear browser cookies
- Verify JWT secrets are set in `.env`
- Check server logs for errors

**PWA not installing:**
- Ensure you're using HTTPS (or localhost for development)
- Check that manifest.webmanifest is accessible
- Verify service worker is registered (check browser DevTools)
