import { BookOpen, Filter, GraduationCap, Loader2 } from "lucide-react";
import { useNotasEstudiante } from "../hooks/useNotasEstudiante";
import { KpisNotasEstudiante } from "../components/KpisNotasEstudiante";
import { TarjetaNotasCurso } from "../components/TarjetaNotasCurso";

export function NotasEstudiantePage() {
  const {
    cargando,
    periodoSeleccionado,
    setPeriodoSeleccionado,
    periodosDisponibles,
    cursosProcesados,
    promedioGeneral,
    creditosTotales,
    cursosAprobados,
  } = useNotasEstudiante();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-text-muted/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <GraduationCap className="h-4 w-4" />
            Record Académico
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
            Mis Calificaciones
          </h1>
          <p className="text-text-muted mt-1">
            Revisa tus notas por asignatura, evaluaciones entregadas y promedio
            ponderado.
          </p>
        </div>

        {periodosDisponibles.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="h-4 w-4 text-text-muted" />
            <select
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              className="rounded-xl bg-bg-surface px-4 py-2.5 text-sm font-medium text-text-base border border-text-muted/15 focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
            >
              <option value="TODOS">Todos los periodos</option>
              {periodosDisponibles.map(([id, nombre]) => (
                <option key={id} value={String(id)}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <KpisNotasEstudiante
        promedioGeneral={promedioGeneral}
        cursosAprobados={cursosAprobados}
        totalCursos={cursosProcesados.length}
        creditosTotales={creditosTotales}
      />

      {cargando ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-sm text-text-muted">
            Calculando tu historial de calificaciones...
          </p>
        </div>
      ) : cursosProcesados.length === 0 ? (
        <div className="rounded-2xl bg-bg-surface border border-text-muted/10 py-16 text-center space-y-2">
          <BookOpen className="h-10 w-10 text-text-muted/40 mx-auto" />
          <p className="font-bold text-text-base">
            No tienes asignaturas registradas
          </p>
          <p className="text-xs text-text-muted">
            Inscríbete en tus grupos desde Matrícula en Línea para ver tus
            notas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cursosProcesados.map((curso) => (
            <TarjetaNotasCurso key={curso.id} curso={curso} />
          ))}
        </div>
      )}
    </div>
  );
}
