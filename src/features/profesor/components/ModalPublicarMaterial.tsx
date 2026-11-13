import { Loader2, Plus, Upload, X } from "lucide-react";
import type { TipoMaterial } from "@/features/material-grupo/types/materialType";

interface Props {
  abierto: boolean;
  materiaNombre?: string;
  grupoId?: number;
  titulo: string;
  onChangeTitulo: (v: string) => void;
  descripcion: string;
  onChangeDescripcion: (v: string) => void;
  tipo: TipoMaterial;
  onChangeTipo: (v: TipoMaterial) => void;
  url: string;
  onChangeUrl: (v: string) => void;
  archivo: File | null;
  onChangeArchivo: (f: File | null) => void;
  guardando: boolean;
  onCerrar: () => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export function ModalPublicarMaterial(props: Props) {
  if (!props.abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-bg-surface border border-text-muted/15 shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between p-6 border-b border-text-muted/10">
          <div>
            {props.materiaNombre && (
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                Grupo #{props.grupoId} • {props.materiaNombre}
              </span>
            )}
            <h3 className="text-xl font-extrabold text-text-base mt-0.5">
              {props.materiaNombre
                ? `Material de Clase para ${props.materiaNombre}`
                : "Publicar Material de Clase"}
            </h3>
          </div>
          <button
            type="button"
            onClick={props.onCerrar}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-base cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={props.onSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-text-muted">
              Tipo de Recurso
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["VIDEO", "ARCHIVO", "ENLACE"] as TipoMaterial[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => props.onChangeTipo(t)}
                  className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    props.tipo === t
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-bg-surface text-text-muted border-text-muted/15"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-text-muted">
              Título del tema
            </label>
            <input
              type="text"
              required
              value={props.titulo}
              onChange={(e) => props.onChangeTitulo(e.target.value)}
              placeholder="Ej. Semana 4 - Grabación y Diapositivas"
              className="w-full rounded-xl bg-bg-surface border border-text-muted/15 px-3.5 py-2.5 text-sm text-text-base focus:outline-none focus:border-brand-primary"
            />
          </div>

          {props.tipo === "ARCHIVO" ? (
            <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-text-muted/20 hover:border-brand-primary cursor-pointer text-xs font-semibold text-text-base">
              <Upload className="h-4 w-4 text-brand-primary" />
              <span>
                {props.archivo
                  ? props.archivo.name
                  : "Seleccionar PDF, PPTX o ZIP"}
              </span>
              <input
                type="file"
                onChange={(e) =>
                  props.onChangeArchivo(e.target.files?.[0] || null)
                }
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-text-muted">
                Enlace (YouTube, Drive, Meet, etc.)
              </label>
              <input
                type="url"
                required
                value={props.url}
                onChange={(e) => props.onChangeUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl bg-bg-surface border border-text-muted/15 px-3.5 py-2.5 text-sm text-text-base focus:outline-none focus:border-brand-primary"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-text-muted">
              Descripción breve (Opcional)
            </label>
            <textarea
              rows={3}
              value={props.descripcion}
              onChange={(e) => props.onChangeDescripcion(e.target.value)}
              placeholder="Resumen de los temas tratados en clase..."
              className="w-full rounded-xl bg-bg-surface border border-text-muted/15 p-3 text-sm text-text-base focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-text-muted/10">
            <button
              type="button"
              onClick={props.onCerrar}
              className="px-4 py-2 text-xs font-bold text-text-muted cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={props.guardando}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {props.guardando ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
