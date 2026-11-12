import { Link } from "react-router";
import {
  FileSpreadsheet,
  Wallet,
  UserCheck,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import { CONFIG_POR_ROL } from "@/config/roles.config";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export function EstudianteDashboardPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const { tituloPanel, subtituloPanel } = CONFIG_POR_ROL.ESTUDIANTE;

  const accesosAlumno = [
    {
      titulo: "Mis Calificaciones",
      descripcion:
        "Consulta tus notas por curso, promedios parciales y récord académico.",
      ruta: "/estudiante/notas",
      icono: FileSpreadsheet,
    },
    {
      titulo: "Estado de Cuenta y Pagos",
      descripcion:
        "Revisa tu cronograma de cuotas, pagos realizados y fechas de vencimiento.",
      ruta: "/estudiante/pagos",
      icono: Wallet,
    },
    {
      titulo: "Mi Perfil y Seguridad",
      descripcion:
        "Actualiza tus datos personales, foto de perfil o cambia tu contraseña.",
      ruta: "/perfil",
      icono: UserCheck,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-text-muted/10 pb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
          <GraduationCap className="h-4 w-4" />
          Campus Virtual
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {accesosAlumno.map((item) => (
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
