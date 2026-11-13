import { Routes, Route, Navigate } from "react-router";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { NotFound, Unauthorized } from "@/components";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { RUTA_INICIAL_POR_ROL } from "@/config/roles.config";

// Páginas Públicas y Perfil
import LoginPage from "@/features/auth/pages/LoginPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import { RegistroPage } from "@/features/auth/pages/RegistroPage";

// Páginas Administrador
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { UsuariosPage } from "@/features/usuario/pages/UsuariosPage";
import { RegistroUsuarioPage } from "@/features/usuario/pages/RegistroUsuarioPage";

// Páginas Recepcionista
import { RecepcionDashboardPage } from "@/features/recepcion/pages/RecepcionDashboardPage";
import { ActivacionMatriculaPage } from "@/features/recepcion/pages/ActivacionMatriculaPage";

// Páginas Profesor
import { ProfesorDashboardPage } from "@/features/profesor/pages/ProfesorDashboardPage";
import { GruposProfesorPage } from "@/features/profesor/pages/GruposProfesorPage";
import { TareasGrupoProfesorPage } from "@/features/profesor/pages/TareasGrupoProfesorPage";

// Páginas Estudiante
import { EstudianteDashboardPage } from "@/features/estudiante/pages/EstudianteDashboardPage";
import { PagosPage } from "@/features/recepcion/pages/PagosPage";
import { EstadoCuentaEstudiantePage } from "@/features/estudiante/pages/EstadoCuentaPage";
import { MatriculaEstudiantePage } from "@/features/estudiante/pages/MatriculaEstudiantePage";
import { NotasEstudiantePage } from "@/features/estudiante/pages/NotasEstudiantePage";
import { AulaVirtualEstudiantePage } from "@/features/estudiante/pages/AulaVirtualEstudiantePage";
import { MaterialesProfesorPage } from "@/features/profesor/pages/MaterialesProfesorPage";

function RoleRedirect() {
  const usuario = useAuthStore((state) => state.usuario);
  if (!usuario) return <Navigate to="/login" replace />;
  return <Navigate to={RUTA_INICIAL_POR_ROL[usuario.rol]} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      {/* --- RUTAS PRIVADAS --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout />}>
          {/* Redirección automática al panel del rol */}
          <Route index element={<RoleRedirect />} />

          {/* Compartidas */}
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* 1. MÓDULOS ADMINISTRADOR */}
          <Route element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]} />}>
            <Route path="admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="usuario" element={<UsuariosPage />} />
            <Route path="usuario/nuevo" element={<RegistroUsuarioPage />} />
            <Route
              path="usuario/editar/:id"
              element={<RegistroUsuarioPage />}
            />
            {/* Futuras rutas del menu: */}
            <Route path="admin/finanzas" element={<div>Módulo Finanzas</div>} />
          </Route>

          {/* 2. MÓDULOS RECEPCIONISTA */}
          <Route element={<ProtectedRoute allowedRoles={["RECEPCIONISTA"]} />}>
            <Route
              path="recepcion/dashboard"
              element={<RecepcionDashboardPage />}
            />
            <Route
              path="recepcion/matriculas"
              element={<ActivacionMatriculaPage />}
            />
            <Route path="recepcion/pagos" element={<PagosPage />} />
            <Route
              path="recepcion/estudiantes"
              element={<div>Directorio Estudiantes</div>}
            />
          </Route>

          {/* 3. MÓDULOS PROFESOR */}
          <Route element={<ProtectedRoute allowedRoles={["PROFESOR"]} />}>
            <Route
              path="profesor/dashboard"
              element={<ProfesorDashboardPage />}
            />
            <Route path="/profesor/grupos" element={<GruposProfesorPage />} />
            <Route
              path="profesor/tareas-grupo"
              element={<TareasGrupoProfesorPage />}
            />
            <Route
              path="profesor/materiales"
              element={<MaterialesProfesorPage />}
            />
          </Route>

          {/* 4. MÓDULOS ESTUDIANTE */}
          <Route element={<ProtectedRoute allowedRoles={["ESTUDIANTE"]} />}>
            <Route
              path="estudiante/dashboard"
              element={<EstudianteDashboardPage />}
            />
            <Route
              path="estudiante/matricula"
              element={<MatriculaEstudiantePage />}
            />
            <Route path="/estudiante/notas" element={<NotasEstudiantePage />} />
            <Route
              path="estudiante/pagos"
              element={<EstadoCuentaEstudiantePage />}
            />
            <Route
              path="estudiante/aula-virtual"
              element={<AulaVirtualEstudiantePage />}
            />
          </Route>

          {/* Comodín interno 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      {/* Comodín externo 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
