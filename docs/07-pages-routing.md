# Pages & Routing

This document explains the page structure and routing system in MSZ Ecom Store.

## Astro File-Based Routing

Astro uses **file-based routing** - each file in `src/pages/` becomes a route.

```
src/pages/
├── index.astro          →  /
├── about.astro          →  /about
├── contact.astro        →  /contact
├── services.astro       →  /services
├── cart.astro           →  /cart
├── checkout.astro       →  /checkout
├── login.astro          →  /login
├── signup.astro         →  /signup
├── dashboard.astro      →  /dashboard
├── orders.astro         →  /orders
├── subscriptions.astro  →  /subscriptions
├── terms.astro          →  /terms
├── privacy.astro        →  /privacy
├── how-it-works.astro   →  /how-it-works
├── 404.astro            →  /404 (Not Found)
├── 500.astro            →  /500 (Server Error)
├── services/
│   └── [slug].astro     →  /services/:slug (dynamic)
├── order/
│   └── [id].astro       →  /order/:id (dynamic)
├── admin/
│   ├── index.astro      →  /admin
│   ├── services.astro   →  /admin/services
│   ├── orders.astro     →  /admin/orders
│   ├── customers.astro  →  /admin/customers
│   ├── settings.astro   →  /admin/settings
│   └── signup.astro     →  /admin/signup
└── api/                 →  API routes
```

## Page Categories

### Public Pages (No Auth Required)

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.astro` | Landing page with hero, features, etc. |
| `/about` | `about.astro` | About the company |
| `/contact` | `contact.astro` | Contact information/form |
| `/services` | `services.astro` | Service catalog |
| `/services/:slug` | `services/[slug].astro` | Individual service details |
| `/how-it-works` | `how-it-works.astro` | Explanation of the process |
| `/terms` | `terms.astro` | Terms of service |
| `/privacy` | `privacy.astro` | Privacy policy |
| `/login` | `login.astro` | Login form |
| `/signup` | `signup.astro` | Registration form |

### Protected Pages (Auth Required)

| Route | File | Description |
|-------|------|-------------|
| `/cart` | `cart.astro` | Shopping cart |
| `/checkout` | `checkout.astro` | Checkout process |
| `/dashboard` | `dashboard.astro` | User dashboard |
| `/orders` | `orders.astro` | Order history |
| `/subscriptions` | `subscriptions.astro` | Active subscriptions |
| `/order/:id` | `order/[id].astro` | Order details |

### Admin Pages (Admin Role Required)

| Route | File | Description |
|-------|------|-------------|
| `/admin` | `admin/index.astro` | Admin dashboard |
| `/admin/services` | `admin/services.astro` | Service management |
| `/admin/orders` | `admin/orders.astro` | Order management |
| `/admin/customers` | `admin/customers.astro` | Customer list |
| `/admin/settings` | `admin/settings.astro` | Admin settings |

## Page Anatomy

### Static Page Example

```astro
---
// Frontmatter - runs at build time on server
import Layout from '../layouts/Layout.astro';
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';
---

<!-- Template - rendered to HTML -->
<Layout title="MSZ Software House">
  <Hero />
  <Features />
</Layout>
```

### Data-Fetching Page Example

```astro
---
import Layout from '../layouts/Layout.astro';
import { getServices } from '../lib/api/services';

// Data fetched at BUILD time
const services = await getServices();
---

<Layout title="Services">
  <div class="grid grid-cols-3 gap-6">
    {services.map(service => (
      <div class="card">
        <h2>{service.name}</h2>
        <p>{service.description}</p>
        <a href={`/services/${service.slug}`}>View Details</a>
      </div>
    ))}
  </div>
</Layout>
```

### Interactive Page Example

```astro
---
import Layout from '../layouts/Layout.astro';
import CartPageWrapper from '../components/cart/CartPageWrapper';
---

<Layout title="Shopping Cart">
  <!-- React component handles all interactivity -->
  <CartPageWrapper client:only="react" />
</Layout>
```

## Dynamic Routes

### `[slug].astro` - Service Detail Pages

Uses `getStaticPaths()` to generate pages at build time:

```astro
---
// src/pages/services/[slug].astro
import Layout from '../../layouts/Layout.astro';
import { getServices } from '../../lib/api/services';
import ServiceDetail from '../../components/service/ServiceDetail';

export async function getStaticPaths() {
  const services = await getServices();
  
  // Generate a path for each service
  return services.map(service => ({
    params: { slug: service.slug },
    props: { service }, // Pass full service data
  }));
}

// Get service from props (already fetched above)
const { service } = Astro.props;

// Transform plans for component
const plans = service.plans.map(plan => ({
  id: plan.id,
  name: plan.name,
  // ... transform data
}));
---

<Layout title={`${service.name} - MSZ Ecom Store`}>
  <ServiceDetail
    client:load
    serviceId={service.id}
    serviceName={service.name}
    plans={plans}
  />
