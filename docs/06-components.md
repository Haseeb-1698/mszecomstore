# Components Guide

This document provides a comprehensive overview of all UI components in the project.

## Component Organization

```
src/components/
├── admin/          # Admin panel components
├── auth/           # Authentication components
├── cart/           # Shopping cart components
├── checkout/       # Checkout flow components
├── customer/       # Customer-facing components
├── order/          # Order display components
├── service/        # Service/product components
├── ui/             # Reusable UI primitives
└── *.astro/*.tsx   # Shared/global components
```

## Astro Components (Static)

These components are rendered at build time and contain no JavaScript.

### Layout Components

#### `Layout.astro`

Main layout wrapper for public pages.

```astro
<!-- Usage -->
<Layout title="Page Title">
  <main>Page content</main>
</Layout>
```

**Features:**
- Sets up HTML document structure
- Includes Header and Footer
- Dark mode initialization script
- Font loading (Inter)
- Alpine.js for simple interactions

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Page title |

#### `AdminLayout.astro`

Layout for admin pages (no header/footer).

```astro
<AdminLayout title="Admin Dashboard">
  <DashboardPage client:only="react" />
</AdminLayout>
```

### Marketing Components

#### `Hero.astro`

Landing page hero section with search and CTA.

```astro
<Hero />  <!-- No props needed -->
```

**Features:**
- Large headline with gradient text
- Search input (UI only, not functional)
- "Explore" button
- Decorative gradient elements

#### `Features.astro`

Feature highlights section.

#### `PopularServices.astro`

Showcases featured services.

#### `HowItWorks.astro`

Step-by-step explanation.

#### `Testimonials.astro`

Customer testimonials carousel.

#### `FAQ.astro`

Frequently asked questions with accordion (uses Alpine.js).

#### `CTA.astro`

Call-to-action section.

### Header & Footer

#### `Header.astro`

Site navigation header.

```astro
<Header />
```

**Contains:**
- Logo/brand link
- Navigation links (Home, Services, About, Contact)
- Legal dropdown menu
- Cart icon (React, `client:only`)
- Auth buttons (React, `client:only`)
- Theme switcher (React, `client:only`)

#### `Footer.astro`

Site footer with links and info.

### Utility Components

#### `AnnouncementStrip.astro`

Top announcement banner.

```astro
<AnnouncementStrip />
```

#### `ServiceCard.astro`

Card component for service listings.

---

## React Components (Interactive)

### UI Primitives (`src/components/ui/`)

Reusable, styled building blocks.

#### `Button.tsx`

Customizable button component.

```tsx
import { Button } from './ui/Button';

<Button variant="primary" size="lg" fullWidth>
  Click Me
</Button>

<Button variant="ghost" size="sm">
  Cancel
</Button>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | 'primary' \| 'secondary' \| 'ghost' \| 'danger' | 'primary' | Style variant |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| `fullWidth` | boolean | false | Take full width |
| `disabled` | boolean | false | Disabled state |
| `children` | ReactNode | - | Button content |

#### `Input.tsx`

Styled input component.

```tsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
/>
```

#### `Card.tsx`

Container card component.

```tsx
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

#### `LoadingSpinner.tsx`

Loading indicator.

```tsx
<LoadingSpinner size="lg" />
```

#### `Skeleton.tsx`

Loading placeholder.

```tsx
<Skeleton width="100%" height="20px" />
```

#### `EmptyState.tsx`

Empty content placeholder.

```tsx
<EmptyState
  icon={<ShoppingCart />}
  title="Your cart is empty"
  description="Add items to get started"
  action={<Button>Browse Services</Button>}
/>
```

#### `ErrorMessage.tsx`

Error display component.

```tsx
<ErrorMessage message="Something went wrong" />
```

#### `ErrorBoundary.tsx`

