import React, { useId } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = "", ...props }, ref) => {
    const generatedId = useId();
    const selectId = props.id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-text-base"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-lg shadow-sm">
          <select
            id={selectId}
            ref={ref}
            className={`block w-full rounded-lg border bg-bg-base px-3 py-2.5 text-sm text-text-base appearance-none transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-text-muted/20 focus:border-brand-primary focus:ring-brand-primary/20"
            } ${className}`}
            {...props}
          />
          {/* Icono de flecha personalizado */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
            <svg
              className="h-4 w-4 fill-none stroke-current"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
