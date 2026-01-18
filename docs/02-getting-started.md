# Getting Started

This guide walks you through setting up the MSZ Ecom Store project for development.

## Prerequisites

Before starting, ensure you have:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18.x or later | JavaScript runtime |
| npm | 9.x or later | Package manager |
| Git | Any recent | Version control |
| Supabase Account | - | Backend services |

## Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd mszecomstore
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs all packages defined in `package.json`.

## Step 3: Set Up Supabase

### Option A: Create New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Wait for the project to be provisioned

### Option B: Use Existing Project

If you have an existing Supabase project, skip to Step 4.

### Get Your Credentials

1. In Supabase Dashboard, go to **Settings → API**
2. Copy your:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (safe for client-side)
   - **Service Role Key** (keep secret, server-side only)

## Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```bash
# .env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> ⚠️ **Important**: Never commit `.env` to version control. Add it to `.gitignore`.

## Step 5: Run Database Migrations

The project uses SQL migrations in `supabase/migrations/`. You can run these:

### Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Manual Method

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Run each migration file in order (by timestamp):
   - `20260113081913_initial_schema.sql`
   - `20260113220141_disabling_RLS.sql`
   - `20260113230000_schema_improvements.sql`
   - ... (continue in order)

## Step 6: Start Development Server

```bash
npm run dev
```

This starts the Astro development server:

```
🚀 astro  v5.16.4 started in 1234ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose

watching for file changes...
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## Step 7: Create Admin User (Optional)

To access the admin panel:

1. Sign up for an account through the app
2. In Supabase Dashboard, go to **Table Editor → user_profiles**
3. Find your user and change `role` from `customer` to `admin`
4. Now you can access `/admin` routes

## Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run astro` | Run Astro CLI commands |

## Development Workflow

### Making Changes

1. **Astro Pages** (`src/pages/`): Edit `.astro` files for page structure
2. **React Components** (`src/components/`): Edit `.tsx` files for interactivity
3. **Styles**: Use Tailwind classes or edit `src/styles/globals.css`
4. **Database**: Add migrations to `supabase/migrations/`

### Hot Reloading

Astro's dev server supports hot module replacement:
- **Astro files**: Full page reload
- **React components**: Fast refresh (state preserved)
- **CSS changes**: Instant update

### TypeScript Support

The project uses TypeScript. Key files:
- `tsconfig.json`: TypeScript configuration
- `src/lib/database.types.ts`: Database type definitions

## Common Issues

### "Missing Supabase environment variables"

Ensure your `.env` file exists and has all required variables.

### "CORS error when connecting to Supabase"

Check that your Supabase project URL is correct and the project is active.

### "Auth not working"

1. In Supabase Dashboard, go to **Authentication → URL Configuration**
2. Add `http://localhost:4321` to **Site URL** and **Redirect URLs**

### "Database tables not found"

Run all migrations in order. Check Supabase SQL Editor for errors.

### "React component not rendering"

Ensure you're using the correct client directive:
- `client:load` - Load immediately
- `client:only="react"` - Skip SSR, client-only

## Directory Structure Deep Dive

```
mszecomstore/
├── public/                 # Static assets (copied as-is)
│   └── icons/             # Service icons
│
├── src/
│   ├── components/        # UI components
│   │   ├── admin/        # Admin panel components
│   │   ├── auth/         # Authentication forms
│   │   ├── cart/         # Cart components
│   │   ├── checkout/     # Checkout components
│   │   ├── service/      # Service detail components
│   │   └── ui/           # Reusable UI primitives
│   │
│   ├── contexts/         # React Context providers
│   │   ├── CartContext.tsx
│   │   └── SupabaseAuthContext.tsx
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── useCart.ts
│   │   └── useServices.ts
│   │
│   ├── layouts/          # Page layouts
│   │   ├── Layout.astro       # Main public layout
│   │   └── AdminLayout.astro  # Admin panel layout
│   │
│   ├── lib/              # Utilities and helpers
│   │   ├── api/          # API functions by domain
│   │   ├── utils/        # Utility functions
│   │   ├── supabase.ts   # Supabase client setup
│   │   └── database.types.ts  # TypeScript types
│   │
│   ├── pages/            # File-based routing
│   │   ├── admin/        # Admin pages
│   │   ├── api/          # API endpoints
│   │   ├── services/     # Dynamic service pages
│   │   └── *.astro       # Static pages
│   │
│   ├── providers/        # Provider wrapper components
│   │   ├── AppProviders.tsx
│   │   └── QueryProvider.tsx
│   │
│   └── styles/
│       └── globals.css   # Global styles
│
├── supabase/
│   ├── config.toml       # Supabase local config
│   └── migrations/       # SQL migrations
│
├── astro.config.mjs      # Astro configuration
├── tailwind.config.mjs   # Tailwind configuration
├── tsconfig.json         # TypeScript config
└── package.json          # Dependencies and scripts
```

## Next Steps

After setup, you might want to:

1. Read the [Architecture Deep Dive](./03-architecture.md) to understand how Astro + React work together
2. Review the [Database Schema](./04-database-schema.md) to understand data structures
3. Explore the [Components Guide](./06-components.md) to see available UI components

---

Next: [Architecture Deep Dive](./03-architecture.md)
