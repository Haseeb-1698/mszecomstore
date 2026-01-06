import{j as o}from"./jsx-runtime.ClP7wGfN.js";import{r as c}from"./index.DK-fsZOb.js";import{c as n}from"./createLucideIcon.qGfHoHU5.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],h=n("moon",m);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],d=n("sun",l),g=()=>{const[e,s]=c.useState("light");c.useEffect(()=>{const t=document.documentElement,i=t.classList.contains("dark")?"dark":"light";s(i);const a=new MutationObserver(()=>{s(t.classList.contains("dark")?"dark":"light")});return a.observe(t,{attributes:!0,attributeFilter:["class"]}),()=>a.disconnect()},[]);const r=()=>{const t=e==="light"?"dark":"light";document.documentElement.classList.remove(e),document.documentElement.classList.add(t),globalThis.dispatchEvent(new CustomEvent("theme-change",{detail:t}))};return o.jsx("button",{onClick:r,className:"p-2 rounded-full text-charcoal-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-charcoal-700 transition-colors","aria-label":"Toggle theme",children:e==="light"?o.jsx(h,{size:20}):o.jsx(d,{size:20})})};export{g as default};
