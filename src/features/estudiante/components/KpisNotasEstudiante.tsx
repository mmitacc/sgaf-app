import { Award, BookOpen, TrendingUp } from "lucide-react";

interface KpisNotasEstudianteProps {
  promedioGeneral: string;
  cursosAprobados: number;
  totalCursos: number;
  creditosTotales: number;
}

export function KpisNotasEstudiante({
  promedioGeneral,
  cursosAprobados,
  totalCursos,
  creditosTotales,
}: KpisNotasEstudianteProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Promedio Ponderado
          </span>
          <div className="p-2 rounded-xl bg-brand-primary/15 text-brand-primary">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-text-base mt-3">
          {promedioGeneral}
          <span className="text-sm font-normal text-text-muted"> / 20</span>
        </p>
      </div>

      <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Cursos Aprobados
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
            <Award className="h-5 w-5" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-text-base mt-3">
          {cursosAprobados}{" "}
          <span className="text-sm font-normal text-text-muted">
            de {totalCursos} inscritos
          </span>
        </p>
      </div>

      <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Carga Académica
          </span>
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-500">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
        <p className="text-3xl font-extrabold text-text-base mt-3">
          {creditosTotales}{" "}
          <span className="text-sm font-normal text-text-muted">
            créditos totales
          </span>
        </p>
      </div>
    </div>
  );
}
