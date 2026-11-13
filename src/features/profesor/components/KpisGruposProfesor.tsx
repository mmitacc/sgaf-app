import { Award, BookOpen, ClipboardCheck, Users } from "lucide-react";

interface KpisGruposProfesorProps {
  estadisticas: {
    totalGrupos: number;
    totalAlumnos: number;
    entregasPendientes: number;
    promedioGlobal: string;
  };
}

export function KpisGruposProfesor({ estadisticas }: KpisGruposProfesorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 dark:hover:border-brand-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-text-muted">
            Grupos Asignados
          </span>
          <BookOpen className="h-5 w-5 text-brand-primary" />
        </div>
        <p className="text-3xl font-extrabold text-text-base mt-2">
          {estadisticas.totalGrupos}
        </p>
      </div>

      <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 dark:hover:border-brand-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-text-muted">
            Total Estudiantes
          </span>
          <Users className="h-5 w-5 text-cyan-400" />
        </div>
        <p className="text-3xl font-extrabold text-text-base mt-2">
          {estadisticas.totalAlumnos}
        </p>
      </div>

      <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 dark:hover:border-brand-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-text-muted">
            Por Calificar
          </span>
          <ClipboardCheck className="h-5 w-5 text-amber-500" />
        </div>
        <p className="text-3xl font-extrabold text-text-base mt-2">
          {estadisticas.entregasPendientes}
        </p>
      </div>

      <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 dark:hover:border-brand-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-text-muted">
            Promedio General
          </span>
          <Award className="h-5 w-5 text-emerald-500" />
        </div>
        <p className="text-3xl font-extrabold text-text-base mt-2">
          {estadisticas.promedioGlobal}
          <span className="text-sm font-normal text-text-muted"> / 20</span>
        </p>
      </div>
    </div>
  );
}
