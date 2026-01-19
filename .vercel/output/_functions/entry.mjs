import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Byi1Mi6J.mjs';
import { manifest } from './manifest_DDYQ_FCU.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/500.astro.mjs');
const _page3 = () => import('./pages/about.astro.mjs');
const _page4 = () => import('./pages/admin/orders.astro.mjs');
const _page5 = () => import('./pages/admin/services.astro.mjs');
const _page6 = () => import('./pages/admin/settings.astro.mjs');
const _page7 = () => import('./pages/admin.astro.mjs');
const _page8 = () => import('./pages/cart.astro.mjs');
const _page9 = () => import('./pages/checkout.astro.mjs');
const _page10 = () => import('./pages/contact.astro.mjs');
const _page11 = () => import('./pages/dashboard.astro.mjs');
const _page12 = () => import('./pages/how-it-works.astro.mjs');
const _page13 = () => import('./pages/login.astro.mjs');
const _page14 = () => import('./pages/order/_orderid_.astro.mjs');
const _page15 = () => import('./pages/payment/cancel.astro.mjs');
const _page16 = () => import('./pages/payment/success.astro.mjs');
const _page17 = () => import('./pages/privacy.astro.mjs');
const _page18 = () => import('./pages/refund-policy.astro.mjs');
const _page19 = () => import('./pages/services/_slug_.astro.mjs');
const _page20 = () => import('./pages/services.astro.mjs');
const _page21 = () => import('./pages/shipping-policy.astro.mjs');
const _page22 = () => import('./pages/signup.astro.mjs');
const _page23 = () => import('./pages/terms.astro.mjs');
const _page24 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/500.astro", _page2],
    ["src/pages/about.astro", _page3],
    ["src/pages/admin/orders.astro", _page4],
    ["src/pages/admin/services.astro", _page5],
    ["src/pages/admin/settings.astro", _page6],
    ["src/pages/admin/index.astro", _page7],
    ["src/pages/cart.astro", _page8],
    ["src/pages/checkout.astro", _page9],
    ["src/pages/contact.astro", _page10],
    ["src/pages/dashboard.astro", _page11],
    ["src/pages/how-it-works.astro", _page12],
    ["src/pages/login.astro", _page13],
    ["src/pages/order/[orderId].astro", _page14],
    ["src/pages/payment/cancel.astro", _page15],
    ["src/pages/payment/success.astro", _page16],
    ["src/pages/privacy.astro", _page17],
    ["src/pages/refund-policy.astro", _page18],
    ["src/pages/services/[slug].astro", _page19],
    ["src/pages/services.astro", _page20],
    ["src/pages/shipping-policy.astro", _page21],
    ["src/pages/signup.astro", _page22],
    ["src/pages/terms.astro", _page23],
    ["src/pages/index.astro", _page24]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "dc52d0d6-ff10-47e7-94f7-6d25e81c3d61",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
