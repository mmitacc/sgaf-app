import { Link, useLocation } from "react-router";
import { X, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components";
import type { ItemMenu } from "@/config/roles.config";

interface DashboardSidebarProps {
  navigation: ItemMenu[];
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function SidebarLayout({
  navigation,
  isOpen,
  onClose,
  onLogout,
}: DashboardSidebarProps) {
  const location = useLocation();

  const renderLinks = (cerrarEnClick = false) => (
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
            onClick={cerrarEnClick ? onClose : undefined}
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
  );

  return (
    <>
      {/* --- SIDEBAR MÓVIL (OVERLAY) --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/40 backdrop-blur-sm">
          <div className="relative flex w-full max-w-xs flex-1 flex-col justify-between bg-bg-surface p-6 shadow-xl border-r border-text-muted/10 animate-fade-in-right">
            <div>
              <div className="flex items-center justify-between mb-8">
                <Logo className="h-8" />
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              {renderLinks(true)}
            </div>

            <Button
              variant="danger"
              icon={LogOut}
              onClick={onLogout}
              className="w-full justify-start"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      )}

      {/* --- SIDEBAR ESCRITORIO (FIJO) --- */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-text-muted/10 bg-bg-surface">
        <div className="flex h-16 items-center px-6 border-b border-text-muted/10">
          <Logo className="h-8" />
        </div>
        <div className="flex flex-1 flex-col justify-between p-4">
          {renderLinks(false)}
          <Button
            variant="danger"
            icon={LogOut}
            onClick={onLogout}
            className="w-full justify-start"
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </>
  );
}
