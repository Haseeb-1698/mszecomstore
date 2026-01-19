import { e as createComponent, m as maybeRenderHead, r as renderTemplate, k as renderComponent, h as addAttribute, f as createAstro, l as renderSlot, n as renderHead } from './astro/server_DiKl080e.mjs';
import 'piccolore';
/* empty css                         */
import { Moon, Sun, Menu, Twitter, Facebook, Instagram, MessageCircle, Mail } from 'lucide-react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect, useCallback } from 'react';
import 'clsx';
/* empty css                         */

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const root = document.documentElement;
    const initialTheme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(initialTheme);
    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    globalThis.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: toggleTheme,
      className: "p-2 rounded-full text-charcoal-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors",
      "aria-label": "Toggle theme",
      children: theme === "light" ? /* @__PURE__ */ jsx(Moon, { size: 20 }) : /* @__PURE__ */ jsx(Sun, { size: 20 })
    }
  );
};

const services = [
  {
    slug: 'netflix',
    name: 'Netflix',
    description: 'Stream unlimited movies and TV shows.',
    longDescription: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price.',
    price: 'PKR 2,800/mo',
    logo: '/icons/netflix.svg',
    pricingTiers: [
      { name: 'Basic', price: 'PKR 2,800/mo', quality: 'SD (480p)' },
      { name: 'Standard', price: 'PKR 4,340/mo', quality: 'HD (1080p)' },
      { name: 'Premium', price: 'PKR 5,600/mo', quality: 'UHD (4K) + HDR' },
    ]
  },
  {
    slug: 'spotify',
    name: 'Spotify',
    description: 'Music for everyone. Ad-free listening.',
    longDescription: 'Spotify is a digital music, podcast, and video service that gives you access to millions of songs and other content from creators all over the world. Basic functions are free, but you can also choose to upgrade to Spotify Premium.',
    price: 'PKR 3,080/mo',
    logo: '/icons/spotify.svg',
    pricingTiers: [
      { name: 'Individual', price: 'PKR 3,080/mo', quality: '320kbps' },
      { name: 'Duo', price: 'PKR 4,200/mo', quality: '320kbps' },
      { name: 'Family', price: 'PKR 4,760/mo', quality: '320kbps' },
    ]
  },
  {
    slug: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    description: 'The world\'s best creative apps and services.',
    longDescription: 'Adobe Creative Cloud is a set of applications and services from Adobe Inc. that gives subscribers access to a collection of software used for graphic design, video editing, web development, photography, along with a set of mobile applications and also some optional cloud services.',
    price: 'PKR 15,400/mo',
    logo: '/icons/adobe-creative-cloud.svg',
    pricingTiers: [
      { name: 'Photography (20GB)', price: 'PKR 2,800/mo', quality: 'N/A' },
      { name: 'All Apps', price: 'PKR 15,400/mo', quality: 'N/A' },
      { name: 'Single App', price: 'PKR 5,880/mo', quality: 'N/A' },
    ]
  },
  {
    slug: 'notion',
    name: 'Notion',
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases.',
    longDescription: 'Notion is an application that provides components such as notes, databases, kanban boards, wikis, calendars and reminders. Users can connect these components to create their own systems for knowledge management, note taking, data management, project management, among others.',
    price: 'PKR 2,240/mo',
    logo: '/icons/notion.svg',
    pricingTiers: [
      { name: 'Plus', price: 'PKR 2,240/mo', quality: 'N/A' },
      { name: 'Business', price: 'PKR 4,200/mo', quality: 'N/A' },
      { name: 'Enterprise', price: 'Contact us', quality: 'N/A' },
    ]
  },
  {
    slug: 'figma',
    name: 'Figma',
    description: 'The collaborative interface design tool.',
    longDescription: 'Figma is a collaborative web application for interface design, with additional offline features enabled by desktop applications for macOS and Windows. The Figma mobile app for Android and iOS allows viewing and interacting with Figma prototypes in real-time on mobile and tablet devices.',
    price: 'PKR 3,360/mo',
    logo: '/icons/figma.svg',
    pricingTiers: [
      { name: 'Professional', price: 'PKR 3,360/mo', quality: 'N/A' },
      { name: 'Organization', price: 'PKR 12,600/mo', quality: 'N/A' },
    ]
  },
  {
    slug: 'disney-plus',
    name: 'Disney+',
    description: 'The streaming home of your favorite stories.',
    price: 'PKR 2,240/mo',
    logo: '/icons/disney-plus.svg',
    longDescription: 'Disney+ is the streaming home of your favorite stories from Disney, Pixar, Marvel, Star Wars, and National Geographic. Watch the latest releases, Original series and movies, classic films, and more.',
    pricingTiers: [
      { name: 'Basic (With Ads)', price: 'PKR 2,240/mo', quality: 'Up to 4K UHD' },
      { name: 'Premium (No Ads)', price: 'PKR 3,920/mo', quality: 'Up to 4K UHD' },
    ]
  }
];

