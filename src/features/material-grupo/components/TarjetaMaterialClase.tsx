import { ExternalLink, FileText, Link2, Trash2, Video } from "lucide-react";
import type { MaterialGrupo } from "../types/materialType";

interface Props {
  material: MaterialGrupo;
  onEliminar?: (id: number) => void;
}

export function TarjetaMaterialClase({ material, onEliminar }: Props) {
  const Icono =
    material.tipo === "VIDEO"
      ? Video
      : material.tipo === "ARCHIVO"
        ? FileText
        : Link2;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-bg-surface p-5 border border-text-muted/10 transition-all hover:-translate-y-0.5 hover:border-brand-primary/50">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-primary/15 text-brand-primary">
            <Icono className="h-3.5 w-3.5" />
            {material.tipo}
          </span>
          <span className="text-[11px] text-text-muted">
            {new Date(material.created).toLocaleDateString("es-PE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <h4 className="text-base font-extrabold text-text-base">
          {material.titulo}
        </h4>

        {material.descripcion && (
          <p className="text-xs text-text-muted leading-relaxed">
            {material.descripcion}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-text-muted/10 flex items-center justify-between">
        <a
          href={material.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:underline"
        >
          Abrir recurso <ExternalLink className="h-3.5 w-3.5" />
        </a>

        {onEliminar && (
          <button
            type="button"
            onClick={() => onEliminar(material.id)}
            title="Eliminar publicación"
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
