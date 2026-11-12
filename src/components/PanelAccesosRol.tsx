import { Link } from "react-router";
import { ArrowUpRight, Award, type LucideIcon } from "lucide-react";
import { CONFIG_POR_ROL } from "@/config/roles.config";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import type { Rol } from "@/features/usuario/types/usuarioType";

interface PanelAccesosRolProps {
  rol: Rol;
  prefijoNombre?: string;
  iconoCabecera?: LucideIcon;
  children?: React.ReactNode;
}

export function PanelAccesosRol({
  rol,
  prefijoNombre = "",
  iconoCabecera: IconoCabecera = Award,
  children,
}: PanelAccesosRolProps) {
  const usuario = useAuthStore((state) => state.usuario);
  const { rutaInicial, tituloPanel, subtituloPanel, etiquetaRol, menu } =
    CONFIG_POR_ROL[rol];

  const accesosDirectos = menu.filter((item) => item.path !== rutaInicial);

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="border-b border-text-muted/10 pb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
          <IconoCabecera className="h-4 w-4" />
          {etiquetaRol}
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
          {tituloPanel}
        </h1>
        <p className="text-text-muted mt-1">
          Bienvenido(a),{" "}
          <span className="font-semibold text-text-base">
            {prefijoNombre}
            {usuario?.nombres} {usuario?.apellidos}
          </span>
          . {subtituloPanel}
        </p>
      </div>

      {/* Espacio opcional para KPIs o alertas específicas de cada rol */}
      {children}

      {/* Tarjetas de Acceso Rápido generadas desde roles.config.ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accesosDirectos.map((item) => {
          const Icono = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="group rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary">
                  <Icono className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-text-muted group-hover:text-brand-primary transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-text-base group-hover:text-brand-primary transition-colors">
                {item.label}
              </h3>
              {item.descripcion && (
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {item.descripcion}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
