import { forwardRef } from "react";

/**
 * Input component with consistent styling
 */
const Input = forwardRef(
  ({ className = "", label, error, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-(text-secondary) mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${error ? "border-(color-danger)" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-(color-danger)">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
