import React from "react";
import { Loader2 } from "lucide-react";

// Extendemos las propiedades nativas del botón de HTML para no perder nada (type, onClick, etc.)
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon: Icon,
  className = "",
  disabled,
  ...props
}) => {
  // Estilos base comunes
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  // Variantes usando tu paleta semántica de Tailwind v4
  const variants = {
    primary:
      "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-md shadow-brand-primary/20",
    secondary:
      "bg-brand-secondary text-white hover:bg-brand-secondary/90 shadow-md shadow-brand-secondary/20",
    outline:
      "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5",
    ghost: "text-text-base hover:bg-text-muted/10",
    danger: "text-rose-500 hover:bg-rose-500/10", // Ideal para "Cerrar Sesión"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
    icon: "p-2", // Ideal para botones cuadrados de solo icono (Tema, Menú, Cerrar)
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      {children}
    </button>
  );
};
