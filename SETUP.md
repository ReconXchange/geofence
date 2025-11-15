# TrackShift Setup Guide

Complete setup instructions for getting TrackShift running locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher (recommended) or npm
- **PostgreSQL** 14.x or higher
- **Git**

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trackshift
```

### 2. Install Dependencies

```bash
pnpm install
```

Or with npm:

```bash
npm install
```

### 3. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

1. Create a new database:

```bash
createdb trackshift
```

2. Note your database credentials for the next step.

#### Option B: Using Docker

```bash
docker run --name trackshift-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=trackshift \
  -p 5432:5432 \
  -d postgres:14
```

### 4. Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://user:password@localhost:5432/trackshift?schema=public"

# Auth - Generate a strong secret for production
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Location tracking interval (milliseconds, default 5 minutes)
NEXT_PUBLIC_LOCATION_PING_INTERVAL="300000"
```

**Important**: Generate a strong JWT secret for production:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Set Up Database Schema

Run Prisma migrations to create the database schema:

```bash
pnpm prisma:migrate
```

This will:
- Create all necessary tables
- Set up indexes
- Apply any pending migrations

### 6. Seed the Database (Optional but Recommended)

Populate the database with sample data:

```bash
pnpm prisma:seed
```

This creates:
- **Admin user**: admin@trackshift.com / admin123
- **Employee user**: employee@trackshift.com / employee123
- Sample schedule templates
- Sample shifts

### 7. Generate Prisma Client

```bash
pnpm prisma:generate
```

### 8. Start the Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Testing the Application

### 1. Login as Employee

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click "Sign In"
3. Use credentials: `employee@trackshift.com` / `employee123`
4. You'll be redirected to the employee dashboard

### 2. Test Clock In/Out

1. Click "Clock In" button
2. Allow location access when prompted
3. You should see your active shift
4. Location pings will be sent every 5 minutes (configurable)
5. Click "Clock Out" to end the shift

### 3. Login as Admin

1. Logout from employee account
2. Login with: `admin@trackshift.com` / `admin123`
3. You'll see the admin dashboard with active employees

### 4. Test PWA Installation

1. Open the app in Chrome or Edge
2. Look for the install prompt in the address bar
3. Click "Install" to add to home screen
4. The app will work offline for cached pages

## Database Management

### View Data with Prisma Studio

```bash
pnpm prisma:studio
```

This opens a web interface at [http://localhost:5555](http://localhost:5555) where you can:
- View all tables
- Edit records
- Run queries

### Create a New Migration

After modifying `prisma/schema.prisma`:

```bash
pnpm prisma:migrate
```

### Reset Database

To clear all data and re-run migrations:

```bash
npx prisma migrate reset
```

⚠️ This will delete all data!

## Running Tests

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test -- --watch
```

## Production Build

### Build the Application

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## Deployment

### Environment Variables for Production

Ensure these are set in your production environment:

```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-random-secret-at-least-32-characters"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

### Deployment Platforms

#### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

#### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t trackshift .
docker run -p 3000:3000 trackshift
```

### Database Migrations in Production

Run migrations before deploying new code:

```bash
npx prisma migrate deploy
```

## Troubleshooting

### "Can't reach database server"

- Verify PostgreSQL is running
- Check DATABASE_URL in `.env`
- Ensure database exists

### "Module not found" errors

```bash
rm -rf node_modules .next
pnpm install
```

### Location not working

- Ensure HTTPS in production (required for geolocation)
- Check browser permissions
- Test on a real device (some browsers restrict location in dev)

### Service Worker not updating

- Clear browser cache
- Unregister old service worker in DevTools
- Hard reload (Ctrl+Shift+R)

## Development Tips

### Enable Hot Reload for Prisma

When modifying the schema, run:

```bash
pnpm prisma:generate --watch
```

### View Logs

Development logs are verbose by default. In production:

```bash
NODE_ENV=production pnpm start
```

### Code Formatting

```bash
pnpm prettier --write .
```

### Linting

```bash
pnpm lint
```

## Support

For issues and questions:
- Check the [README.md](./README.md)
- Review the [PLAN.md](./PLAN.md) for architecture details
- Open a GitHub issue

## Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS
- [ ] Review CORS settings
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure proper logging
- [ ] Review user permissions
- [ ] Test authentication flows
- [ ] Audit dependencies for vulnerabilities
- [ ] Set up monitoring and alerts
