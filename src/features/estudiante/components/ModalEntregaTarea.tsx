import { ExternalLink, Loader2, Send, Upload, X } from "lucide-react";
import type { TareaConEntrega } from "../types/matriculaType";

interface ModalEntregaTareaProps {
  tarea: TareaConEntrega | null;
  respuestaTexto: string;
  onChangeRespuesta: (valor: string) => void;
  archivoSeleccionado: File | null;
  onChangeArchivo: (archivo: File | null) => void;
  archivoUrlActual: string;
  enviando: boolean;
  onCerrar: () => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}

export function ModalEntregaTarea({
  tarea,
  respuestaTexto,
  onChangeRespuesta,
  archivoSeleccionado,
  onChangeArchivo,
  archivoUrlActual,
  enviando,
  onCerrar,
  onSubmit,
}: ModalEntregaTareaProps) {
  if (!tarea) return null;

  const entregaModal = tarea.entregas?.[0];
  const yaCalificadaModal =
    entregaModal?.calificacion !== null &&
    entregaModal?.calificacion !== undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-bg-surface border border-text-muted/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between p-6 border-b border-text-muted/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
              Detalle de Actividad
            </span>
            <h3 className="text-xl font-extrabold text-text-base mt-0.5">
              {tarea.nombre}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-base hover:bg-text-muted/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="rounded-xl bg-black/5 dark:bg-white/5 p-4 space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Instrucciones del docente
            </p>
            <p className="text-sm text-text-base whitespace-pre-line leading-relaxed">
              {tarea.instrucciones}
            </p>
          </div>

          {yaCalificadaModal && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-500">
                Esta tarea ya fue calificada y no admite cambios.
              </span>
              <span className="text-base font-extrabold text-emerald-500">
                Nota: {entregaModal?.calificacion} / 20
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Respuesta o comentarios
            </label>
            <textarea
              rows={4}
              disabled={yaCalificadaModal || enviando}
              value={respuestaTexto}
              onChange={(e) => onChangeRespuesta(e.target.value)}
              placeholder="Escribe aquí tu respuesta, enlace o comentarios para el profesor..."
              className="w-full rounded-xl bg-bg-surface border border-text-muted/15 p-3 text-sm text-text-base focus:outline-none focus:border-brand-primary disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Archivo adjunto (PDF, Word, ZIP, Imagen - Máx. 10MB)
            </label>

            {archivoUrlActual && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/25 text-xs">
                <span className="font-semibold text-text-base truncate max-w-[70%]">
                  Archivo actual cargado en nube
                </span>
                <a
                  href={archivoUrlActual}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-brand-primary hover:underline"
                >
                  Abrir archivo <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            {!yaCalificadaModal && (
              <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-text-muted/20 hover:border-brand-primary/60 transition-colors cursor-pointer bg-black/5 dark:bg-white/5">
                <Upload className="h-5 w-5 text-brand-primary" />
                <span className="text-xs font-medium text-text-base text-center">
                  {archivoSeleccionado
                    ? `Seleccionado: ${archivoSeleccionado.name}`
                    : archivoUrlActual
                      ? "Haz clic para reemplazar el archivo actual"
                      : "Haz clic para seleccionar un archivo de tu equipo"}
                </span>
                <input
                  type="file"
                  disabled={enviando}
                  onChange={(e) => onChangeArchivo(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-text-muted/10">
            <button
              type="button"
              onClick={onCerrar}
              disabled={enviando}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text-base transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            {!yaCalificadaModal && (
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {enviando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subiendo entrega...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {entregaModal ? "Actualizar entrega" : "Enviar entrega"}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
