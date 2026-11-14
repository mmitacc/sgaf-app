import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import type { Rol } from "@/features/usuario/types/usuarioType";

interface ProtectedRouteProps {
  allowedRoles?: Rol[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const usuario = useAuthStore((s) => s.usuario);

  // 1. Si no está autenticado, redirige al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si es ESTUDIANTE con estado PENDIENTE o SUSPENDIDO, solo puede acceder a pagos
  const isEstudianteRestringido =
    usuario?.rol === "ESTUDIANTE" &&
    (usuario?.estado === "PENDIENTE" || usuario?.estado === "SUSPENDIDO");

  if (isEstudianteRestringido && location.pathname !== "/estudiante/pagos") {
    return <Navigate to="/estudiante/pagos" replace />;
  }

  // 3. Si se especificaron roles y el usuario no tiene permiso, redirige al dashboard
  if (allowedRoles && usuario && !allowedRoles.includes(usuario.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Renderiza las rutas hijas protegidas
  return <Outlet />;
}
