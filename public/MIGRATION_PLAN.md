# Next.js → Astro Migration Plan

## Overview

**Source Project (B):** `MSZ-Ecom-Store/subhub` - Next.js + React  
**Target Project (A):** `mszecomstore` - Astro + React  

### Design System (Already Unified ✅)
Both projects share the same color palette:
- **Cream:** `#FDFCFA` → `#E5DFD5` (light backgrounds)
- **Coral:** `#FF9B7F` → `#F97316` (primary/accent)
- **Purple:** `#9B87C0` → `#7A6B94` (secondary)
- **Charcoal:** `#3D3D3D` → `#1A1A1A` (dark mode)

---

## Pages to Migrate

### Project B (Next.js) has these pages NOT in Project A:
| Priority | Page | Complexity | Notes |
|----------|------|------------|-------|
| 🔴 HIGH | `/admin` | High | Admin dashboard |
| 🔴 HIGH | `/cart` | Medium | Shopping cart |
| 🔴 HIGH | `/checkout` | High | Checkout flow |
| 🟡 MED | `/order/[orderId]` | Medium | Order confirmation |
| 🟡 MED | `/payment/[sessionId]` | Medium | Payment processing |
| 🟢 LOW | `/privacy` | Low | Static content |
| 🟢 LOW | `/terms` | Low | Static content |

### Project A already has (no migration needed):
- `/` (index), `/about`, `/contact`, `/dashboard`, `/how-it-works`
- `/login`, `/signup`, `/services`, `/services/[slug]`

---

## Migration Strategy

### Phase 1: Foundation Setup
1. Create shared UI components in Astro
2. Set up cart context (React)
3. Add necessary utilities

### Phase 2: Simple Static Pages
4. Privacy Policy page
5. Terms of Service page

### Phase 3: E-commerce Core
6. Cart page
7. Checkout page

### Phase 4: Order Management
8. Order confirmation page
9. Payment success/failure pages

### Phase 5: Admin Dashboard
10. Admin layout/sidebar
11. Admin dashboard overview
12. Admin orders management
13. Admin services management
14. Admin settings

---

## Prompt Series for Migration

Use these prompts in order. Each is designed to be a manageable chunk.

---

### PROMPT 1: Foundation - Cart Context & Utilities
```
In the mszecomstore project, create the cart functionality foundation:
1. Create `src/contexts/CartContext.tsx` - React context for cart state management
2. Create `src/lib/cart.ts` - Cart utility functions (add, remove, calculate totals)
3. Create `src/hooks/useCart.ts` - Custom hook for cart access

Reference the Next.js project's cart implementation at:
- MSZ-Ecom-Store/subhub/src/contexts/CartContext.tsx
- MSZ-Ecom-Store/subhub/src/lib/cart.ts
- MSZ-Ecom-Store/subhub/src/hooks/useCart.ts

Use Astro's design system colors (cream, coral, charcoal palettes).
```

---

### PROMPT 2: UI Components - Buttons & Inputs
```
In the mszecomstore project, create reusable UI components:
1. Create `src/components/ui/Button.tsx` - React button component with variants (primary, secondary, outline, ghost)
2. Create `src/components/ui/Input.tsx` - Form input component
3. Create `src/components/ui/Card.tsx` - Card container component

Style using Tailwind with the existing color palette:
- Primary: coral-500 (#FF7A59)
- Background light: cream-50, cream-100
- Background dark: charcoal-800, charcoal-900
- Borders: cream-400 (light), charcoal-700 (dark)
- Rounded corners: rounded-2xl for cards, rounded-xl for buttons
```

---

### PROMPT 3: Privacy & Terms Pages
```
In the mszecomstore project, create legal pages:
1. Create `src/pages/privacy.astro` - Privacy policy page
2. Create `src/pages/terms.astro` - Terms of service page

Reference content structure from:
- MSZ-Ecom-Store/subhub/src/app/privacy/page.tsx
- MSZ-Ecom-Store/subhub/src/app/terms/page.tsx

Use the existing Layout.astro and match the cream/charcoal theme with proper dark mode support.
```