const generateCartId = () => {
  return `cart_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};
const generateCartItemId = () => {
  return `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};
const createEmptyCart = (customerId) => {
  const now = /* @__PURE__ */ new Date();
  return {
    id: generateCartId(),
    customerId,
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    createdAt: now,
    updatedAt: now
  };
};
const calculateCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    subtotal,
    total: subtotal
  };
};
const parsePrice = (priceStr) => {
  const match = new RegExp(/[\d.]+/).exec(priceStr);
  const value = match ? Number.parseFloat(match[0]) : 0;
  return Number.isFinite(value) ? value : 0;
};
const addItemToCart = (cart, serviceSlug, tierIndex = 0) => {
  const service = services.find((s) => s.slug === serviceSlug);
  if (!service) {
    throw new Error(`Service with slug ${serviceSlug} not found`);
  }
  const tier = service.pricingTiers?.[tierIndex];
  if (!tier) {
    throw new Error(`Tier index ${tierIndex} not found for service ${serviceSlug}`);
  }
  const price = parsePrice(tier.price);
  const planId = `${serviceSlug}-tier-${tierIndex}`;
  const existingItemIndex = cart.items.findIndex(
    (item) => item.serviceId === serviceSlug && item.planId === planId
  );
  let updatedItems;
  if (existingItemIndex >= 0) {
    updatedItems = cart.items.map(
      (item, index) => index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
    );
  } else {
    const newItem = {
      id: generateCartItemId(),
      serviceId: serviceSlug,
      planId,
      serviceName: service.name,
      planDuration: tier.name,
      price,
      quantity: 1
    };
    updatedItems = [...cart.items, newItem];
  }
  const { subtotal, total } = calculateCartTotals(updatedItems);
  return {
    ...cart,
    items: updatedItems,
    subtotal,
    total: total - cart.discount,
    updatedAt: /* @__PURE__ */ new Date()
  };
};
const removeItemFromCart = (cart, itemId) => {
  const updatedItems = cart.items.filter((item) => item.id !== itemId);
  const { subtotal, total } = calculateCartTotals(updatedItems);
  return {
    ...cart,
    items: updatedItems,
    subtotal,
    total: total - cart.discount,
    updatedAt: /* @__PURE__ */ new Date()
  };
};
const updateItemQuantity = (cart, itemId, quantity) => {
  if (quantity <= 0) {
    return removeItemFromCart(cart, itemId);
  }
  const updatedItems = cart.items.map(
    (item) => item.id === itemId ? { ...item, quantity } : item
  );
  const { subtotal, total } = calculateCartTotals(updatedItems);
  return {
    ...cart,
    items: updatedItems,
    subtotal,
    total: total - cart.discount,
    updatedAt: /* @__PURE__ */ new Date()
  };
};
const applyDiscountToCart = (cart, discountAmount) => {
  const discount = Math.max(0, Math.min(discountAmount, cart.subtotal));
  const total = cart.subtotal - discount;
  return {
    ...cart,
    discount,
    total,
    updatedAt: /* @__PURE__ */ new Date()
  };
};
const applyDiscountCode = (cart, discountCode) => {
  const discountCodes = {
    "SAVE10": cart.subtotal * 0.1,
    "SAVE20": cart.subtotal * 0.2,
    "FIRST100": 100,
    "STUDENT50": 50,
    "WELCOME15": cart.subtotal * 0.15
  };
  const discountAmount = discountCodes[discountCode.toUpperCase()] || 0;
  return applyDiscountToCart(cart, discountAmount);
};
const clearCart = (cart) => {
  return {
    ...cart,
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    updatedAt: /* @__PURE__ */ new Date()
  };
};
const getCartItemCount = (cart) => {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
};
const isCartEmpty = (cart) => {
  return cart.items.length === 0;
};
const CART_STORAGE_KEY = "msz_ecom_cart";
const saveCartToStorage = (cart) => {
  if (typeof globalThis === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};
const loadCartFromStorage = () => {
  if (typeof globalThis === "undefined") return null;
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) return null;
    const cart = JSON.parse(cartData);
    return {
      ...cart,
      createdAt: new Date(cart.createdAt),
      updatedAt: new Date(cart.updatedAt)
    };
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return null;
  }
};
const removeCartFromStorage = () => {
  if (typeof globalThis === "undefined") return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to remove cart from localStorage:", error);
  }
};
const validateCartItems = (cart) => {
  const validItems = cart.items.filter((item) => {
    const service = services.find((s) => s.slug === item.serviceId);
    return !!service;
  });
  const { subtotal } = calculateCartTotals(validItems);
  return {
    ...cart,
    items: validItems,
    subtotal,
    total: subtotal - cart.discount,
    updatedAt: /* @__PURE__ */ new Date()
  };
};
const cartUtils = {
  create: createEmptyCart,
  addItem: addItemToCart,
  removeItem: removeItemFromCart,
  updateQuantity: updateItemQuantity,
  applyDiscount: applyDiscountToCart,
  applyDiscountCode,
  clear: clearCart,
  getItemCount: getCartItemCount,
  isEmpty: isCartEmpty,
  save: saveCartToStorage,
  load: loadCartFromStorage,
  remove: removeCartFromStorage,
  validate: validateCartItems
};

