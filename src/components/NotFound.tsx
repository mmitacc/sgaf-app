import { useNavigate } from "react-router";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { Button, Logo } from "@/components";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-base p-6 text-center text-text-base transition-colors duration-200">
      <div className="mb-8">
        <Logo className="h-10" />
      </div>

      <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
        <FileQuestion className="h-12 w-12" />
        <span className="absolute -top-2 -right-2 rounded-full bg-brand-secondary px-2.5 py-0.5 text-xs font-extrabold text-white shadow-sm">
          404
        </span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-sm text-text-muted sm:text-base">
        La ruta que intentas visitar no existe o fue movida a otra sección de la
        plataforma.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Volver atrás
        </Button>
        <Button
          variant="primary"
          icon={Home}
          onClick={() => navigate("/dashboard")}
        >
          Ir al Inicio
        </Button>
      </div>
    </div>
  );
}
