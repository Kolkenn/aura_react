import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  padding?: boolean;
  glow?: boolean;
}

/**
 * Card component with glass morphism effect
 */
const Card = ({
  children,
  className = "",
  padding = true,
  glow = false,
  ...props
}: CardProps) => {
  const baseClasses =
    "card bg-base-100 shadow-xl border border-base-content/10";
  const paddingClass = padding ? "p-5" : "p-0";
  // glow logic can be kept or mapped to a specific shadow class if needed
  const glowClass = glow ? "shadow-2xl shadow-primary/20" : "";

  return (
    <div
      className={`${baseClasses} ${paddingClass} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