React error boundary for catching crashes.

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <AppContent />
</ErrorBoundary>
```

#### `StatusBadge.tsx`

Status indicator badge.

```tsx
<StatusBadge status="pending" />  // Yellow
<StatusBadge status="completed" /> // Green
<StatusBadge status="cancelled" /> // Red
```

#### `CartIcon.tsx`

Shopping cart icon with item count.

```tsx
<CartIcon />
```

**Features:**
- Shows item count badge
- Syncs across tabs via BroadcastChannel
- Links to `/cart`

---

### Auth Components (`src/components/auth/`)

#### `LoginForm.tsx`

Email/password login form.

```tsx
<LoginForm />
```

**Features:**
- Email and password inputs
- Loading state
- Error messages
- Redirect URL support (`?redirect=`)
- Link to signup

#### `SignupForm.tsx`

Registration form.

```tsx
<SignupForm />
```

**Features:**
- Name, email, password inputs
- Password validation
- Terms agreement checkbox
- Error handling

#### `AuthButtons.tsx`

Login/logout buttons for header.

```tsx
<AuthButtons />
```

**Behavior:**
- **Logged out**: Shows "Login" and "Sign Up" links
- **Logged in**: Shows "Dashboard" link and "Sign Out" button

---

### Cart Components (`src/components/cart/`)

#### `CartPageWrapper.tsx`

Provider wrapper for cart page.

```tsx
// In cart.astro
<CartPageWrapper client:only="react" />
```

**Structure:**
```tsx
<AppProviders>
  <CartPage />
</AppProviders>
```

#### `CartPage.tsx`

Main cart page content.

**Features:**
- Shows cart items
- Quantity controls
- Remove item buttons
- Cart summary with totals
- Login prompt if not authenticated
- Empty state if no items

#### `CartItem.tsx`

Individual cart item row.

```tsx
<CartItem
  item={item}
  onRemove={() => removeItem(item.id)}
  onQuantityChange={(qty) => updateQuantity(item.id, qty)}
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `item` | CartItem | Item data |
| `onRemove` | () => void | Remove handler |
| `onQuantityChange` | (qty: number) => void | Quantity update |

#### `CartSummary.tsx`

Order summary sidebar.

```tsx
<CartSummary
  subtotal={cart.subtotal}
  discount={cart.discount}
  total={cart.total}
  onApplyDiscount={applyDiscountCode}
/>
```

---

### Checkout Components (`src/components/checkout/`)

#### `CheckoutPageWrapper.tsx`

Provider wrapper for checkout.

#### `CheckoutPage.tsx`

Main checkout flow.

**Features:**
- Customer info form
- Order review
- Terms agreement
- Order submission
- Success/error handling

#### `CheckoutForm.tsx`

Customer information form.

```tsx
<CheckoutForm
  value={customerInfo}
  onChange={setCustomerInfo}
  errors={validationErrors}
/>
```

**Fields:**
- Full name
- Email
- WhatsApp number
- Special instructions (optional)

#### `OrderReview.tsx`

Order summary in checkout.

```tsx
<OrderReview items={cart.items} total={cart.total} />
```

---

### Service Components (`src/components/service/`)

#### `ServiceDetail.tsx`

Service detail page content.

```tsx
<ServiceDetail
  serviceId={service.id}
  serviceName={service.name}
  serviceDescription={service.description}
  serviceLongDescription={service.long_description}
  serviceIcon={service.icon_url}
  plans={transformedPlans}
/>
```

**Features:**
- Service info display
- Plan selection cards
- Feature lists
- Pricing comparison
- Add to cart functionality

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `serviceId` | string | Service UUID |
| `serviceName` | string | Display name |
| `serviceDescription` | string | Short description |
| `serviceLongDescription` | string (optional) | Long description |
| `serviceIcon` | string (optional) | Icon URL |
| `plans` | Plan[] | Available plans |

#### `AddToCartButton.tsx`

Standalone add-to-cart button.

```tsx
<AddToCartButton
  serviceId={service.id}
  serviceName={service.name}
  plan={selectedPlan}
  onAddToCart={() => setShowSuccess(true)}
/>
```

**Features:**
- Checks auth status
- Redirects to login if needed
- Adds item to cart
- Broadcasts cart update

---

### Admin Components (`src/components/admin/`)

#### `AdminShell.tsx`

Complete admin layout with providers.

```tsx
<AdminShell>
  <DashboardContent />
</AdminShell>
```

**Structure:**
```tsx
<AppProviders includeCart={false}>
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <AdminHeader />
      <main>{children}</main>
    </div>
  </div>
</AppProviders>
```

#### `AdminPageWrapper.tsx`

Auth guard for admin pages.

```tsx
<AdminPageWrapper requireAdmin={true}>
  <ProtectedContent />
</AdminPageWrapper>
```