---

### PROMPT 4: Cart Page
```
In the mszecomstore project, create the shopping cart page:
1. Create `src/pages/cart.astro` - Cart page wrapper
2. Create `src/components/cart/CartPage.tsx` - React component for cart functionality
3. Create `src/components/cart/CartItem.tsx` - Individual cart item component
4. Create `src/components/cart/CartSummary.tsx` - Order summary sidebar

Reference: MSZ-Ecom-Store/subhub/src/app/cart/page.tsx

Features needed:
- Display cart items with quantity controls
- Remove item functionality
- Price calculations (subtotal, tax, total)
- Empty cart state
- Proceed to checkout button
- Dark/light mode support
```

---

### PROMPT 5: Checkout Page - Part 1 (Layout & Forms)
```
In the mszecomstore project, create checkout page structure:
1. Create `src/pages/checkout.astro` - Checkout page wrapper
2. Create `src/components/checkout/CheckoutPage.tsx` - Main checkout React component
3. Create `src/components/checkout/CheckoutForm.tsx` - Customer info form
4. Create `src/components/checkout/OrderReview.tsx` - Order review section

Reference: MSZ-Ecom-Store/subhub/src/app/checkout/page.tsx

Include fields for:
- Contact info (email, phone)
- Billing address
- Payment method selection placeholder
```

---

### PROMPT 6: Checkout Page - Part 2 (Payment Integration)
```
In the mszecomstore project, add payment integration to checkout:
1. Create `src/components/checkout/PaymentSection.tsx` - Payment method selection
2. Create `src/components/checkout/StripePayment.tsx` - Stripe payment form (placeholder/mock)
3. Update CheckoutPage.tsx to include payment flow

Reference: MSZ-Ecom-Store/subhub/src/app/checkout/page.tsx

For now, create the UI structure. Actual Stripe integration can be added later.
```

---

### PROMPT 7: Order Confirmation Pages
```
In the mszecomstore project, create order-related pages:
1. Create `src/pages/order/[orderId].astro` - Order confirmation page
2. Create `src/components/order/OrderDetails.tsx` - Order details component
3. Create `src/pages/payment/success.astro` - Payment success page
4. Create `src/pages/payment/cancel.astro` - Payment cancelled page

Reference:
- MSZ-Ecom-Store/subhub/src/app/order/[orderId]/page.tsx
- MSZ-Ecom-Store/subhub/src/app/payment/[sessionId]/page.tsx

Include order summary, status, and next steps.
```

---

### PROMPT 8: Admin Layout & Sidebar
```
In the mszecomstore project, create the admin layout:
1. Create `src/layouts/AdminLayout.astro` - Admin-specific layout with sidebar
2. Create `src/components/admin/Sidebar.tsx` - Admin navigation sidebar
3. Create `src/components/admin/AdminHeader.tsx` - Admin header with user menu

Reference: MSZ-Ecom-Store/subhub/src/app/admin/page.tsx

Sidebar should include:
- Dashboard link
- Orders link
- Services link
- Customers link
- Settings link
- Logout link

Use charcoal background for sidebar, coral accents for active states.
```

---

### PROMPT 9: Admin Dashboard Overview
```
In the mszecomstore project, create the admin dashboard:
1. Create `src/pages/admin/index.astro` - Admin dashboard page
2. Create `src/components/admin/StatsCard.tsx` - Statistics card component
3. Create `src/components/admin/RecentOrders.tsx` - Recent orders table
4. Create `src/components/admin/QuickActions.tsx` - Quick action buttons

Reference: MSZ-Ecom-Store/subhub/src/app/admin/page.tsx

Display:
- Total orders, revenue, customers stats
- Recent orders list
- Quick action buttons
- Revenue chart placeholder
```

---

