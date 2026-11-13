import { CheckCircle2, Clock, ExternalLink, Loader2, Save } from "lucide-react";
import type { TareaGrupo } from "../types/profesorType";
import type { FilaAlumnoEntrega } from "../hooks/useTareasGrupoProfesor";

interface TablaEntregasCalificacionProps {
  tarea?: TareaGrupo;
  filasAlumnos: FilaAlumnoEntrega[];
  notasInput: Record<number, string>;
  onChangeNota: (idEntrega: number, valor: string) => void;
  guardandoNotaId: number | null;
  onGuardarNota: (idEntrega: number) => void;
}

export function TablaEntregasCalificacion({
  tarea,
  filasAlumnos,
  notasInput,
  onChangeNota,
  guardandoNotaId,
  onGuardarNota,
}: TablaEntregasCalificacionProps) {
  if (!tarea) {
    return (
      <div className="lg:col-span-8">
        <div className="rounded-2xl bg-bg-surface border border-text-muted/10 p-12 text-center text-sm text-text-muted">
          Selecciona o crea una tarea para revisar las entregas de tus
          estudiantes.
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-8">
      <div className="rounded-2xl bg-bg-surface border border-text-muted/10 overflow-hidden">
        <div className="p-6 border-b border-text-muted/10 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xl font-extrabold text-text-base">
              {tarea.nombre}
            </h3>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-primary/15 text-brand-primary">
              Vence:{" "}
              {new Date(tarea.fecha_entrega).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <p className="text-xs text-text-muted whitespace-pre-line leading-relaxed">
            {tarea.instrucciones}
          </p>
        </div>

        {filasAlumnos.length === 0 ? (
          <div className="p-10 text-center text-sm text-text-muted">
            Este grupo aún no tiene estudiantes matriculados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-text-muted/10 text-xs uppercase text-text-muted bg-black/5 dark:bg-white/5">
                  <th className="py-3.5 px-5">Estudiante</th>
                  <th className="py-3.5 px-5">Entrega / Archivo</th>
                  <th className="py-3.5 px-5 text-right">
                    Calificación (0-20)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text-muted/10 text-sm">
                {filasAlumnos.map((fila) => {
                  const entrega = fila.entrega;
                  const guardando = guardandoNotaId === entrega?.id;
                  const pendienteNota =
                    Boolean(entrega) &&
                    (entrega?.calificacion === null ||
                      entrega?.calificacion === undefined);

                  return (
                    <tr
                      key={fila.matriculaId}
                      className={`transition-colors ${
                        pendienteNota
                          ? "bg-amber-500/5 hover:bg-amber-500/10"
                          : "hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <td className="py-4 px-5 align-top">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-text-base">
                            {fila.nombreCompleto}
                          </p>
                          {pendienteNota && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              Por calificar
                            </span>
                          )}
                        </div>
                        {entrega ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 mt-0.5">
                            <CheckCircle2 className="h-3 w-3" />
                            Entregado el{" "}
                            {new Date(entrega.created).toLocaleDateString(
                              "es-PE",
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 mt-0.5">
                            <Clock className="h-3 w-3" />
                            Sin entrega
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 align-top space-y-1.5 max-w-xs">
                        {!entrega ? (
                          <span className="text-xs text-text-muted">
                            El alumno aún no ha enviado su trabajo.
                          </span>
                        ) : (
                          <>
                            {entrega.respuesta && (
                              <p className="text-xs text-text-base bg-black/5 dark:bg-white/5 p-2.5 rounded-lg line-clamp-3">
                                {entrega.respuesta}
                              </p>
                            )}
                            {entrega.archivo_url && (
                              <a
                                href={entrega.archivo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
                              >
                                Ver archivo adjunto
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </>
                        )}
                      </td>

                      <td className="py-4 px-5 align-top text-right">
                        {!entrega ? (
                          <span className="text-xs text-text-muted">—</span>
                        ) : (
                          <div className="inline-flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={20}
                              step={1}
                              value={notasInput[entrega.id] ?? ""}
                              onChange={(e) =>
                                onChangeNota(entrega.id, e.target.value)
                              }
                              placeholder="0-20"
                              className={`w-20 px-2.5 py-1.5 text-center text-sm font-bold rounded-xl border text-text-base placeholder:text-text-muted/35 placeholder:font-normal focus:outline-none focus:border-brand-primary transition-colors ${
                                pendienteNota
                                  ? "bg-amber-500/10 border-amber-500/50"
                                  : "bg-bg-surface border-emerald-500/40"
                              }`}
                            />
                            <button
                              type="button"
                              disabled={guardando}
                              onClick={() => onGuardarNota(entrega.id)}
                              title="Guardar calificación"
                              className={`p-2 rounded-xl text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer ${
                                pendienteNota
                                  ? "bg-amber-500 shadow-sm shadow-amber-500/25"
                                  : "bg-brand-primary"
                              }`}
                            >
                              {guardando ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
