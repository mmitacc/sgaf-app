import { useNavigate } from "react-router";
import { Menu, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components";
import { useTheme } from "@/context/ThemeContext";

interface UsuarioHeader {
  nombres?: string;
  rol?: string;
  foto_url?: string | null;
}

interface DashboardHeaderProps {
  usuario: UsuarioHeader | null;
  onOpenSidebar: () => void;
}

export function HeaderLayout({ usuario, onOpenSidebar }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-text-muted/10 bg-bg-surface/80 backdrop-blur px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenSidebar}
        className="md:hidden"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex-1 md:flex-none" />

      <div className="flex items-center gap-4">
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
            <span className="text-sm font-bold text-text-base leading-none">
              {usuario?.nombres || "Mi Perfil"}
            </span>
            <div className="w-16 border-t-2 border-slate-300 dark:border-slate-700 my-1 opacity-100" />
            <span className="text-[10px] font-extrabold tracking-wider text-brand-primary uppercase leading-none">
              {usuario?.rol || "USUARIO"}
            </span>
          </div>
        </Button>
      </div>
    </header>
  );
}
