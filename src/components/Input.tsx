import React, { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon: Icon, type = "text", className = "", ...props },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = props.id || generatedId;
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const currentType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

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
            type={currentType}
            className={`block w-full rounded-lg border bg-bg-base px-3 py-2.5 text-sm text-text-base placeholder-text-muted/60 transition-all focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-bg-surface ${
              Icon ? "pl-10" : ""
            } ${isPassword ? "pr-10" : ""} ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-text-muted/20 focus:border-brand-primary focus:ring-brand-primary/20"
            } ${className}`}
            {...props}
          />

          {/* Botón para mostrar/ocultar contraseña */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Ver contraseña"
              }
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
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
