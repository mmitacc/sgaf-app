import { Routes, Route, Navigate } from "react-router";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { NotFound, Unauthorized } from "@/components";
import LoginPage from "@/features/auth/pages/LoginPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import { RegistroPage } from "@/features/auth/pages/RegistroPage";
import { RegistroUsuarioPage } from "@/features/usuario/pages/RegistroUsuarioPage";
import { UsuariosPage } from "@/features/usuario/pages/UsuariosPage";

export function AppRouter() {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS (Sin Layout de Dashboard) --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
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

          {/* Rutas restringidos por rol */}
          <Route element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]} />}>
            <Route path="/usuario" element={<UsuariosPage />} />
            <Route path="/usuario/nuevo" element={<RegistroUsuarioPage />} />
            <Route
              path="/usuario/editar/:id"
              element={<RegistroUsuarioPage />}
            />
          </Route>
        </Route>
      </Route>

      {/* --- RUTA COMODÍN 404  --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
