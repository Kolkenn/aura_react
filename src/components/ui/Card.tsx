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
  const baseClasses = "card";
  const paddingClass = padding ? "p-5" : "p-0";
  const glowClass = glow ? "glow-purple" : "";

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