</Layout>
```

**Result:** Pre-renders `/services/netflix`, `/services/spotify`, etc.

### `[id].astro` - Order Detail Pages

Similar pattern for order details (if implemented for SSR).

## Layouts

### Main Layout (`Layout.astro`)

Used by all public pages.

```astro
---
import '../styles/globals.css';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

export interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <!-- Theme initialization script -->
    <script is:inline>
      // Apply dark mode before page renders
      const theme = localStorage.getItem('theme') || 
        (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', theme === 'dark');
    </script>
  </head>
  <body class="bg-cream-50 dark:bg-charcoal-900">
    <div class="flex min-h-screen flex-col">
      <Header />
      <main class="flex-1">
        <slot /> <!-- Page content goes here -->
      </main>
      <Footer />
    </div>
  </body>
</html>
```

### Admin Layout (`AdminLayout.astro`)

Used by admin pages (no header/footer).

```astro
---
import '../styles/globals.css';

export interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Similar head content -->
    <title>{title}</title>
  </head>
  <body class="bg-cream-50 dark:bg-charcoal-900">
    <slot /> <!-- Admin shell renders here -->
  </body>
</html>
```

## Protected Routes

### Client-Side Protection Pattern

Admin pages use client-side auth checks:

```astro
---
// src/pages/admin/index.astro
import AdminLayout from '../../layouts/AdminLayout.astro';
import DashboardPage from '../../components/admin/DashboardPage';
---

<AdminLayout title="Admin Dashboard">
  <!-- DashboardPage includes auth guard -->
  <DashboardPage client:only="react" />
</AdminLayout>
```

```tsx
// DashboardPage.tsx
export const DashboardPage = () => (
  <AdminPageWrapper requireAdmin={true}>
    <DashboardContent />
  </AdminPageWrapper>
);
```

```tsx
// AdminPageWrapper.tsx
export const AdminPageWrapper = ({ requireAdmin, children }) => {
  const { user, isAdmin, isReady } = useSupabaseAuth();

  if (!isReady) return <LoadingScreen />;
  if (!user) {
    window.location.href = '/login?redirect=/admin';
    return null;
  }
  if (requireAdmin && !isAdmin) return <AccessDenied />;

  return <AdminShell>{children}</AdminShell>;
};
```

### Customer Protected Pages

Cart and checkout pages check auth in the React component:

```tsx
// CartPage.tsx
if (!isAuthenticated) {
  return (
    <div>
      <h2>Sign in to view your cart</h2>
      <a href="/login?redirect=/cart">Sign In</a>
    </div>
  );
}
```

## Error Pages

### 404 Page

```astro
---
// src/pages/404.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="Page Not Found">
  <div class="text-center py-24">
    <h1 class="text-6xl font-bold">404</h1>
    <p class="mt-4 text-xl">Page not found</p>
    <a href="/" class="mt-8 inline-block btn-primary">
      Go Home
    </a>
  </div>
</Layout>
```

### 500 Page

```astro
---
// src/pages/500.astro
import Layout from '../layouts/Layout.astro';
---

<Layout title="Server Error">
  <div class="text-center py-24">
    <h1 class="text-6xl font-bold">500</h1>
    <p class="mt-4 text-xl">Something went wrong</p>
  </div>
</Layout>
```

## API Routes

Located in `src/pages/api/`, these are server-side endpoints.

```
src/pages/api/
└── logs/
```

API routes return JSON responses:

```typescript
// Example API route structure
export async function GET({ request }) {
  return new Response(JSON.stringify({ data: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }) {
  const body = await request.json();
  // Process request...
  return new Response(JSON.stringify({ success: true }));
}
```

## URL Parameters & Query Strings

### Reading URL Parameters

```astro
---
// src/pages/services/[slug].astro
const { slug } = Astro.params;
---
```

### Reading Query Strings

In React components:
```tsx
const urlParams = new URLSearchParams(window.location.search);
const redirect = urlParams.get('redirect');
```

In Astro:
```astro
---
const url = new URL(Astro.request.url);
const query = url.searchParams.get('query');
---
```

## Navigation Patterns

### Standard Links

```astro
<a href="/services">Browse Services</a>
```

### Programmatic Navigation (React)

```tsx
// Full page navigation (reloads)
window.location.href = '/dashboard';

// Or with redirect parameter
window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
```

### Internal Links with State

Pass state via URL parameters:
```tsx
<a href={`/checkout?plan=${planId}`}>Checkout</a>
```

## SEO Considerations

### Page Titles

Set via layout prop:
```astro
<Layout title="Services - MSZ Ecom Store">
```

### Meta Tags

Can add in frontmatter:
```astro
---
const description = "Browse our premium subscription services";
---

<Layout title="Services">
  <Fragment slot="head">
    <meta name="description" content={description} />
  </Fragment>
</Layout>
```

### Sitemap

Astro can generate sitemaps with `@astrojs/sitemap` integration.

## Page Loading States

### React Components

```tsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}
```

### Skeleton Loading

```tsx
if (isLoading) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} height="200px" />
      ))}
    </div>
  );
}
```

---

Next: [Cart & Checkout](./08-cart-checkout.md)
