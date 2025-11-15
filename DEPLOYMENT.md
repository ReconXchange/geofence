# TrackShift Deployment Guide

This guide covers deploying TrackShift to various production environments.

## Pre-Deployment Checklist

- [ ] All tests passing (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Production build works (`pnpm build`)
- [ ] Database migrations tested
- [ ] Environment variables documented
- [ ] Security review completed
- [ ] Strong JWT_SECRET generated
- [ ] Database backups configured
- [ ] Monitoring set up
- [ ] Error tracking configured

## Environment Variables

Required for production:

```env
DATABASE_URL="postgresql://user:pass@host:5432/trackshift"
JWT_SECRET="<strong-random-64-char-string>"
JWT_EXPIRES_IN="7d"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_LOCATION_PING_INTERVAL="300000"
NODE_ENV="production"
```

Generate secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest deployment option for Next.js apps.

#### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Database**
   - Use Vercel Postgres, or
   - Connect external PostgreSQL (recommended)

4. **Set Environment Variables**
   In Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add all required variables
   - Separate production/preview/development

5. **Deploy**
   - Vercel auto-deploys on push
   - Run migrations: Use Vercel CLI or external script

#### Run Migrations on Vercel:

Create `scripts/migrate-production.js`:
```javascript
const { exec } = require('child_process');
exec('npx prisma migrate deploy', (error, stdout) => {
  console.log(stdout);
  if (error) process.exit(1);
});
```

Add to package.json:
```json
{
  "scripts": {
    "vercel-build": "npx prisma generate && npx prisma migrate deploy && next build"
  }
}
```

### Option 2: Docker + Cloud Provider

Deploy using Docker to AWS, GCP, or Azure.

#### Dockerfile:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Update `next.config.mjs`:
```javascript
const nextConfig = {
  output: 'standalone',
  // ... rest of config
};
```

#### Build and Run:

```bash
# Build image
docker build -t trackshift .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  trackshift
```

#### Deploy to AWS ECS:

1. Push to Amazon ECR
2. Create ECS task definition
3. Configure service with RDS
4. Set up Application Load Balancer
5. Configure auto-scaling

### Option 3: Railway

Simple deployment with built-in PostgreSQL.

#### Steps:

1. **Create Railway Project**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Add PostgreSQL**
   - In Railway dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Copy DATABASE_URL

3. **Configure Variables**
   ```bash
   railway variables set JWT_SECRET="your-secret"
   railway variables set NEXT_PUBLIC_APP_URL="https://yourapp.railway.app"
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Run Migrations**
   ```bash
   railway run npx prisma migrate deploy
   ```

### Option 4: Self-Hosted (VPS)

Deploy to DigitalOcean, Linode, or any VPS.

#### Requirements:
- Ubuntu 22.04 LTS
- Node.js 18+
- PostgreSQL 14+
- Nginx
- PM2

#### Setup Script:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Setup database
sudo -u postgres psql -c "CREATE DATABASE trackshift;"
sudo -u postgres psql -c "CREATE USER trackshift WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE trackshift TO trackshift;"

# Clone and setup app
cd /var/www
git clone <your-repo> trackshift
cd trackshift
npm install -g pnpm
pnpm install

# Set environment variables
cp .env.example .env
nano .env  # Edit with your values

# Run migrations
pnpm prisma:migrate
pnpm prisma:generate

# Build application
pnpm build

# Start with PM2
pm2 start npm --name "trackshift" -- start
pm2 save
pm2 startup

# Configure Nginx
sudo nano /etc/nginx/sites-available/trackshift
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and restart:
```bash
sudo ln -s /etc/nginx/sites-available/trackshift /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Database Migrations

### Running Migrations in Production:

**Important**: Always backup database before migrations!

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Run migrations
npx prisma migrate deploy

# If migration fails, restore backup
psql $DATABASE_URL < backup.sql
```

### Migration Strategy:

1. **Zero-downtime migrations**:
   - Make backwards-compatible changes
   - Deploy new code
   - Run migration
   - Remove old code

2. **Maintenance window**:
   - Schedule downtime
   - Backup database
   - Run migrations
   - Verify application
   - Open to users

## Monitoring & Logging

### Recommended Tools:

- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Uptime**: UptimeRobot, Pingdom
- **Logs**: Papertrail, Loggly

### Setup Sentry:

```bash
pnpm add @sentry/nextjs
```

Create `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Health Check Endpoint:

Create `app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', database: 'disconnected' },
      { status: 503 }
    );
  }
}
```

## Scaling Considerations

### Horizontal Scaling:
- Use load balancer (AWS ALB, Nginx)
- Session storage in Redis
- Shared file storage (S3)
- Database connection pooling

### Vertical Scaling:
- Increase server resources
- Optimize database queries
- Enable Next.js caching
- Use CDN for static assets

### Database Scaling:
- Read replicas for reports
- Connection pooling (PgBouncer)
- Query optimization
- Regular VACUUM operations

## Security Hardening

### Production Checklist:

- [ ] HTTPS enabled (SSL certificate)
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] SQL injection prevention (Prisma handles)
- [ ] XSS prevention (React handles)
- [ ] CSRF tokens for forms
- [ ] Content Security Policy
- [ ] Regular security updates
- [ ] Dependency audits (`pnpm audit`)

### Security Headers:

Add to `next.config.mjs`:
```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ];
}
```

## Backup Strategy

### Database Backups:

```bash
# Automated daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /backups/trackshift_$DATE.sql
# Keep only last 30 days
find /backups -name "trackshift_*.sql" -mtime +30 -delete
```

Run with cron:
```cron
0 2 * * * /path/to/backup-script.sh
```

### File Backups:
- User uploads (if any)
- PWA icons
- Configuration files

## Performance Optimization

### Next.js Optimizations:
- Enable SWC compiler (default in Next.js 15)
- Use Image component for images
- Implement incremental static regeneration
- Enable compression

### Database Optimizations:
- Add indexes for frequent queries
- Use connection pooling
- Implement query caching
- Regular ANALYZE operations

### CDN Setup:
- Cloudflare, Fastly, or AWS CloudFront
- Cache static assets
- Optimize image delivery

## Troubleshooting

### Application Won't Start:
1. Check environment variables
2. Verify database connection
3. Review logs
4. Check port availability

### Database Connection Issues:
1. Verify DATABASE_URL
2. Check PostgreSQL is running
3. Verify firewall rules
4. Check connection limits

### High Memory Usage:
1. Check for memory leaks
2. Optimize database queries
3. Implement caching
4. Add more resources

## Rollback Plan

If deployment fails:

1. **Quick Rollback**: Use platform's rollback feature
2. **Database**: Restore from backup if needed
3. **Verify**: Test critical paths
4. **Communicate**: Notify users of any issues

## Support

For deployment issues:
- Check logs first
- Review documentation
- Search existing issues
- Contact maintainers

---

**Last Updated**: 2025-11-15
**Version**: 1.0
