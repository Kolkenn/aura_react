import type { ButtonHTMLAttributes, ReactNode } from "react";

type ChipSize = "sm" | "md" | "lg";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  active?: boolean;
  color?: string;
  /** Size variant - 'md' and 'lg' provide WCAG-compliant 44px min touch targets */
  size?: ChipSize;
}

const sizeClasses: Record<ChipSize, string> = {
  sm: "badge-sm min-h-[32px] min-w-[44px] px-2 text-xs",
  md: "badge-md min-h-[44px] min-w-[44px] px-3 text-sm",
  lg: "badge-lg min-h-[48px] min-w-[56px] px-4 text-base",
};

/**
 * Chip component for selectable pills/tags
 * Provides accessible touch targets for mobile users
 */
const Chip = ({
  children,
  active = false,
  onClick,
  className = "",
  color,
  size = "md",
  ...props
}: ChipProps) => {
  return (
    <button
      type="button"
      className={`badge gap-2 cursor-pointer transition-all ${sizeClasses[size]} ${
        active
          ? `badge-primary text-primary-content border-transparent`
          : `badge-outline hover:border-primary hover:text-primary`
      } ${className}`}
      style={
        color && active ? { backgroundColor: color, borderColor: color } : {}
      }
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Chip;
