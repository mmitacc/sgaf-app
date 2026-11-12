import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  Sun,
  Moon,
  Users,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Footer, Button } from "@/components";
import { useTheme } from "@/context/ThemeContext";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { toast } from "sonner";
import { CONFIG_POR_ROL } from "@/config/roles.config";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Extraemos usuario y logout del store
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada correctamente");
    navigate("/login", { replace: true });
  };

  // Obtenemos la configuración exacta del rol actual
  const navigation = usuario ? CONFIG_POR_ROL[usuario.rol].menu : [];

  return (
    <div className="min-h-screen bg-bg-base text-text-base transition-colors duration-200">
      {/* --- SIDEBAR PARA MÓVILES (OVERLAY) --- */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/40 backdrop-blur-sm">
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-bg-surface p-6 shadow-xl border-r border-text-muted/10 animate-fade-in-right">
            <div className="flex items-center justify-between">
              <Logo className="h-8" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="md:hidden"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="mt-8 flex flex-col gap-1.5">
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" &&
                    !item.path.endsWith("/dashboard") &&
                    location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                        : "text-text-muted hover:bg-text-muted/5 hover:text-text-base"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* --- SIDEBAR ESCRITORIO (FIJO) --- */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-text-muted/10 bg-bg-surface">
        <div className="flex h-16 items-center px-6 border-b border-text-muted/10">
          <Logo className="h-8" />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="flex flex-col gap-1.5">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" &&
                  !item.path.endsWith("/dashboard") &&
                  location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                      : "text-text-muted hover:bg-text-muted/5 hover:text-text-base"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Botón Cerrar Sesión inferior */}
          <Button
            variant="danger"
            icon={LogOut}
            onClick={handleLogout}
            className="w-full justify-start"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* --- CONTENEDOR PRINCIPAL (NAVBAR + CONTENIDO) --- */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* BARRA SUPERIOR (NAVBAR) */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-text-muted/10 bg-bg-surface/80 backdrop-blur px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Espaciador o Barra de búsqueda si se requiere */}
          <div className="flex-1 md:flex-none"></div>

          {/* Menú de Perfil de Usuario */}
          <div className="flex items-center gap-4">
            {/* Botón interruptor de temas claro/oscuro */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-brand-primary" />
              )}
            </Button>

            {/* Menú de Perfil de Usuario */}
            <Button
              variant="ghost"
              onClick={() => navigate("/perfil")}
              className="rounded-full bg-text-muted/5 p-1.5 pr-3 font-medium"
            >
              {usuario?.foto_url ? (
                <img
                  src={usuario.foto_url}
                  alt={usuario.nombres}
                  className="h-8 w-8 rounded-full object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-secondary text-xs font-bold text-white shadow-sm shadow-brand-secondary/30">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="hidden sm:flex flex-col justify-center text-center items-center h-full px-2">
                {/* Nombre de usuario principal - Usa text-text-base para que cambie a Gray 100 automáticamente */}
                <span className="text-sm font-bold text-text-base leading-none">
                  {usuario?.nombres || "Mi Perfil"}
                </span>

                {/* Línea divisoria horizontal sutil y visible */}
                <div className="w-16 border-t-2 border-slate-300 dark:border-slate-700 my-1 opacity-100" />

                {/* Rol con el color exacto de 'University' (Cyan) y tamaño ultra pequeño */}
                <span className="text-[10px] font-extrabold tracking-wider text-brand-primary uppercase leading-none">
                  {usuario?.rol || "USUARIO"}
                </span>
              </div>
            </Button>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO INYECTADO */}
        <main className="flex flex-col flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />{" "}
            {/* Aquí React Router inyectará las páginas automáticamente */}
          </div>
          {/* Pie de Página */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
