import { Calendar, Pencil, Trash2 } from "lucide-react";
import type { Periodo } from "../../types/academicoType";

interface PeriodosTabProps {
  periodos: Periodo[];
  onEditar: (periodo: Periodo) => void;
  onEliminar: (periodo: Periodo) => void;
}

export function PeriodosTab({
  periodos,
  onEditar,
  onEliminar,
}: PeriodosTabProps) {
  if (periodos.length === 0) {
    return (
      <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-12 text-center text-sm text-text-muted">
        No hay periodos académicos registrados.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {periodos.map((p) => (
        <div
          key={p.id}
          className="flex flex-col justify-between rounded-2xl border border-text-muted/15 bg-bg-surface p-5 shadow-sm transition-all hover:border-brand-primary/40"
        >
          <div>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-brand-primary/15 p-2.5 text-brand-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text-base">{p.nombre}</h3>
                  <p className="text-xs text-text-muted">
                    Duración: {p.meses} meses
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-text-muted/10 pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Inicio / Fin:</span>
                <span className="font-semibold text-text-base">
                  {p.inicio.slice(0, 10)} → {p.fin.slice(0, 10)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Máx. créditos:</span>
                <span className="font-semibold text-text-base">
                  {p.max_creditos} créd.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Costo Matrícula:</span>
                <span className="font-bold text-brand-primary">
                  S/ {Number(p.matricula).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2 border-t border-text-muted/10 pt-3">
            <button
              type="button"
              onClick={() => onEditar(p)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-text-muted/20 px-3 py-1.5 text-xs font-medium text-text-base transition hover:border-brand-primary hover:text-brand-primary"
            >
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
            <button
              type="button"
              onClick={() => onEliminar(p)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-500/20 dark:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" /> Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
