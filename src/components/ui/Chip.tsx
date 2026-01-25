import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  active?: boolean;
  color?: string;
}

/**
 * Chip component for selectable pills/tags
 */
const Chip = ({
  children,
  active = false,
  onClick,
  className = "",
  color,
  ...props
}: ChipProps) => {
  return (
    <button
      type="button"
      className={`badge badge-lg gap-2 cursor-pointer transition-all ${
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