const useCart = () => {
  const [cart, setCart] = useState(() => cartUtils.create());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadCart = () => {
      console.log("🛒 loadCart started");
      try {
        const savedCart = cartUtils.load();
        console.log("🛒 savedCart from storage:", savedCart);
        let cartToUse = cartUtils.create();
        console.log("🛒 empty cart created:", cartToUse);
        if (savedCart) {
          const validatedCart = cartUtils.validate(savedCart);
          console.log("🛒 validatedCart:", validatedCart);
          cartToUse = validatedCart;
        }
        if (cartToUse.items.length === 0) {
          console.log("🛒 Cart empty, adding dummy items...");
          try {
            cartToUse = cartUtils.addItem(cartToUse, "netflix", 1);
            console.log("🛒 After adding netflix:", cartToUse);
          } catch (error2) {
            console.error("🛒 Failed to add dummy item:", error2);
          }
        }
        setCart(cartToUse);
        console.log("🛒 setCart called");
        setError(null);
      } catch (err) {
        console.error("🛒 loadCart error:", err);
        setError("Failed to load your cart. Starting with an empty cart.");
        setCart(cartUtils.create());
      } finally {
        console.log("🛒 Setting isLoading to false");
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);
  useEffect(() => {
    if (!isLoading) {
      try {
        cartUtils.save(cart);
        setError(null);
      } catch (err) {
        console.error("Failed to save cart:", err);
        setError("Failed to save your cart.");
      }
    }
  }, [cart, isLoading]);
  const addItem = useCallback((serviceSlug, tierIndex = 0) => {
    try {
      setCart((currentCart) => cartUtils.addItem(currentCart, serviceSlug, tierIndex));
      setError(null);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setError(err instanceof Error ? err.message : "Failed to add item to cart");
    }
  }, []);
  const removeItem = useCallback((itemId) => {
    try {
      setCart((currentCart) => cartUtils.removeItem(currentCart, itemId));
      setError(null);
    } catch (err) {
      console.error("Remove from cart failed:", err);
      setError("Failed to remove item from cart");
    }
  }, []);
  const updateQuantity = useCallback((itemId, quantity) => {
    try {
      setCart((currentCart) => cartUtils.updateQuantity(currentCart, itemId, quantity));
      setError(null);
    } catch (err) {
      console.error("Update quantity failed:", err);
      setError("Failed to update quantity");
    }
  }, []);
  const applyDiscountCodeFn = useCallback((code) => {
    try {
      const updatedCart = cartUtils.applyDiscountCode(cart, code);
      const discountApplied = updatedCart.discount > cart.discount;
      if (discountApplied) {
        setCart(updatedCart);
        setError(null);
      }
      return discountApplied;
    } catch (err) {
      console.error("Apply discount failed:", err);
      setError("Failed to apply discount code");
      return false;
    }
  }, [cart]);
  const clearCartFn = useCallback(() => {
    try {
      setCart((currentCart) => cartUtils.clear(currentCart));
      setError(null);
    } catch (err) {
      console.error("Clear cart failed:", err);
      setError("Failed to clear cart");
    }
  }, []);
  const itemCount = cartUtils.getItemCount(cart);
  const isEmpty = cartUtils.isEmpty(cart);
  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscountCode: applyDiscountCodeFn,
    clearCart: clearCartFn,
    itemCount,
    isEmpty,
    isLoading,
    error
  };
};

