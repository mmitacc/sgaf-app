import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id || generatedId;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-text-base"
          >
            {label}
          </label>
        )}

        <div className="relative rounded-lg shadow-sm">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
              <Icon className="h-4 w-4" />
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`block w-full rounded-lg border bg-bg-base px-3 py-2.5 text-sm text-text-base placeholder-text-muted/60 transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-bg-surface ${
              Icon ? "pl-10" : ""
            } ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-text-muted/20 focus:border-brand-primary focus:ring-brand-primary/20"
            } ${className}`}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-rose-500 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