### PROMPT 10: Admin Orders Management
```
In the mszecomstore project, create admin orders page:
1. Create `src/pages/admin/orders.astro` - Orders management page
2. Create `src/components/admin/OrdersTable.tsx` - Orders data table
3. Create `src/components/admin/OrderFilters.tsx` - Filter controls
4. Create `src/components/admin/OrderStatusBadge.tsx` - Status badge component

Features:
- List all orders with pagination
- Filter by status, date range
- Search by order ID or customer
- Click to view order details
- Update order status
```

---

### PROMPT 11: Admin Services Management
```
In the mszecomstore project, create admin services page:
1. Create `src/pages/admin/services.astro` - Services management page
2. Create `src/components/admin/ServicesTable.tsx` - Services data table
3. Create `src/components/admin/ServiceForm.tsx` - Add/edit service form
4. Create `src/components/admin/ServiceModal.tsx` - Modal for service editing

Features:
- List all services
- Add new service
- Edit existing service
- Toggle service active/inactive
- Delete service (with confirmation)
```

---

### PROMPT 12: Admin Settings Page
```
In the mszecomstore project, create admin settings:
1. Create `src/pages/admin/settings.astro` - Settings page
2. Create `src/components/admin/SettingsForm.tsx` - Settings form component
3. Create `src/components/admin/SettingsTabs.tsx` - Settings navigation tabs

Include settings for:
- Business info (name, email, phone)
- Payment settings (Stripe keys placeholder)
- Email notifications toggles
- Theme preferences
```

---

### PROMPT 13: Error & Loading States
```
In the mszecomstore project, create error and loading components:
1. Create `src/pages/404.astro` - Custom 404 page
2. Create `src/pages/500.astro` - Server error page
3. Create `src/components/ui/LoadingSpinner.tsx` - Loading spinner
4. Create `src/components/ui/EmptyState.tsx` - Empty state component
5. Create `src/components/ui/ErrorMessage.tsx` - Error message display

Match the cream/coral theme with friendly messaging.
```

---

### PROMPT 14: Final Polish & Integration
```
In the mszecomstore project, finalize the migration:
1. Update `src/components/Header.astro` to include cart icon with item count
2. Add navigation links for new pages (Cart, Admin)
3. Create `src/lib/types.ts` with TypeScript interfaces for Order, CartItem, Service, User
4. Review and fix any TypeScript errors across new components

Test that all pages render correctly in both light and dark modes.
```

---

## File Structure After Migration

```
mszecomstore/src/
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx
│   │   ├── OrderFilters.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── OrderStatusBadge.tsx
│   │   ├── QuickActions.tsx
│   │   ├── RecentOrders.tsx
│   │   ├── ServiceForm.tsx
│   │   ├── ServiceModal.tsx
│   │   ├── ServicesTable.tsx
│   │   ├── SettingsForm.tsx
│   │   ├── SettingsTabs.tsx
│   │   ├── Sidebar.tsx
│   │   └── StatsCard.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartPage.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrderReview.tsx
│   │   ├── PaymentSection.tsx
│   │   └── StripePayment.tsx
│   ├── order/
│   │   └── OrderDetails.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── EmptyState.tsx
│       ├── ErrorMessage.tsx
│       ├── Input.tsx
│       └── LoadingSpinner.tsx
├── contexts/
│   └── CartContext.tsx
├── hooks/
│   └── useCart.ts
├── layouts/
│   ├── AdminLayout.astro
│   └── Layout.astro
├── lib/
│   ├── cart.ts
│   └── types.ts
└── pages/
    ├── admin/
    │   ├── index.astro
    │   ├── orders.astro
    │   ├── services.astro
    │   └── settings.astro
    ├── cart.astro
    ├── checkout.astro
    ├── order/
    │   └── [orderId].astro
    ├── payment/
    │   ├── cancel.astro
    │   └── success.astro
    ├── privacy.astro
    ├── terms.astro
    ├── 404.astro
    └── 500.astro
```

---

## Notes

- Each prompt builds on the previous ones
- React components use `client:load` or `client:visible` directives in Astro
- All styling uses Tailwind with the existing color palette
- Dark mode uses `dark:` prefix classes
- Keep components small and focused for easier debugging
