interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "h-10", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto"
        fill="none"
        xmlns="http://w3.org"
      >
        <defs>
          <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-secondary)" />
          </linearGradient>
        </defs>
        {/* Isotipo: Combinación de Gorro de Graduación Estilizado y Circuitos */}
        <path d="M50 15L15 35L50 55L85 35L50 15Z" fill="url(#techGrad)" />
        <path
          d="M25 46.5V65C25 75 50 85 50 85C50 85 75 75 75 65V46.5L50 61L25 46.5Z"
          fill="url(#techGrad)"
          opacity="0.85"
        />
        <circle cx="50" cy="35" r="6" fill="#000" opacity="0.15" />
      </svg>

      {showText && (
        <span className="font-extrabold text-xl tracking-tight text-text-base">
          Tech<span className="text-brand-primary">University</span>
        </span>
      )}
    </div>
  );
}
