import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import type { Rol } from "@/features/usuario/schemas/usuarioSchema";

interface ProtectedRouteProps {
  allowedRoles?: Rol[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const usuario = useAuthStore((s) => s.usuario);

  // 1. Si no está autenticado, redirige al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si se especificaron roles y el usuario no tiene permiso, redirige al dashboard
  if (allowedRoles && usuario && !allowedRoles.includes(usuario.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Renderiza las rutas hijas protegidas
  return <Outlet />;
};
