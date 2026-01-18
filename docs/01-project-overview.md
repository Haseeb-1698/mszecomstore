# Project Overview

## What is MSZ Ecom Store?

MSZ Ecom Store is a **subscription marketplace** web application that allows users to browse, purchase, and manage digital subscription services. Think of it as a one-stop shop for premium subscriptions like streaming services, productivity tools, VPNs, and more.

## Business Model

```
┌─────────────────────────────────────────────────────────────┐
│                    MSZ Ecom Store                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Services (e.g., Netflix, Spotify, Adobe)                   │
│       │                                                     │
│       ├── Plans (Pricing Tiers)                             │
│       │    ├── Basic   (1 month)  - Rs 500                  │
│       │    ├── Standard (3 months) - Rs 1,200               │
│       │    └── Premium (12 months) - Rs 4,000               │
│       │                                                     │
│       └── Features per plan                                 │
│                                                             │
│  Users                                                      │
│       ├── Customers → Browse, Cart, Order                   │
│       └── Admins → Manage services, orders, customers       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Core User Flows

### Customer Journey

1. **Browse Services** → View available subscriptions on the services page
2. **View Details** → Click a service to see plans and pricing
3. **Add to Cart** → Select a plan and add to shopping cart
4. **Checkout** → Provide contact information and place order
5. **Order Tracking** → View order status in dashboard

### Admin Journey

1. **Dashboard** → View key metrics (orders, revenue, customers)
2. **Manage Services** → Create, edit, delete subscription services
3. **Manage Orders** → View and update order statuses
4. **Manage Customers** → View customer information

## Technology Stack

### Frontend Framework: Astro + React

**Why Astro?**
- **Zero JavaScript by default** - Pages load fast
- **Islands Architecture** - Only interactive parts use React
- **File-based routing** - Simple page structure
- **Built-in optimizations** - Images, CSS, prefetching

**Why React?**
- **Rich ecosystem** - Tons of libraries available
- **Component-based** - Reusable UI pieces
- **Hooks** - Clean state management
- **Familiarity** - Large developer community

### Backend: Supabase

Supabase provides:
- **PostgreSQL Database** - Relational data storage
- **Authentication** - User signup/login
- **Row Level Security** - Data protection
- **Real-time Subscriptions** - Live updates (available but not heavily used)
- **Edge Functions** - Serverless functions (available if needed)

### Styling: Tailwind CSS

- **Utility-first** - Style directly in markup
- **Custom Design System** - Extended colors and spacing
- **Dark Mode** - Built-in support via `dark:` prefix
- **Responsive** - Mobile-first with breakpoint prefixes

### State Management

| Layer | Technology | Purpose |
|-------|------------|---------|
| Server State | TanStack Query | Data fetching, caching, sync |
| Auth State | React Context | User session management |
| Cart State | React Context | Shopping cart management |
| UI State | React useState | Component-local state |

## Package Dependencies

### Core Dependencies

```json
{
  "astro": "^5.16.4",           // Meta-framework
  "@astrojs/react": "^4.4.2",   // React integration
  "@astrojs/tailwind": "^6.0.2", // Tailwind integration
  "@astrojs/node": "^9.5.1",    // Node.js adapter for SSR
  
  "react": "^18.3.1",           // UI library
  "react-dom": "^18.3.1",       // React DOM renderer
  
  "@supabase/supabase-js": "^2.90.1", // Supabase client
  "@supabase/ssr": "^0.8.0",          // SSR auth helpers
  
  "@tanstack/react-query": "^5.90.17", // Data fetching
  
  "tailwindcss": "^3.4.19",     // Styling
  "framer-motion": "^12.24.0",  // Animations
  "lucide-react": "^0.562.0"    // Icons
}
```

### Utility Libraries

```json
{
  "clsx": "^2.1.1",              // Conditional classes
  "tailwind-merge": "^3.4.0",   // Merge Tailwind classes
  "class-variance-authority": "^0.7.1" // Variant styling
}
```

## Environment Variables

The application requires these environment variables:

```bash
# Supabase Configuration (Required)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# For admin operations (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Design Philosophy

### 1. Performance First

- Astro's partial hydration means only interactive components load JavaScript
- Static pages are pre-rendered for instant loads
- React components use `client:only` or `client:load` strategically

### 2. Type Safety

- TypeScript throughout the codebase
- Database types generated from schema
- Strict TypeScript configuration

### 3. Component Architecture

- **Astro components** (`.astro`) for static content
- **React components** (`.tsx`) for interactive features
- Clear separation of concerns

### 4. User Experience

- Dark mode support
- Responsive design (mobile-first)
- Loading states and error handling
- Smooth animations with Framer Motion

## Project Goals (Original Intent)

Based on the codebase structure, the original goals appear to be:

1. **E-commerce Platform** - Sell digital subscriptions online
2. **User Authentication** - Secure customer accounts
3. **Admin Management** - Backend for business operations
4. **Modern Tech Stack** - Use latest frameworks and patterns
5. **Scalable Architecture** - Grow with business needs

## Current State

The project includes:

✅ **Implemented**
- Service browsing and detail pages
- User authentication (login/signup)
- Shopping cart with database persistence
- Checkout flow with order creation
- Admin dashboard with statistics
- Service management (CRUD)
- Order management
- Dark/light theme
- Responsive design

⏳ **Partially Implemented**
- Payment processing (order placed, but no payment gateway)
- Subscription management (tables exist, limited UI)
- Customer management (view only)

📋 **Future Considerations**
- Payment gateway integration (EasyPaisa, JazzCash)
- Email notifications
- Real-time order updates
- Analytics dashboard
- Customer subscription portal

## Key Architectural Decisions

### 1. Hybrid Rendering

The app uses both static and server-side rendering:
- **Static**: Home, services list, about, contact pages
- **Dynamic**: Cart, checkout, dashboard (require auth)

### 2. Database-Stored Carts

Carts are persisted in the database (not localStorage) because:
- Cart survives across devices
- Works with authentication
- Admins can see pending carts

### 3. Cross-Tab Synchronization

Cart updates use `BroadcastChannel` API to sync across browser tabs without full page refresh.

### 4. Role-Based Access

Users have roles (`customer` or `admin`) stored in `user_profiles` table, controlling access to admin features.

---

Next: [Getting Started](./02-getting-started.md)
