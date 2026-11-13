import { Loader2, Plus, X } from "lucide-react";
import type { GrupoProfesor } from "../types/profesorType";

interface ModalNuevaTareaProps {
  abierto: boolean;
  grupo?: GrupoProfesor;
  nombre: string;
  onChangeNombre: (valor: string) => void;
  fechaEntrega: string;
  onChangeFecha: (valor: string) => void;
  instrucciones: string;
  onChangeInstrucciones: (valor: string) => void;
  creando: boolean;
  onCerrar: () => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export function ModalNuevaTarea({
  abierto,
  grupo,
  nombre,
  onChangeNombre,
  fechaEntrega,
  onChangeFecha,
  instrucciones,
  onChangeInstrucciones,
  creando,
  onCerrar,
  onSubmit,
}: ModalNuevaTareaProps) {
  if (!abierto || !grupo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-bg-surface border border-text-muted/15 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-text-muted/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              {grupo.materia.nombre} • Grupo #{grupo.id}
            </span>
            <h3 className="text-xl font-extrabold text-text-base mt-0.5">
              Nueva Actividad
            </h3>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-base hover:bg-text-muted/10 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-text-muted">
              Título de la tarea
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => onChangeNombre(e.target.value)}
              placeholder="Ej. Tarea 3 - Derivadas parciales"
              className="w-full rounded-xl bg-bg-surface border border-text-muted/15 px-3.5 py-2.5 text-sm text-text-base focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-text-muted">
              Fecha límite de entrega
            </label>
            <input
              type="date"
              required
              value={fechaEntrega}
              onChange={(e) => onChangeFecha(e.target.value)}
              className="w-full rounded-xl bg-bg-surface border border-text-muted/15 px-3.5 py-2.5 text-sm text-text-base focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-text-muted">
              Instrucciones
            </label>
            <textarea
              rows={4}
              required
              value={instrucciones}
              onChange={(e) => onChangeInstrucciones(e.target.value)}
              placeholder="Describe los ejercicios, formato de entrega y criterios de evaluación..."
              className="w-full rounded-xl bg-bg-surface border border-text-muted/15 p-3 text-sm text-text-base focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-text-muted/10">
            <button
              type="button"
              onClick={onCerrar}
              disabled={creando}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text-base cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={creando}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {creando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Publicar Tarea
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
