import { BookOpen } from "lucide-react";
import type { MatriculaConDetalle } from "../types/matriculaType";

interface SelectorCursosAulaProps {
  matriculas: MatriculaConDetalle[];
  grupoActivoId?: number;
  onSeleccionarGrupo: (grupoId: number) => void;
}

export function SelectorCursosAula({
  matriculas,
  grupoActivoId,
  onSeleccionarGrupo,
}: SelectorCursosAulaProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      {matriculas.map((m) => {
        const activo = grupoActivoId === m.grupo.id;
        const pendientes = m.grupo.tareas.filter(
          (t) => !t.entregas || t.entregas.length === 0,
        ).length;

        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSeleccionarGrupo(m.grupo.id)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
              activo
                ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-blue-500/20"
                : "bg-bg-surface text-text-base border-text-muted/10 hover:border-brand-primary/50"
            }`}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            <span>{m.grupo.materia.nombre}</span>
            {pendientes > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  activo
                    ? "bg-white text-brand-primary"
                    : "bg-amber-500/15 text-amber-500"
                }`}
              >
                {pendientes}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
