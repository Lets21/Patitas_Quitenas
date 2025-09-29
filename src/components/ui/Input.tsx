
import { clsx } from 'clsx';
import * as React from "react";


type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, name, ...props }, ref) => {
    const inputId = id || name; // útil para label htmlFor
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          name={name}
          ref={ref}
          {...props}
          className={[
            "w-full rounded-xl border px-3 py-2 outline-none",
            "border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-500",
            error ? "border-red-500 focus:ring-red-200 focus:border-red-500" : "",
            className,
          ].join(" ")}
        />

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
