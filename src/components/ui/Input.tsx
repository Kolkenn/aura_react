import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Input component with consistent styling
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

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
