import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { Footer } from "@/components";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { CONFIG_POR_ROL } from "@/config/roles.config";
import { HeaderLayout } from "./HeaderLayout";
import { SidebarLayout } from "./SidebarLayout";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada correctamente");
    navigate("/login", { replace: true });
  };

  const navigation = usuario ? CONFIG_POR_ROL[usuario.rol].menu : [];

  return (
    <div className="min-h-screen bg-bg-base text-text-base transition-colors duration-200">
      <SidebarLayout
        navigation={navigation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="md:pl-64 flex flex-col min-h-screen">
        <HeaderLayout
          usuario={usuario}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex flex-col flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl flex-1">
            <ErrorBoundary
              key={location.pathname}
              titulo="Ocurrió un problema al cargar esta sección"
            >
              <Outlet />
            </ErrorBoundary>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
