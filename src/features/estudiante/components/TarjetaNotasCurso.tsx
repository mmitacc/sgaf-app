import { Calendar, CheckCircle2, Clock, User } from "lucide-react";
import {
  NOTA_MINIMA_APROBATORIA,
  type CursoConPromedio,
} from "../hooks/useNotasEstudiante";

interface TarjetaNotasCursoProps {
  curso: CursoConPromedio;
}

export function TarjetaNotasCurso({ curso }: TarjetaNotasCursoProps) {
  const aprobado =
    curso.promedioCurso !== null &&
    curso.promedioCurso >= NOTA_MINIMA_APROBATORIA;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-primary/15 text-brand-primary">
                Grupo #{curso.grupo.id}
              </span>
              <span className="text-xs font-semibold text-text-muted">
                • {curso.grupo.materia.creditos} Créditos
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-text-base">
              {curso.grupo.materia.nombre}
            </h3>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-primary" />
              {curso.grupo?.profesor?.usuario
                ? `Prof. ${curso.grupo.profesor.usuario.nombres} ${curso.grupo.profesor.usuario.apellidos}`
                : "Por asignar"}
            </p>
          </div>

          <div className="text-right shrink-0">
            <div
              className={`inline-flex flex-col items-center px-3.5 py-2 rounded-xl border ${
                curso.promedioCurso === null
                  ? "bg-amber-500/10 border-amber-500/25 text-amber-500"
                  : aprobado
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-500"
                    : "bg-rose-500/10 border-rose-500/25 text-rose-500"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {curso.promedioCurso === null
                  ? "Pendiente"
                  : aprobado
                    ? "Aprobado"
                    : "Desaprobado"}
              </span>
              <span className="text-xl font-extrabold leading-tight mt-0.5">
                {curso.promedioCurso !== null
                  ? curso.promedioCurso.toFixed(1)
                  : "--"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-text-muted/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-text-muted">
            <span>Evaluaciones ({curso.totalTareas})</span>
            <span>Nota</span>
          </div>

          {curso.grupo.tareas.length === 0 ? (
            <p className="text-xs text-text-muted py-2">
              Aún no hay evaluaciones publicadas en este grupo.
            </p>
          ) : (
            <div className="space-y-2">
              {curso.grupo.tareas.map((tarea) => {
                const entrega = tarea.entregas?.[0];
                const nota = entrega?.calificacion;

                return (
                  <div
                    key={tarea.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-text-base">
                        {tarea.nombre}
                      </p>
                      <div className="flex items-center gap-3 text-text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(tarea.fecha_entrega).toLocaleDateString(
                            "es-PE",
                            {
                              day: "2-digit",
                              month: "short",
                            },
                          )}
                        </span>
                        {entrega ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-medium">
                            <CheckCircle2 className="h-3 w-3" />
                            Entregado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
                            <Clock className="h-3 w-3" />
                            Sin entrega
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="font-extrabold text-sm">
                      {nota !== null && nota !== undefined ? (
                        <span
                          className={
                            nota >= NOTA_MINIMA_APROBATORIA
                              ? "text-emerald-500"
                              : "text-rose-500"
                          }
                        >
                          {nota.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-text-muted px-2 py-1 rounded-md bg-text-muted/10">
                          Por calificar
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-text-muted/10 flex items-center justify-between text-[11px] text-text-muted">
        <span>{curso.grupo.periodo.nombre}</span>
        <span>
          {curso.tareasCalificadas} de {curso.totalTareas} calificadas
        </span>
      </div>
    </div>
  );
}
