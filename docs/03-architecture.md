# Architecture Deep Dive

This document explains how Astro and React work together in this project, which is crucial for understanding the codebase.

## The Astro + React Paradigm

### What is Astro?

Astro is a **content-focused** web framework that uses an "islands architecture." It allows you to:

1. Write components in multiple frameworks (React, Vue, Svelte, etc.)
2. Render as much as possible at **build time** (static HTML)
3. Hydrate only the interactive parts (JavaScript "islands")

### Visual Representation

```
┌─────────────────────────────────────────────────────────────┐
│                    Astro Page (.astro)                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Static HTML (No JS)                    │    │
│  │  Header, Footer, Content, Images, Text              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐       │
│  │   React     │  │   React     │  │   React        │       │
│  │   Island    │  │   Island    │  │   Island       │       │
│  │ (Cart Icon) │  │ (Auth Btn)  │  │(Theme Switcher)│       │
│  └─────────────┘  └─────────────┘  └────────────────┘       │
│                                                             │
│  These "islands" hydrate with JavaScript                    │
└─────────────────────────────────────────────────────────────┘
```

## File Types and Their Roles

### `.astro` Files - Server Components

Astro components run **only on the server** (at build time or request time).

```astro
---
// This is the "frontmatter" - runs on server
import Layout from '../layouts/Layout.astro';
import { getServices } from '../lib/api/services';

// This data fetch happens at BUILD TIME
const services = await getServices();
---

<!-- This HTML is rendered at build time -->
<Layout title="Services">
  <h1>Our Services</h1>
  
  {services.map(service => (
    <div class="service-card">
      <h2>{service.name}</h2>
      <p>{service.description}</p>
    </div>
  ))}
</Layout>
```

**Key Points:**
- Code in `---` fences runs on the server
- No client-side JavaScript by default
- Can fetch data, import files, use Node.js APIs
- Outputs static HTML

### `.tsx` Files - Client Components

React components can run on both server (SSR) and client.

```tsx
// This can be rendered on server AND client
import React, { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

**Key Points:**
- Uses React hooks and state
- Needs JavaScript to work
- Must be "hydrated" on the client

## Client Directives Explained

When using React components in Astro, you MUST specify HOW to hydrate them:

### `client:load`

```astro
<LoginForm client:load />
```

- **When**: Hydrates immediately when page loads
- **Use For**: Critical interactive elements (forms, auth)
- **Trade-off**: Adds to initial page load

### `client:only="react"`

```astro
<CartIcon client:only="react" />
```

- **When**: Never rendered on server, only on client
- **Use For**: Components that access browser APIs or have auth-dependent rendering
- **Trade-off**: Flash of empty content before hydration

### `client:visible`

```astro
<HeavyChart client:visible />
```

- **When**: Hydrates when component scrolls into viewport
- **Use For**: Below-the-fold interactive content
- **Trade-off**: May feel slow when user scrolls quickly

### `client:idle`

```astro
<Analytics client:idle />
```

- **When**: Hydrates when browser is idle
- **Use For**: Low-priority features
- **Trade-off**: May not hydrate on busy pages

### No Directive

```astro
<StaticCard /> <!-- No client directive -->
```

- **When**: Never hydrates - static HTML only
- **Use For**: Non-interactive content
- **Trade-off**: No JavaScript features work

## Why This Project Uses `client:only="react"`

Many components in this project use `client:only="react"` because:

### 1. Auth-Dependent Rendering

```astro
<!-- Header.astro -->
<AuthButtons client:only="react" />
```

The `AuthButtons` component shows different UI based on whether the user is logged in. Since auth state is only available client-side, SSR would show the wrong content, causing a "flash" when it corrects.

### 2. Browser API Access

```astro
<CartIcon client:only="react" />
```

The `CartIcon` uses `BroadcastChannel` API and `localStorage` to sync cart state across tabs. These APIs don't exist on the server.

### 3. Context Providers

```astro
<CartPageWrapper client:only="react" />
```

Components wrapped in React Context providers must hydrate together to share state properly.

## The Provider Pattern

### Problem: Multiple React Islands Don't Share State

If you have two separate React islands:

```astro
<CartIcon client:only="react" />     <!-- Island 1 -->
<CartPage client:only="react" />     <!-- Island 2 -->
```

Each island has its own React tree. They CAN'T share context directly!

### Solution: Provider Wrapper Components

This project solves it by:

1. **Wrapping full pages** in a provider component
2. **Using BroadcastChannel** for cross-component communication

```tsx
// AppProviders.tsx - Wraps entire page content
export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <SupabaseAuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </SupabaseAuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
};
```

```tsx
// CartPageWrapper.tsx - Uses providers
export const CartPageWrapper: React.FC = () => {
  return (
    <AppProviders>
      <CartPage />
    </AppProviders>
  );
};
```

```astro
<!-- cart.astro -->
<Layout title="Cart">
  <CartPageWrapper client:only="react" />
