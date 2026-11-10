import { Loader2 } from "lucide-react";
import { Logo } from "@/components";

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({
  message = "Cargando entorno académico...",
}: PageLoaderProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-base p-6 text-text-base">
      <Logo className="mb-6 h-10 animate-pulse" />
      <div className="flex items-center gap-3 text-sm font-medium text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
        <span>{message}</span>
      </div>
    </div>
  );
}
