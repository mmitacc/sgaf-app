import { Link } from "react-router";
import {
  ClipboardCheck,
  Receipt,
  GraduationCap,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { CONFIG_POR_ROL } from "@/config/roles.config";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export function RecepcionDashboardPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const { tituloPanel, subtituloPanel } = CONFIG_POR_ROL.RECEPCIONISTA;

  const accionesVentanilla = [
    {
      titulo: "Matrículas e Inscripciones",
      descripcion:
        "Procesa nuevas matrículas, asignación de turnos y validación de requisitos.",
      ruta: "/recepcion/matriculas",
      icono: ClipboardCheck,
    },
    {
      titulo: "Caja y Registro de Pagos",
      descripcion:
        "Registra pagos de pensiones, derechos de trámite y emite comprobantes.",
      ruta: "/recepcion/pagos",
      icono: Receipt,
    },
    {
      titulo: "Directorio de Estudiantes",
      descripcion:
        "Consulta datos de contacto, apoderados y estado académico de los alumnos.",
      ruta: "/recepcion/estudiantes",
      icono: GraduationCap,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-text-muted/10 pb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
          <Sparkles className="h-4 w-4" />
          Atención y Caja
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
          {tituloPanel}
        </h1>
        <p className="text-text-muted mt-1">
          Bienvenido,{" "}
          <span className="font-semibold text-text-base">
            {usuario?.nombres}
          </span>
          . {subtituloPanel}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {accionesVentanilla.map((item) => (
          <Link
            key={item.ruta}
            to={item.ruta}
            className="group rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary"
          >
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
          </Link>
        ))}
      </div>
    </div>
  );
}