</Layout>
```

## Data Fetching Patterns

### Pattern 1: Build-Time Fetching (Static Pages)

```astro
---
// services.astro
import { getServices } from '../lib/api/services';

// Fetched at BUILD time - data is "baked in"
const services = await getServices();
---

<Layout>
  {services.map(s => <ServiceCard service={s} />)}
</Layout>
```

**Best For**: Content that rarely changes (services list, marketing pages)

### Pattern 2: Client-Side Fetching (Dynamic Pages)

```tsx
// CartPage.tsx
import { useCartContext } from '../contexts/CartContext';

export const CartPage: React.FC = () => {
  // Fetched on client, after page loads
  const { cart, isLoading } = useCartContext();
  
  if (isLoading) return <Loading />;
  return <CartItems items={cart.items} />;
};
```

**Best For**: User-specific data, real-time data

### Pattern 3: Static Paths with Props

```astro
---
// [slug].astro - Dynamic route
export async function getStaticPaths() {
  const services = await getServices();
  return services.map(service => ({
    params: { slug: service.slug },
    props: { service }, // Pass data as props
  }));
}

const { service } = Astro.props;
---

<ServiceDetail service={service} client:load />
```

**Best For**: Pages with dynamic URLs but static content

## Component Organization

### Astro Components (`*.astro`)

Used for:
- **Layout wrappers** (Layout.astro, AdminLayout.astro)
- **Static UI** (Hero.astro, Features.astro, Footer.astro)
- **Page structure** (all files in `pages/`)

### React Components (`*.tsx`)

Used for:
- **Interactive features** (forms, buttons with click handlers)
- **State management** (cart, auth)
- **Dynamic content** (data that changes after page load)
- **Third-party integrations** (if React-based)

### Naming Conventions

```
components/
├── Header.astro          # Astro component (static structure)
├── ThemeSwitcher.tsx     # React component (interactive)
├── auth/
│   ├── LoginForm.tsx     # React (form interactions)
│   └── AuthButtons.tsx   # React (auth-dependent)
└── ui/
    ├── Button.tsx        # React (reusable UI)
    └── Input.tsx         # React (form elements)
```

## Understanding the Build Output

When you run `npm run build`:

```
dist/
├── _astro/               # Hashed assets
│   ├── hoisted.xxxxx.js  # React runtime + components
│   └── styles.xxxxx.css  # Compiled CSS
├── index.html            # Static HTML
├── services/
│   └── index.html        # Static HTML
├── services/
│   ├── netflix/
│   │   └── index.html    # Pre-rendered service page
│   └── spotify/
│       └── index.html    # Pre-rendered service page
└── ... more pages
```

**Note**: Because the project uses `@astrojs/node` adapter, some pages are rendered on-demand (SSR) rather than at build time.

## SSR vs Static Generation

This project is configured for **SSR** (server-side rendering):

```javascript
// astro.config.mjs
export default defineConfig({
  adapter: node({ mode: 'standalone' }),
});
```

This means:
- Pages CAN be rendered on each request
- You CAN access request headers, cookies
- The server runs Node.js

**However**, many pages are still effectively static because they don't use request-specific data in the frontmatter.

## Key Takeaways

1. **Astro = Static first, hydrate selectively**
2. **Use `client:only="react"` for auth/browser-dependent components**
3. **Wrap pages in providers for shared state**
4. **Fetch data at build time when possible**
5. **React components need explicit hydration directives**

---

Next: [Database Schema](./04-database-schema.md)