const CartIcon = () => {
  const { itemCount } = useCart();
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: "/cart",
      className: "relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors group",
      "aria-label": "Shopping Cart",
      children: [
        /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-6 h-6 text-charcoal-800 dark:text-cream-100 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              }
            )
          }
        ),
        itemCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-coral-500 rounded-full shadow-soft", children: itemCount > 9 ? "9+" : itemCount })
      ]
    }
  );
};

const $$AnnouncementStrip = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="bg-gradient-to-r from-[#E5723A] to-[#2B2F38] text-white py-2 overflow-hidden relative" data-astro-cid-35fkgihc> <div class="flex animate-marquee-rtl whitespace-nowrap" data-astro-cid-35fkgihc> <div class="flex items-center text-sm" data-astro-cid-35fkgihc> <span class="font-semibold mx-4" data-astro-cid-35fkgihc>WINTER SALE</span>•<span class="mx-4" data-astro-cid-35fkgihc>Up to 50% OFF</span>•<span class="font-semibold mx-4" data-astro-cid-35fkgihc>LIMITED TIME</span>•<span class="mx-4" data-astro-cid-35fkgihc>Act Fast!</span> <span class="mx-32" data-astro-cid-35fkgihc></span> <!-- Large gap --> <span class="font-semibold mx-4" data-astro-cid-35fkgihc>EARLY BIRD DISCOUNT</span>•<span class="mx-4" data-astro-cid-35fkgihc>Save 30% More</span>•<span class="font-semibold mx-4" data-astro-cid-35fkgihc>EXCLUSIVE OFFER</span>•<span class="mx-4" data-astro-cid-35fkgihc>Don't Miss Out!</span> <span class="mx-32" data-astro-cid-35fkgihc></span> <!-- Large gap before repeat --> </div> <!-- Duplicate content for seamless loop --> <div class="flex items-center text-sm" data-astro-cid-35fkgihc> <span class="font-semibold mx-4" data-astro-cid-35fkgihc>WINTER SALE</span>•<span class="mx-4" data-astro-cid-35fkgihc>Up to 50% OFF</span>•<span class="font-semibold mx-4" data-astro-cid-35fkgihc>LIMITED TIME</span>•<span class="mx-4" data-astro-cid-35fkgihc>Act Fast!</span> <span class="mx-32" data-astro-cid-35fkgihc></span> <!-- Large gap --> <span class="font-semibold mx-4" data-astro-cid-35fkgihc>EARLY BIRD DISCOUNT</span>•<span class="mx-4" data-astro-cid-35fkgihc>Save 30% More</span>•<span class="font-semibold mx-4" data-astro-cid-35fkgihc>EXCLUSIVE OFFER</span>•<span class="mx-4" data-astro-cid-35fkgihc>Don't Miss Out!</span> <span class="mx-32" data-astro-cid-35fkgihc></span> <!-- Large gap before repeat --> </div> </div> </div> `;
}, "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/components/AnnouncementStrip.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/cart", label: "Cart" }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-50"> ${renderComponent($$result, "AnnouncementStrip", $$AnnouncementStrip, {})} <div class="bg-cream-50/80 dark:bg-charcoal-900/80 backdrop-blur-lg border-b border-cream-400 dark:border-charcoal-700"> <nav class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between"> <a href="/" class="text-2xl font-bold text-charcoal-900 dark:text-white">MSZ Software House</a> <div class="hidden md:flex items-center gap-8"> ${links.map((link) => renderTemplate`<a${addAttribute(link.href, "href")} class="text-charcoal-800 dark:text-cream-100 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">${link.label}</a>`)} <!-- Terms & Policy Dropdown --> <div class="relative group"> <button class="text-charcoal-800 dark:text-cream-100 hover:text-coral-500 dark:hover:text-coral-400 transition-colors flex items-center gap-1">
Legal
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path> </svg> </button> <div class="absolute top-full left-0 mt-2 w-48 bg-cream-50 dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"> <a href="/terms" class="block px-4 py-3 text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-700 hover:text-coral-500 dark:hover:text-coral-400 transition-colors first:rounded-t-lg">
Terms & Conditions
</a> <a href="/privacy" class="block px-4 py-3 text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-700 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">
Privacy Policy
</a> <a href="/refund-policy" class="block px-4 py-3 text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-700 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">
Refund Policy
</a> <a href="/shipping-policy" class="block px-4 py-3 text-charcoal-800 dark:text-cream-100 hover:bg-cream-100 dark:hover:bg-charcoal-700 hover:text-coral-500 dark:hover:text-coral-400 transition-colors last:rounded-b-lg">
Shipping Policy
</a> </div> </div> </div> <div class="hidden md:flex items-center gap-4"> ${renderComponent($$result, "CartIcon", CartIcon, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/components/ui/CartIcon", "client:component-export": "default" })} <a href="/login" class="text-charcoal-800 dark:text-cream-100 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">Log In</a> <a href="/signup" class="px-5 py-2 rounded-full bg-coral-500 text-white font-medium hover:bg-coral-600 transition-all">
Sign Up
</a> <a href="/dashboard" class="relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors group" title="Profile"> <svg class="w-6 h-6 text-charcoal-800 dark:text-cream-100 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </a> ${renderComponent($$result, "ThemeSwitcher", ThemeSwitcher, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/components/ThemeSwitcher.tsx", "client:component-export": "default" })} </div> <div class="md:hidden flex items-center gap-4"> ${renderComponent($$result, "CartIcon", CartIcon, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/components/ui/CartIcon", "client:component-export": "default" })} <a href="/dashboard" class="relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors group" title="Profile"> <svg class="w-5 h-5 text-charcoal-800 dark:text-cream-100 group-hover:text-coral-500 dark:group-hover:text-coral-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </a> ${renderComponent($$result, "ThemeSwitcher", ThemeSwitcher, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/components/ThemeSwitcher.tsx", "client:component-export": "default" })} <button> ${renderComponent($$result, "Menu", Menu, { "className": "w-6 h-6 text-charcoal-800 dark:text-white" })} </button> </div> </nav> </div> </header>`;
}, "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<footer class="bg-cream-100 dark:bg-charcoal-900 border-t border-cream-400 dark:border-charcoal-700 py-16"> <div class="max-w-7xl mx-auto px-6"> <div class="grid grid-cols-1 md:grid-cols-4 gap-12"> <div> <h3 class="text-2xl font-medium text-charcoal-900 dark:text-white mb-4">MSZ Software House</h3> <p class="text-charcoal-800 dark:text-gray-400 leading-relaxed">
Your trusted partner for premium digital products, services, and legal SaaS subscriptions.
</p> <div class="flex mt-4 space-x-4"> <a href="#" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">${renderComponent($$result, "Twitter", Twitter, { "className": "w-5 h-5" })}</a> <a href="#" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">${renderComponent($$result, "Facebook", Facebook, { "className": "w-5 h-5" })}</a> <a href="#" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">${renderComponent($$result, "Instagram", Instagram, { "className": "w-5 h-5" })}</a> </div> </div> <div> <h4 class="font-medium text-charcoal-900 dark:text-white mb-4">Navigation</h4> <ul class="space-y-2"> <li><a href="/" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">Home</a></li> <li><a href="/services" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">Services</a></li> <li><a href="/about" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">About</a></li> <li><a href="/contact" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">Contact</a></li> </ul> </div> <div> <h4 class="font-medium text-charcoal-900 dark:text-white mb-4">Legal</h4> <ul class="space-y-2"> <li><a href="/terms" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">Terms & Conditions</a></li> <li><a href="/privacy" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">Privacy Policy</a></li> <li><a href="/refund-policy" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">Refund Policy</a></li> <li><a href="/shipping-policy" class="text-charcoal-800 dark:text-gray-400 hover:text-coral-500 dark:hover:text-coral-400 transition-colors">Shipping Policy</a></li> </ul> </div> <div> <h4 class="font-medium text-charcoal-900 dark:text-white mb-4">Get in Touch</h4> <ul class="space-y-3"> <li class="flex items-center gap-2 text-charcoal-800 dark:text-gray-400"> ${renderComponent($$result, "MessageCircle", MessageCircle, { "className": "w-4 h-4" })} <a href="https://wa.me/923332040826" class="hover:text-coral-500 dark:hover:text-coral-400 transition-colors">+92 333 2040826</a> </li> <li class="flex items-center gap-2 text-charcoal-800 dark:text-gray-400"> ${renderComponent($$result, "Mail", Mail, { "className": "w-4 h-4" })} <a href="mailto:mszsoftwarehouse@gmail.com" class="hover:text-coral-500 dark:hover:text-coral-400 transition-colors">mszsoftwarehouse@gmail.com</a> </li> </ul> <div class="mt-4 p-3 bg-cream-200 dark:bg-charcoal-800 rounded-lg border border-cream-400 dark:border-charcoal-600"> <p class="text-sm font-medium text-charcoal-900 dark:text-white">Address:</p> <p class="text-sm text-charcoal-800 dark:text-gray-300">202, 2nd floor 27c Sunset lane 1,</p> <p class="text-sm text-charcoal-800 dark:text-gray-300">Phase 2 EXT DHA, Karachi South</p> </div> </div> </div> <div class="mt-12 pt-8 border-t border-cream-400 dark:border-charcoal-700 text-center text-charcoal-800 dark:text-gray-500 text-sm">
© 2025 MSZ Software House. All rights reserved.
</div> </div> </footer>`;
}, "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/components/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="MSZ Software House - Premium digital solutions and subscriptions, simplified."><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><meta name="generator"', "><title>", `</title><script>
		  // This script is executed before the page is rendered to prevent a theme flash.
		  const theme = (() => {
		    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
		      return localStorage.getItem('theme');
		    }
		    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		      return 'dark';
		    }
		    return 'light';
		  })();

		  if (theme === 'light') {
		    document.documentElement.classList.remove('dark');
		  } else {
		    document.documentElement.classList.add('dark');
		  }

      // Whenever the user explicitly chooses to change the theme,
      // we store that preference in localStorage.
      window.addEventListener('theme-change', (e) => {
        localStorage.setItem('theme', e.detail);
      });
		<\/script><script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"><\/script><script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"><\/script>`, '</head> <body class="bg-cream-50 dark:bg-charcoal-900 text-charcoal-800 dark:text-cream-50 antialiased transition-colors duration-300"> ', " ", " ", " </body></html>"])), addAttribute(Astro2.generator, "content"), title, renderHead(), renderComponent($$result, "Header", $$Header, {}), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/layouts/Layout.astro", void 0);

export { $$Layout as $, cartUtils as c, services as s, useCart as u };
