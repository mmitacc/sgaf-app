import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "@/layouts/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />, // Envuelve todas las vistas internas
    children: [
      {
        index: true,
        path: "dashboard",
        element: (
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
              Panel Principal
            </h1>
            <p className="text-text-muted">
              Bienvenido al sgaf-app de Tech University.
            </p>
          </div>
        ),
      },
      {
        path: "courses",
        element: (
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
              Mis Cursos
            </h1>
            <p className="text-text-muted">
              Explora tus asignaturas activas y material de estudio.
            </p>
          </div>
        ),
      },
      // Ruta por defecto si entran a la raíz redirecciona o muestra el inicio
      {
        path: "",
        element: (
          <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-6 text-center">
            <h2 className="text-xl font-bold text-brand-primary">
              ¡Estructura de Layout Inicializada!
            </h2>
            <p className="mt-2 text-text-muted">
              Navega utilizando la barra lateral para ver los cambios.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="p-8 text-center text-text-base">
        404 - Ruta no encontrada
      </div>
    ),
  },
]);
