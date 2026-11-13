import { CheckCircle2, Search } from "lucide-react";
import type { GrupoProfesor } from "../types/profesorType";
import type { AlumnoConPromedio } from "../hooks/useGruposProfesor";

interface TablaNominaGrupoProps {
  grupo: GrupoProfesor;
  busqueda: string;
  onChangeBusqueda: (valor: string) => void;
  alumnos: AlumnoConPromedio[];
}

export function TablaNominaGrupo({
  grupo,
  busqueda,
  onChangeBusqueda,
  alumnos,
}: TablaNominaGrupoProps) {
  return (
    <div className="rounded-2xl bg-bg-surface border border-text-muted/10 overflow-hidden">
      <div className="p-5 border-b border-text-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-text-base">
            Estudiantes en {grupo.materia.nombre} (Grupo #{grupo.id})
          </h2>
          <p className="text-xs text-text-muted">
            Listado oficial de alumnos matriculados y progreso de evaluaciones.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onChangeBusqueda(e.target.value)}
            placeholder="Buscar estudiante..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-bg-surface border border-text-muted/15 text-text-base focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>

      {alumnos.length === 0 ? (
        <div className="p-10 text-center text-sm text-text-muted">
          No hay estudiantes matriculados que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-text-muted/10 text-xs uppercase text-text-muted bg-black/5 dark:bg-white/5">
                <th className="py-3.5 px-5">Estudiante</th>
                <th className="py-3.5 px-5 text-center">Tareas Entregadas</th>
                <th className="py-3.5 px-5 text-center">Promedio Actual</th>
                <th className="py-3.5 px-5 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-muted/10 text-sm">
              {alumnos.map((item) => {
                const aprobado =
                  item.promedio !== null && Number(item.promedio) >= 11;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-text-base">
                        {item.estudiante.usuario.apellidos},{" "}
                        {item.estudiante.usuario.nombres}
                      </p>
                      {item.estudiante.usuario.correo && (
                        <span className="text-xs text-text-muted">
                          {item.estudiante.usuario.correo}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-base">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" />
                        {item.entregasRealizadas} / {item.totalTareas}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center font-extrabold text-text-base">
                      {item.promedio !== null ? item.promedio : "—"}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {item.promedio === null ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-500">
                          En curso
                        </span>
                      ) : (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            aprobado
                              ? "bg-emerald-500/15 text-emerald-500"
                              : "bg-rose-500/15 text-rose-500"
                          }`}
                        >
                          {aprobado ? "Aprobado" : "En riesgo"}
                        </span>
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
  );
}
