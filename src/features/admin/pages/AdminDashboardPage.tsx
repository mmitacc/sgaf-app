import { Link } from "react-router";
import {
  Users,
  UserPlus,
  Wallet,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { CONFIG_POR_ROL } from "@/config/roles.config";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export function AdminDashboardPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const { tituloPanel, subtituloPanel } = CONFIG_POR_ROL.ADMINISTRADOR;

  const accesosRapidos = [
    {
      titulo: "Gestión de Usuarios",
      descripcion:
        "Administra cuentas de estudiantes, docentes, recepcionistas y reseteo de claves.",
      ruta: "/usuario",
      icono: Users,
      etiqueta: "CRUD Activo",
    },
    {
      titulo: "Registrar Nuevo Usuario",
      descripcion:
        "Da de alta a personal académico o administrativo con asignación de especialidad.",
      ruta: "/usuario/nuevo",
      icono: UserPlus,
      etiqueta: "Acceso Directo",
    },
    {
      titulo: "Finanzas y Reportes",
      descripcion:
        "Supervisa ingresos por matrículas, pensiones cobradas y balances del ciclo.",
      ruta: "/admin/finanzas",
      icono: Wallet,
      etiqueta: "Módulo Financiero",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabecera de bienvenida */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-text-muted/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <ShieldCheck className="h-4 w-4" />
            Modo Administrador
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
            {tituloPanel}
          </h1>
          <p className="text-text-muted mt-1">
            Hola,{" "}
            <span className="font-semibold text-text-base">
              {usuario?.nombres}
            </span>
            . {subtituloPanel}
          </p>
        </div>
      </div>

      {/* Tarjetas de métricas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10">
          <p className="text-xs font-medium text-text-muted uppercase">
            Ciclo Académico
          </p>
          <p className="text-2xl font-bold text-text-base mt-1">2026 - II</p>
          <span className="text-xs text-brand-primary font-medium">
            En curso
          </span>
        </div>
        <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10">
          <p className="text-xs font-medium text-text-muted uppercase">
            Estado del Sistema
          </p>
          <p className="text-2xl font-bold text-text-base mt-1">Operativo</p>
          <span className="text-xs text-emerald-500 font-medium">
            API & Cloudinary activos
          </span>
        </div>
        <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10">
          <p className="text-xs font-medium text-text-muted uppercase">
            Seguridad
          </p>
          <p className="text-2xl font-bold text-text-base mt-1">4 Roles</p>
          <span className="text-xs text-text-muted">
            Control de acceso activo
          </span>
        </div>
      </div>

      {/* Accesos directos con estilo Premium */}
      <div>
        <h2 className="text-lg font-bold text-text-base mb-4">
          Módulos Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {accesosRapidos.map((item) => (
            <Link
              key={item.ruta}
              to={item.ruta}
              className="group relative flex flex-col justify-between rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary">
                    <item.icono className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-text-muted group-hover:text-brand-primary transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-text-base group-hover:text-brand-primary transition-colors">
                  {item.titulo}
                </h3>
                <p className="text-sm text-text-muted mt-2 leading-relaxed">
                  {item.descripcion}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-text-muted/10">
                <span className="text-xs font-semibold text-brand-primary">
                  {item.etiqueta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
