import { Search, Pencil, Trash2, Clock, Users } from "lucide-react";
import type { Grupo, Periodo } from "../../types/academicoType";

interface GruposTabProps {
  grupos: Grupo[];
  periodos: Periodo[];
  filtroPeriodo: number | "TODOS";
  setFiltroPeriodo: (id: number | "TODOS") => void;
  busqueda: string;
  setBusqueda: (val: string) => void;
  onEditar: (grupo: Grupo) => void;
  onEliminar: (grupo: Grupo) => void;
}

const formatearHora = (hora: string) => {
  if (!hora) return "--:--";
  return hora.includes("T") ? hora.slice(11, 16) : hora.slice(0, 5);
};

export function GruposTab({
  grupos,
  periodos,
  filtroPeriodo,
  setFiltroPeriodo,
  busqueda,
  setBusqueda,
  onEditar,
  onEliminar,
}: GruposTabProps) {
  return (
    <div className="space-y-4">
      {/* Barra de filtros */}
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-text-muted/15 bg-bg-surface p-4 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por materia, docente o aula..."
            className="w-full rounded-xl border border-text-muted/20 bg-bg-base py-2 pr-4 pl-10 text-sm text-text-base outline-none focus:border-brand-primary"
          />
        </div>

        <select
          value={filtroPeriodo}
          onChange={(e) =>
            setFiltroPeriodo(
              e.target.value === "TODOS" ? "TODOS" : Number(e.target.value),
            )
          }
          className="rounded-xl border border-text-muted/20 bg-bg-base px-3.5 py-2 text-sm text-text-base outline-none focus:border-brand-primary"
        >
          <option value="TODOS">Todos los periodos</option>
          {periodos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Grupos */}
      <div className="overflow-hidden rounded-2xl border border-text-muted/15 bg-bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-text-muted/15 bg-bg-base/60 text-xs uppercase text-text-muted">
                <th className="px-5 py-3.5 font-semibold">Materia / Periodo</th>
                <th className="px-5 py-3.5 font-semibold">Docente</th>
                <th className="px-5 py-3.5 font-semibold">Aula y Cupos</th>
                <th className="px-5 py-3.5 font-semibold">Horarios</th>
                <th className="px-5 py-3.5 text-right font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-muted/10">
              {grupos.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-xs text-text-muted"
                  >
                    No se encontraron grupos académicos registrados.
                  </td>
                </tr>
              ) : (
                grupos.map((g) => {
                  const docente = `${
                    g.profesor?.nombres ?? g.profesor?.usuario?.nombres ?? "Sin"
                  } ${
                    g.profesor?.apellidos ??
                    g.profesor?.usuario?.apellidos ??
                    "asignar"
                  }`;
                  const inscritos = g._count?.matriculas ?? 0;

                  return (
                    <tr
                      key={g.id}
                      className="transition-colors hover:bg-text-muted/5"
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-text-base">
                          {g.materia?.nombre ?? `Materia #${g.id_materia}`}
                        </p>
                        <p className="text-xs text-text-muted">
                          {g.periodo?.nombre ?? `Periodo #${g.id_periodo}`} •{" "}
                          {g.materia?.creditos ?? 0} créd.
                        </p>
                      </td>

                      <td className="px-5 py-3.5 font-medium text-text-base">
                        {docente}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="block font-medium text-text-base">
                          {g.aula?.nombre ?? `Aula #${g.id_aula}`}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                          <Users className="h-3.5 w-3.5 text-brand-primary" />
                          {inscritos} / {g.capacidad} cupos
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        {g.horarios && g.horarios.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {g.horarios.map((h, idx) => (
                              <span
                                key={h.id ?? idx}
                                className="inline-flex items-center gap-1 rounded-lg bg-brand-primary/15 px-2 py-0.5 text-xs font-medium text-brand-primary"
                              >
                                <Clock className="h-3 w-3" />
                                {h.dia.slice(0, 3)}{" "}
                                {formatearHora(h.hora_inicio)}-
                                {formatearHora(h.hora_fin)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-text-muted">
                            Sin horario
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditar(g)}
                            className="cursor-pointer rounded-lg p-2 text-text-muted transition hover:bg-brand-primary/15 hover:text-brand-primary"
                            title="Editar grupo"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEliminar(g)}
                            className="cursor-pointer rounded-lg p-2 text-text-muted transition hover:bg-red-500/15 hover:text-red-500"
                            title="Eliminar grupo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
