/* empty css                                    */
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_DiKl080e.mjs';
import 'piccolore';
import { $ as $$Layout } from '../../chunks/Layout_CRxLGQoZ.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from '../../chunks/Card_Co53-fxj.mjs';
import { B as Button } from '../../chunks/Button_CuS9x7tL.mjs';
export { renderers } from '../../renderers.mjs';

const OrderDetails = ({ orderId = "ORD-12345" }) => {
  const order = {
    id: orderId,
    date: (/* @__PURE__ */ new Date()).toLocaleDateString(),
    status: "confirmed",
    customerName: "John Doe",
    email: "john@example.com",
    whatsapp: "+92 300 1234567",
    items: [
      { name: "Netflix", plan: "Premium - 12 months", price: 119.88, quantity: 1 },
      { name: "Spotify", plan: "Individual - 12 months", price: 99.99, quantity: 1 }
    ],
    subtotal: 219.87,
    discount: 20,
    total: 199.87,
    paymentMethod: "EasyPaisa"
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-cream-50 dark:bg-charcoal-900 py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-green-500/20 dark:bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-10 h-10 text-green-600 dark:text-green-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-charcoal-800 dark:text-cream-100 mb-2", children: "Order Confirmed!" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-charcoal-700 dark:text-cream-300", children: "Thank you for your order. We'll send you updates on WhatsApp." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsxs(Card, { variant: "elevated", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Order Details" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-600 dark:text-cream-400", children: "Order Number" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-charcoal-800 dark:text-cream-100", children: order.id })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-600 dark:text-cream-400", children: "Order Date" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-charcoal-800 dark:text-cream-100", children: order.date })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-600 dark:text-cream-400", children: "Status" }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300", children: order.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-600 dark:text-cream-400", children: "Payment Method" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-charcoal-800 dark:text-cream-100", children: order.paymentMethod })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { variant: "elevated", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Customer Information" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-600 dark:text-cream-400", children: "Name" }),
            /* @__PURE__ */ jsx("p", { className: "text-charcoal-800 dark:text-cream-100", children: order.customerName })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-600 dark:text-cream-400", children: "Email" }),
            /* @__PURE__ */ jsx("p", { className: "text-charcoal-800 dark:text-cream-100", children: order.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-600 dark:text-cream-400", children: "WhatsApp" }),
            /* @__PURE__ */ jsx("p", { className: "text-charcoal-800 dark:text-cream-100", children: order.whatsapp })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { variant: "elevated", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Order Items" }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          order.items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-3 border-b border-cream-400 dark:border-charcoal-700 last:border-0", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-medium text-charcoal-800 dark:text-cream-100", children: item.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-charcoal-600 dark:text-cream-400", children: item.plan })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "font-semibold text-charcoal-800 dark:text-cream-100", children: [
              "$",
              item.price.toFixed(2)
            ] })
          ] }, `${item.name}-${item.plan}-${item.price}`)),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-charcoal-700 dark:text-cream-300", children: [
              /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "$",
                order.subtotal.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-coral-600 dark:text-coral-400", children: [
              /* @__PURE__ */ jsx("span", { children: "Discount" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "-$",
                order.discount.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xl font-bold text-charcoal-800 dark:text-cream-100 pt-2 border-t border-cream-400 dark:border-charcoal-700", children: [
              /* @__PURE__ */ jsx("span", { children: "Total" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "$",
                order.total.toFixed(2)
              ] })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Card, { variant: "elevated", className: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800", children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-charcoal-800 dark:text-cream-100", children: "What's Next?" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-charcoal-700 dark:text-cream-300", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-purple-600 dark:text-purple-400 mt-0.5", children: "1." }),
            /* @__PURE__ */ jsx("span", { children: "Complete payment using the instructions sent to your WhatsApp" })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-purple-600 dark:text-purple-400 mt-0.5", children: "2." }),
            /* @__PURE__ */ jsx("span", { children: "Once payment is confirmed, we'll activate your subscription" })
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-purple-600 dark:text-purple-400 mt-0.5", children: "3." }),
            /* @__PURE__ */ jsx("span", { children: "You'll receive your login credentials within 5-10 minutes" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "flex-1", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "lg", fullWidth: true, children: "Back to Home" }) }),
        /* @__PURE__ */ jsx("a", { href: "/services", className: "flex-1", children: /* @__PURE__ */ jsx(Button, { variant: "primary", size: "lg", fullWidth: true, children: "Browse More Services" }) })
      ] })
    ] })
  ] }) });
};

const $$Astro = createAstro();
const prerender = false;
const $$orderId = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$orderId;
  const { orderId } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Order ${orderId} - MSZ Ecom Store` }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "OrderDetails", OrderDetails, { "client:load": true, "orderId": orderId, "client:component-hydration": "load", "client:component-path": "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/components/order/OrderDetails.tsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/pages/order/[orderId].astro", void 0);

const $$file = "C:/Users/cb26h/OneDrive/Desktop/MSZ/mszecomstore/src/pages/order/[orderId].astro";
const $$url = "/order/[orderId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$orderId,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
