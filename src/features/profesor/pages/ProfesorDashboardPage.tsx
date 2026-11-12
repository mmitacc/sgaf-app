import { Link } from "react-router";
import {
  BookOpen,
  FileSpreadsheet,
  CalendarCheck,
  ArrowUpRight,
  Award,
} from "lucide-react";
import { CONFIG_POR_ROL } from "@/config/roles.config";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export function ProfesorDashboardPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const { tituloPanel, subtituloPanel } = CONFIG_POR_ROL.PROFESOR;

  const herramientasDocente = [
    {
      titulo: "Mis Cursos Asignados",
      descripcion:
        "Revisa los grupos, horarios y sílabos de las asignaturas a tu cargo.",
      ruta: "/profesor/cursos",
      icono: BookOpen,
    },
    {
      titulo: "Registro de Calificaciones",
      descripcion:
        "Ingresa y actualiza notas parciales, prácticas y evaluaciones finales.",
      ruta: "/profesor/notas",
      icono: FileSpreadsheet,
    },
    {
      titulo: "Control de Asistencia",
      descripcion:
        "Marca la asistencia diaria de tus estudiantes por sesión de clase.",
      ruta: "/profesor/asistencia",
      icono: CalendarCheck,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-text-muted/10 pb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
          <Award className="h-4 w-4" />
          Plana Docente
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
          {tituloPanel}
        </h1>
        <p className="text-text-muted mt-1">
          Prof.{" "}
          <span className="font-semibold text-text-base">
            {usuario?.nombres} {usuario?.apellidos}
          </span>
          . {subtituloPanel}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {herramientasDocente.map((item) => (
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
