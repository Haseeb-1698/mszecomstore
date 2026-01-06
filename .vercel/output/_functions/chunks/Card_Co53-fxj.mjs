import { jsx } from 'react/jsx-runtime';
import 'react';

const Card = ({
  children,
  variant = "default",
  padding = "md",
  hover = false,
  className = "",
  ...props
}) => {
  const baseStyles = "rounded-2xl transition-all duration-200";
  const variantStyles = {
    default: "bg-cream-50 dark:bg-charcoal-800 border border-cream-400 dark:border-charcoal-700",
    elevated: "bg-cream-50 dark:bg-charcoal-800 shadow-soft hover:shadow-soft-lg",
    outlined: "bg-transparent border-2 border-cream-400 dark:border-charcoal-700"
  };
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };
  const hoverStyles = hover ? "hover:shadow-soft-lg hover:scale-[1.02] cursor-pointer" : "";
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`;
  return /* @__PURE__ */ jsx("div", { className: combinedStyles, ...props, children });
};
const CardHeader = ({ children, className = "" }) => {
  return /* @__PURE__ */ jsx("div", { className: `mb-4 ${className}`, children });
};
const CardTitle = ({ children, className = "" }) => {
  return /* @__PURE__ */ jsx("h3", { className: `text-xl font-semibold text-charcoal-800 dark:text-cream-100 ${className}`, children });
};
const CardContent = ({ children, className = "" }) => {
  return /* @__PURE__ */ jsx("div", { className, children });
};

export { Card as C, CardHeader as a, CardTitle as b, CardContent as c };
