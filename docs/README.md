# MSZ Ecom Store - Documentation

Welcome to the comprehensive documentation for **MSZ Ecom Store** (also referred to as "MSZ Software House"), a subscription marketplace e-commerce platform built with Astro and React.

## 📚 Documentation Index

This documentation is organized into the following sections:

| Document | Description |
|----------|-------------|
| [Project Overview](./01-project-overview.md) | High-level architecture, tech stack, and project goals |
| [Getting Started](./02-getting-started.md) | Installation, setup, and running the project |
| [Architecture Deep Dive](./03-architecture.md) | Detailed explanation of the Astro + React architecture |
| [Database Schema](./04-database-schema.md) | Complete database structure with Supabase |
| [Authentication](./05-authentication.md) | Auth flow, user management, and admin access |
| [Components Guide](./06-components.md) | All UI components explained |
| [Pages & Routing](./07-pages-routing.md) | Page structure and routing patterns |
| [Cart & Checkout](./08-cart-checkout.md) | Shopping cart and checkout implementation |
| [Admin Panel](./09-admin-panel.md) | Admin dashboard and management features |
| [State Management](./10-state-management.md) | Contexts, hooks, and data flow |
| [API Layer](./11-api-layer.md) | Client-side API functions and data fetching |
| [Styling Guide](./12-styling.md) | Tailwind CSS configuration and design system |
| [Deployment](./13-deployment.md) | Building and deploying the application |

## 🎯 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔑 Key Concepts

### This is a Hybrid Application

MSZ Ecom Store uses **Astro** as the meta-framework with **React** for interactive components. This means:

- **Static pages** are rendered at build time by Astro (fast, SEO-friendly)
- **Interactive features** use React components hydrated on the client
- **Best of both worlds**: Fast initial loads + Rich interactivity

### Core Technologies

| Technology | Purpose |
|------------|---------|
| [Astro 5.x](https://astro.build) | Meta-framework for building the site |
| [React 18.x](https://react.dev) | UI components and interactivity |
| [Supabase](https://supabase.com) | Database, authentication, and backend |
| [Tailwind CSS](https://tailwindcss.com) | Styling and design system |
| [TanStack Query](https://tanstack.com/query) | Data fetching and caching |

### Business Domain

This is a **subscription marketplace** where:
- **Services** represent subscription products (Netflix, Spotify, etc.)
- **Plans** are pricing tiers for each service (Basic, Standard, Premium)
- **Orders** track customer purchases
- **Carts** enable shopping cart functionality
- **Users** can be customers or admins

## 📁 Project Structure at a Glance

```
mszecomstore/
├── src/
│   ├── components/      # UI components (Astro + React)
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utilities, API functions, types
│   ├── pages/           # Astro pages (file-based routing)
│   ├── providers/       # Provider wrapper components
│   └── styles/          # Global styles
├── supabase/
│   └── migrations/      # Database migrations
├── public/              # Static assets
└── docs/                # This documentation
```

## 🚦 Navigation Tips

- **New to the project?** Start with [Project Overview](./01-project-overview.md) and [Getting Started](./02-getting-started.md)
- **New to Astro/React?** Read [Architecture Deep Dive](./03-architecture.md) carefully
- **Working on features?** Check [Components Guide](./06-components.md) and [State Management](./10-state-management.md)
- **Database changes?** Review [Database Schema](./04-database-schema.md)

---

*Documentation last updated: January 2026*
