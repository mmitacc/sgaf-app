import { Calendar, FileText, Users } from "lucide-react";
import type { GrupoProfesor, TareaGrupo } from "../types/profesorType";

interface ListaTareasGrupoProps {
  grupo: GrupoProfesor;
  tareaActivaId?: number;
  onSeleccionarTarea: (id: number) => void;
}

export function ListaTareasGrupo({
  grupo,
  tareaActivaId,
  onSeleccionarTarea,
}: ListaTareasGrupoProps) {
  return (
    <div className="lg:col-span-4 space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
        Actividades del Grupo ({grupo.tareas.length})
      </h2>

      {grupo.tareas.length === 0 ? (
        <div className="rounded-2xl bg-bg-surface border border-text-muted/10 p-6 text-center space-y-2">
          <FileText className="h-8 w-8 text-text-muted/40 mx-auto" />
          <p className="text-sm font-bold text-text-base">Sin tareas creadas</p>
          <p className="text-xs text-text-muted">
            Haz clic en "Nueva Tarea" para publicar la primera actividad.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {grupo.tareas.map((tarea: TareaGrupo) => {
            const seleccionada = tareaActivaId === tarea.id;
            const entregadas = tarea.entregas.length;
            const totalAlumnos = grupo.matriculas.length;

            return (
              <button
                key={tarea.id}
                type="button"
                onClick={() => onSeleccionarTarea(tarea.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  seleccionada
                    ? "bg-brand-primary/10 border-brand-primary shadow-md"
                    : "bg-bg-surface border-text-muted/10 hover:border-brand-primary/40"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                    {new Date(tarea.fecha_entrega).toLocaleDateString("es-PE", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold">
                    <Users className="h-3.5 w-3.5" />
                    {entregadas}/{totalAlumnos} entregas
                  </span>
                </div>
                <p className="font-extrabold text-sm text-text-base">
                  {tarea.nombre}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
