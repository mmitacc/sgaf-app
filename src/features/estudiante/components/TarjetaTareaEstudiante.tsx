import { Calendar, CheckCircle2, Clock, Paperclip } from "lucide-react";
import type { TareaConEntrega } from "../types/matriculaType";

interface TarjetaTareaEstudianteProps {
  tarea: TareaConEntrega;
  onAbrirModal: (tarea: TareaConEntrega) => void;
}

export function TarjetaTareaEstudiante({
  tarea,
  onAbrirModal,
}: TarjetaTareaEstudianteProps) {
  const entrega = tarea.entregas?.[0];
  const calificada =
    entrega?.calificacion !== null && entrega?.calificacion !== undefined;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
            <Calendar className="h-3.5 w-3.5 text-brand-primary" />
            Entrega:{" "}
            <strong className="text-text-base">
              {new Date(tarea.fecha_entrega).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </span>

          {calificada ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              Nota: {entrega.calificacion} / 20
            </span>
          ) : entrega ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Entregado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
              <Clock className="h-3.5 w-3.5" />
              Pendiente
            </span>
          )}
        </div>

        <h4 className="text-lg font-extrabold text-text-base">
          {tarea.nombre}
        </h4>

        <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
          {tarea.instrucciones || "Sin instrucciones adicionales."}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-text-muted/10 flex items-center justify-between gap-3">
        {entrega?.archivo_url ? (
          <a
            href={entrega.archivo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:underline"
          >
            <Paperclip className="h-3.5 w-3.5" />
            Ver archivo enviado
          </a>
        ) : (
          <span className="text-xs text-text-muted">Sin archivo adjunto</span>
        )}

        <button
          type="button"
          onClick={() => onAbrirModal(tarea)}
          className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
        >
          {calificada
            ? "Ver detalle"
            : entrega
              ? "Editar entrega"
              : "Entregar tarea"}
        </button>
      </div>
    </div>
  );
}
