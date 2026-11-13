import { MapPin } from "lucide-react";
import type { GrupoProfesor } from "../types/profesorType";

interface SelectorGruposProfesorProps {
  grupos: GrupoProfesor[];
  grupoActivoId?: number;
  onSeleccionarGrupo: (id: number) => void;
}

export function SelectorGruposProfesor({
  grupos,
  grupoActivoId,
  onSeleccionarGrupo,
}: SelectorGruposProfesorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {grupos.map((g) => {
        const activo = grupoActivoId === g.id;
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onSeleccionarGrupo(g.id)}
            className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
              activo
                ? "bg-brand-primary/10 border-brand-primary shadow-lg shadow-blue-500/10"
                : "bg-bg-surface border-text-muted/10 hover:border-brand-primary/40"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-primary/15 text-brand-primary">
                Grupo #{g.id}
              </span>
              <span className="text-xs font-semibold text-text-muted">
                {g.matriculas.length} / {g.capacidad} alumnos
              </span>
            </div>
            <h3 className="text-base font-extrabold text-text-base">
              {g.materia.nombre}
            </h3>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-primary" />
              {g.aula.nombre} • {g.periodo.nombre}
            </p>
          </button>
        );
      })}
    </div>
  );
}
