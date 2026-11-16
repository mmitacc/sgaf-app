interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode; // Permite inyectar botones o filtros dinámicamente
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-text-muted/10 pb-5 mb-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-base sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-text-muted max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex items-center gap-3 shrink-0">{action}</div>
      )}
    </div>
  );
}
