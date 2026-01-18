# Styling Guide

This document covers the styling system, Tailwind configuration, and design tokens.

## Design System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Design System Stack                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Tailwind CSS 3.4.19                                                   │
│   ├── Custom Theme Colors                                               │
│   ├── Dark Mode (class-based)                                           │
│   ├── Custom Animations                                                  │
│   └── Component Utilities                                                │
│                                                                          │
│   PostCSS Processing                                                     │
│   ├── Autoprefixer                                                       │
│   └── Tailwind Plugin                                                    │
│                                                                          │
│   Utility Libraries                                                      │
│   ├── clsx (conditional classes)                                        │
│   └── tailwind-merge (class deduplication)                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Color Palette

### Brand Colors

| Name | Light | Dark | Usage |
|------|-------|------|-------|
| **Cream** | `#F5F0EB` | N/A | Background |
| **Coral** | `#D97757` | `#E08B6D` | Primary accent, CTAs |
| **Purple** | `#6B5B7A` | `#B398B5` | Secondary accent |
| **Charcoal** | `#2C3E50` | `#E5E7EB` | Text |

### CSS Custom Properties

```css
/* src/styles/globals.css */
@layer base {
  :root {
    /* Brand colors */
    --color-cream: #F5F0EB;
    --color-coral: #D97757;
    --color-purple: #6B5B7A;
    --color-charcoal: #2C3E50;

    /* Semantic tokens */
    --background: var(--color-cream);
    --foreground: var(--color-charcoal);
    --primary: var(--color-coral);
    --secondary: var(--color-purple);
    
    /* Component tokens */
    --card: #FFFFFF;
    --card-foreground: var(--color-charcoal);
    --border: #E5E7EB;
    --input: #FFFFFF;
    --ring: var(--color-coral);
    --radius: 0.75rem;
  }

  .dark {
    --background: #1a1a2e;
    --foreground: #E5E7EB;
    --card: #16213e;
    --card-foreground: #E5E7EB;
    --border: #374151;
    --input: #1f2937;
    --ring: #E08B6D;
  }
}
```

## Tailwind Configuration

### File: `tailwind.config.mjs`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand colors
        cream: '#F5F0EB',
        coral: {
          DEFAULT: '#D97757',
          hover: '#C56647',
          light: '#E08B6D',
        },
        purple: {
          DEFAULT: '#6B5B7A',
          hover: '#5A4A69',
          light: '#B398B5',
        },
        charcoal: '#2C3E50',
        
        // Semantic mappings
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: '#FFFFFF',
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
```

## Global Styles

### File: `src/styles/globals.css`

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  /* Root variables */
  :root {
    --color-cream: #F5F0EB;
    --color-coral: #D97757;
    --color-purple: #6B5B7A;
    --color-charcoal: #2C3E50;
    
    --background: var(--color-cream);
    --foreground: var(--color-charcoal);
    --card: #FFFFFF;
    --card-foreground: var(--color-charcoal);
    --border: #E5E7EB;
    --input: #FFFFFF;
    --ring: var(--color-coral);
    --radius: 0.75rem;
  }

  .dark {
    --background: #1a1a2e;
    --foreground: #E5E7EB;
    --card: #16213e;
    --card-foreground: #E5E7EB;
    --border: #374151;
    --input: #1f2937;
    --ring: #E08B6D;
  }

  /* Base styles */
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Focus styles */
  *:focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
  }
}

@layer components {
  /* Card styles */
  .card {
    @apply rounded-lg border bg-card text-card-foreground shadow-sm;
  }
  
  /* Input styles */
  .input {
    @apply flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 
           text-sm ring-offset-background 
           placeholder:text-gray-500 
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
           focus-visible:ring-offset-2 
           disabled:cursor-not-allowed disabled:opacity-50;
  }
  
  /* Button base */
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium 
           ring-offset-background transition-colors 
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
           focus-visible:ring-offset-2 
           disabled:pointer-events-none disabled:opacity-50;
  }
}

@layer utilities {
  /* Text utilities */
  .text-balance {
    text-wrap: balance;
  }
  
  /* Gradient utilities */
  .gradient-coral {
    @apply bg-gradient-to-r from-coral to-coral-light;
  }
  
  .gradient-purple {
    @apply bg-gradient-to-r from-purple to-purple-light;
  }
}
```

## Class Merging Utility

### File: `src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with proper precedence
 * - Combines conditional classes with clsx
 * - Resolves conflicts with tailwind-merge
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-coral', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### Usage Examples

```tsx
// Conditional classes
<div className={cn('p-4', isActive && 'bg-coral')} />

// Override base classes
<Button className={cn('bg-coral', 'bg-purple')} />
// Result: 'bg-purple' (no duplicate bg-*)

// Complex conditionals
<div className={cn(
  'flex items-center',
  variant === 'primary' && 'bg-coral text-white',
  variant === 'secondary' && 'bg-purple text-white',
  variant === 'outline' && 'border border-coral text-coral',
  className
)} />
```

## Button Variants

### File: `src/components/ui/Button.tsx`

```tsx
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-coral text-white hover:bg-coral-hover',
  secondary: 'bg-purple text-white hover:bg-purple-hover',
  outline: 'border border-coral text-coral hover:bg-coral/10',
  ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2',
  lg: 'h-12 px-8 text-lg',
  icon: 'h-10 w-10',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md',
  isLoading,
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        variants[variant],
        sizes[size],
        isLoading && 'cursor-wait opacity-70',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
}
```

## Dark Mode Implementation

### Theme Switcher

```tsx
// src/components/ThemeSwitcher.tsx
import { useState, useEffect } from 'react';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference or saved preference
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (saved === 'dark' || (!saved && prefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

### Dark Mode Classes

```tsx
// Use dark: prefix for dark mode variants
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-charcoal dark:text-gray-100">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Body text</p>
</div>

// Cards
<div className="bg-card dark:bg-card border dark:border-gray-700">
  Content
</div>
```

## Responsive Design

### Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Usage Examples

```tsx
// Mobile-first responsive design
<div className="
  grid 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-3 
  xl:grid-cols-4 
  gap-4
">
  {services.map(service => <ServiceCard key={service.id} {...service} />)}
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Heading
</h1>

// Responsive padding
<div className="px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    Content
  </div>
</div>

// Hide/show on breakpoints
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

## Common Patterns

### Container Pattern

```tsx
<div className="min-h-screen bg-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Page content */}
  </div>
</div>
```

### Card Pattern

```tsx
<div className="bg-card rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
  <h3 className="text-lg font-semibold text-card-foreground">Title</h3>
  <p className="text-gray-600 dark:text-gray-400 mt-2">Description</p>
</div>
```

### Form Group Pattern

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">
      Field Label
    </label>
    <input 
      className="input" 
      type="text" 
      placeholder="Enter value..." 
    />
    <p className="text-xs text-gray-500">Helper text</p>
  </div>
</div>
```

### Status Badge Pattern

```tsx
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

<span className={cn(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  statusColors[status]
)}>
  {status}
</span>
```

## Animation Classes

```tsx
// Fade in on mount
<div className="animate-fade-in">
  Content
</div>

// Slide up on mount
<div className="animate-slide-up">
  Content
</div>

// Hover transitions
<div className="transition-all duration-200 hover:scale-105 hover:shadow-lg">
  Card
</div>

// Loading spinner
<div className="animate-spin h-5 w-5 border-2 border-coral border-t-transparent rounded-full" />
```

---

Next: [Deployment Guide](./13-deployment.md)
