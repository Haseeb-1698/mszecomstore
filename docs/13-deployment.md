# Deployment Guide

This document covers building, deploying, and configuring the application for production.

## Build Process

### Build Command

```bash
npm run build
```

This runs `astro build` which:
1. Compiles TypeScript
2. Bundles JavaScript/CSS
3. Generates static pages (SSG) where possible
4. Prepares server-side code for Node.js runtime

### Output Structure

```
dist/
├── client/                 # Static assets (served directly)
│   ├── _astro/             # Hashed JS/CSS bundles
│   ├── icons/              # Public icons
│   └── favicon.svg
├── server/                 # Server-side code
│   ├── entry.mjs           # Server entry point
│   ├── pages/              # Compiled page handlers
│   └── chunks/             # Code-split chunks
└── _worker.js              # (If using Cloudflare adapter)
```

## Environment Variables

### Required Variables

Create a `.env` file for local development:

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-side only (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variable Naming Convention

| Prefix | Accessible From | Example |
|--------|-----------------|---------|
| `PUBLIC_` | Client + Server | `PUBLIC_SUPABASE_URL` |
| No prefix | Server only | `SUPABASE_SERVICE_ROLE_KEY` |

### Accessing Variables

```typescript
// In Astro components (.astro files)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

// In API routes
export const POST: APIRoute = async ({ request }) => {
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
};

// In React components (only PUBLIC_ vars)
const url = import.meta.env.PUBLIC_SUPABASE_URL;
```

## Deployment Options

### Option 1: Node.js Server (Recommended)

The project uses `@astrojs/node` adapter for SSR.

#### Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'  // or 'middleware'
  }),
});
```

#### Running the Server

```bash
# Build
npm run build

# Start production server
node ./dist/server/entry.mjs

# Or with environment variables
PORT=3000 HOST=0.0.0.0 node ./dist/server/entry.mjs
```

#### PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start ./dist/server/entry.mjs --name "mszecomstore"

# View logs
pm2 logs mszecomstore

# Restart
pm2 restart mszecomstore

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

#### PM2 Ecosystem File

Create `ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [{
    name: 'mszecomstore',
    script: './dist/server/entry.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

### Option 2: Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", "./dist/server/entry.mjs"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PUBLIC_SUPABASE_URL=${PUBLIC_SUPABASE_URL}
      - PUBLIC_SUPABASE_ANON_KEY=${PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped
```

### Option 3: Vercel Deployment

#### Install Vercel Adapter

```bash
npm install @astrojs/vercel
```

#### Update Configuration

```javascript
// astro.config.mjs
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
});
```

#### Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 4: Netlify Deployment

#### Install Netlify Adapter

```bash
npm install @astrojs/netlify
```

#### Update Configuration

```javascript
// astro.config.mjs
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
});
```

## Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/mszecomstore
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Proxy to Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static assets caching
    location /_astro/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Supabase Production Setup

### 1. Create Production Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note the URL and API keys

### 2. Run Migrations

```bash
# Link to production project
npx supabase link --project-ref <project-ref>

# Push migrations
npx supabase db push
```

### 3. Configure Authentication

In Supabase Dashboard → Authentication → Settings:

- **Site URL**: `https://yourdomain.com`
- **Redirect URLs**: 
  - `https://yourdomain.com/login`
  - `https://yourdomain.com/signup`

### 4. Enable Row Level Security (Optional)

If you want to enable RLS in production:

```sql
-- Enable RLS on tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active services" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart" ON carts
  FOR ALL USING (auth.uid() = user_id);
```

## Performance Optimization

### 1. Enable Compression

```javascript
// With Node adapter, enable compression middleware
// Or use nginx gzip:

// In nginx.conf:
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml 
           application/javascript application/json;
```

### 2. Asset Caching

```nginx
# In nginx config
location /_astro/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /icons/ {
    expires 30d;
    add_header Cache-Control "public";
}
```

### 3. Image Optimization

```astro
---
// Use Astro's Image component for optimization
import { Image } from 'astro:assets';
import myImage from '../assets/hero.png';
---

<Image src={myImage} alt="Hero" width={800} height={600} />
```

## Monitoring & Logging

### PM2 Monitoring

```bash
# View real-time metrics
pm2 monit

# View logs
pm2 logs

# View process list
pm2 list

# View detailed info
pm2 show mszecomstore
```

### Error Tracking (Sentry)

```bash
npm install @sentry/astro
```

```javascript
// astro.config.mjs
import sentry from '@sentry/astro';

export default defineConfig({
  integrations: [
    sentry({
      dsn: 'https://your-dsn@sentry.io/project',
      sourceMapsUploadOptions: {
        project: 'mszecomstore',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
});
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          PUBLIC_SUPABASE_URL: ${{ secrets.PUBLIC_SUPABASE_URL }}
          PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.PUBLIC_SUPABASE_ANON_KEY }}
      
      - name: Deploy to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          source: "dist/*"
          target: "/var/www/mszecomstore"
      
      - name: Restart PM2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/mszecomstore
            pm2 restart mszecomstore
```

## Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Supabase auth redirect URLs configured
- [ ] Error tracking configured

### Post-Deployment

- [ ] Test all authentication flows
- [ ] Test cart and checkout
- [ ] Verify admin access
- [ ] Check mobile responsiveness
- [ ] Monitor error logs
- [ ] Set up uptime monitoring

---

Previous: [Styling Guide](./12-styling.md)
