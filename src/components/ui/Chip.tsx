import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from "react";

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
  const colorStyles: CSSProperties = color
    ? {
        background: active ? color : "var(--bg-tertiary)",
        borderColor: active ? color : "var(--border-color)",
      }
    : {};

  return (
    <button
      type="button"
      className={`chip ${active ? "active" : ""} ${className}`}
      style={colorStyles}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Chip;
