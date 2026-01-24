import { forwardRef } from "react";

/**
 * Reusable Button component with multiple variants
 */
const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      disabled = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const baseClasses = "btn";

    const variantClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      danger: "btn-danger",
      ghost: "btn-ghost",
    };

    const sizeClasses = {
      sm: "text-xs py-2 px-3",
      md: "text-sm py-3 px-4",
      lg: "text-base py-4 px-6",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