**Behavior:**
- Loading state while checking auth
- Redirects non-authenticated users
- Shows "Access Denied" for non-admins

#### `Sidebar.tsx`

Admin navigation sidebar.

**Links:**
- Dashboard
- Services
- Orders
- Customers
- Settings

#### `AdminHeader.tsx`

Admin top header bar.

**Features:**
- Search (UI only)
- Theme toggle
- User menu

#### `DashboardPage.tsx`

Dashboard page wrapper.

```tsx
<DashboardPage />  // Wraps AdminDashboard + RecentOrders
```

#### `AdminDashboard.tsx`

Dashboard statistics display.

**Stats shown:**
- Total Orders
- Total Revenue
- Active Customers
- Pending Orders
- Delivered Today

#### `StatsCard.tsx`

Individual statistic card.

```tsx
<StatsCard
  title="Total Revenue"
  value="Rs 125,000"
  icon={<DollarSign />}
  trend="+12%"
  trendUp={true}
/>
```

#### `RecentOrders.tsx`

Recent orders table on dashboard.

#### `ServicesPage.tsx`

Service management page.

**Features:**
- Service list table
- Add service button
- Edit/delete actions

#### `ServicesTable.tsx`

Services data table.

#### `ServiceForm.tsx`

Create/edit service form.

**Fields:**
- Name, category, description
- Icon URL
- Badge (popular/best value)
- Plans with pricing

#### `ServiceModal.tsx`

Modal wrapper for service form.

#### `OrdersPage.tsx`

Order management page.

#### `OrdersTable.tsx`

Orders data table with columns:
- Order ID
- Customer
- Amount
- Status
- Date
- Actions

#### `OrderFilters.tsx`

Filter controls for orders.

**Filters:**
- Status (pending, processing, etc.)
- Date range
- Search

#### `CustomersPage.tsx`

Customer list page.

#### `CustomersTable.tsx`

Customer data table.

#### `SettingsPage.tsx`

Admin settings page.

#### `SettingsTabs.tsx`

Settings navigation tabs.

#### `SettingsForm.tsx`

Settings edit form.

#### `QuickActions.tsx`

Dashboard quick action buttons.

#### `ConfirmModal.tsx`

Confirmation dialog.

```tsx
<ConfirmModal
  isOpen={showConfirm}
  title="Delete Service"
  message="Are you sure?"
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
/>
```

---

### Global Components

#### `ThemeSwitcher.tsx`

Dark/light mode toggle.

```tsx
<ThemeSwitcher />
```

**Features:**
- Toggles `dark` class on `<html>`
- Persists choice in localStorage
- Sun/moon icon based on state

---

## Component Patterns

### Using Client Directives

```astro
<!-- Load immediately - for critical interactions -->
<LoginForm client:load />

<!-- Client-only - for auth-dependent components -->
<CartIcon client:load />

<!-- Visible - for below-fold interactive content -->
<Comments client:visible />
```

### Wrapper Pattern

Many pages use a wrapper component to set up providers:

```tsx
// CartPageWrapper.tsx
export const CartPageWrapper = () => (
  <AppProviders>
    <CartPage />
  </AppProviders>
);
```

```astro
<!-- cart.astro -->
<Layout title="Cart">
  <CartPageWrapper client:only="react" />
</Layout>
```

### Standalone vs Context Components

**Context-Dependent** (use inside providers):
```tsx
const { cart } = useCartContext();  // Needs CartProvider
```

**Standalone** (manage own state):
```tsx
// AddToCartButton.tsx - works outside providers
const [user, setUser] = useState(null);
supabase.auth.getSession().then(...);
```

---

## Styling Conventions

### Class Names

Uses Tailwind with custom theme colors:

```tsx
// Light mode
className="bg-cream-50 text-charcoal-800"

// Dark mode
className="dark:bg-charcoal-900 dark:text-cream-100"

// Interactive states
className="hover:bg-coral-500 focus:ring-2 focus:ring-coral-500"
```

### Custom Utilities

```tsx
import { cn } from '../lib/utils';

// Merge classes conditionally
className={cn(
  "base-styles",
  isActive && "active-styles",
  disabled && "opacity-50 cursor-not-allowed"
)}
```

---

Next: [Pages & Routing](./07-pages-routing.md)
