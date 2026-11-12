import { Navigate } from "react-router";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { RUTA_INICIAL_POR_ROL } from "@/config/roles.config";

export function RoleRedirect() {
  const usuario = useAuthStore((state) => state.usuario);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const rutaDestino = RUTA_INICIAL_POR_ROL[usuario.rol] || "/unauthorized";
  return <Navigate to={rutaDestino} replace />;
}
