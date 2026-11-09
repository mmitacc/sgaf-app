import { RouterProvider } from "react-router";
import { router } from "@/routes/router";
import { Toaster } from "sonner";
// Nota: Aquí envolverás la app con <ThemeProvider> o <AuthProvider> más adelante

export default function App() {
  return (
    <>
      {/* Sistema global de notificaciones toast */}
      <Toaster position="top-right" richColors closeButton />

      {/* Proveedor central de rutas */}
      <RouterProvider router={router} />
    </>
  );
}
