import { Routes, Route, Navigate } from "react-router";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { NotFound, Unauthorized } from "@/components";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";

export function AppRouter() {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS (Sin Layout de Dashboard) --- */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- RUTAS PRIVADAS (Requieren sesión activa) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="perfil" element={<ProfilePage />} />

          <Route
            path="dashboard"
            element={
              <div className="space-y-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
                  Panel Principal
                </h1>
                <p className="text-text-muted">
                  Bienvenido al sgaf-app de Tech University.
                </p>
              </div>
            }
          />

          <Route
            path="courses"
            element={
              <div className="space-y-4">
                <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
                  Mis Cursos
                </h1>
                <p className="text-text-muted">
                  Explora tus asignaturas activas y material de estudio.
                </p>
              </div>
            }
          />

          {/* Ruta de acceso denegado dentro del Dashboard */}
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* Ejemplo listo para cuando crees módulos restringidos por rol:
          <Route element={<ProtectedRoute allowedRoles={["ADMINISTRADOR", "RECEPCIONISTA"]} />}>
            <Route path="usuarios" element={<UsuariosPage />} />
          </Route> 
          */}
        </Route>
      </Route>

      {/* --- RUTA COMODÍN 404  --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
