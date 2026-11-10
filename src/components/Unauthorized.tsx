import { useNavigate } from "react-router";
import { ShieldAlert, Home } from "lucide-react";
import { Button } from "@/components";

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center text-text-base">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
        <ShieldAlert className="h-10 w-10" />
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        Acceso Restringido
      </h1>
      <p className="mt-2 max-w-md text-sm text-text-muted">
        Tu rol actual no cuenta con los permisos necesarios para visualizar este
        módulo académico.
      </p>

      <div className="mt-6">
        <Button
          variant="primary"
          icon={Home}
          onClick={() => navigate("/dashboard")}
        >
          Regresar a mi Panel
        </Button>
      </div>
    </div>
  );
}
