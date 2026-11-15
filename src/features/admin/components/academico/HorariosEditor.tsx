import { Plus, Trash2, Clock } from "lucide-react";
import type { DiaSemana, Horario } from "../../types/academicoType";

const DIAS: DiaSemana[] = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
];

interface HorariosEditorProps {
  horarios: Horario[];
  onChange: (nuevos: Horario[]) => void;
}

export function HorariosEditor({ horarios, onChange }: HorariosEditorProps) {
  const agregarBloque = () => {
    onChange([
      ...horarios,
      { dia: "LUNES", hora_inicio: "08:00", hora_fin: "10:00" },
    ]);
  };

  const actualizarBloque = (
    index: number,
    campo: keyof Horario,
    valor: string,
  ) => {
    const copia = horarios.map((h, i) =>
      i === index ? { ...h, [campo]: valor } : h,
    );
    onChange(copia);
  };

  const eliminarBloque = (index: number) => {
    onChange(horarios.filter((_, i) => i !== index));
  };

  const controlClass =
    "rounded-xl border border-text-muted/20 bg-bg-base px-2.5 py-1.5 text-xs text-text-base outline-none focus:border-brand-primary";

  return (
    <div className="space-y-2.5 rounded-xl border border-text-muted/15 bg-bg-base/50 p-3.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-text-muted">
          <Clock className="h-3.5 w-3.5 text-brand-primary" />
          Horarios de Clase ({horarios.length})
        </span>
        <button
          type="button"
          onClick={agregarBloque}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-brand-primary/15 px-2.5 py-1 text-xs font-semibold text-brand-primary hover:bg-brand-primary/25"
        >
          <Plus className="h-3.5 w-3.5" /> Añadir bloque
        </button>
      </div>

      {horarios.length === 0 ? (
        <p className="text-xs text-text-muted">
          Sin bloques horarios asignados aún.
        </p>
      ) : (
        <div className="space-y-2">
          {horarios.map((h, idx) => (
            <div
              key={h.id ?? idx}
              className="flex flex-wrap items-center gap-2"
            >
              <select
                value={h.dia}
                onChange={(e) => actualizarBloque(idx, "dia", e.target.value)}
                className={controlClass}
              >
                {DIAS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <input
                type="time"
                required
                value={h.hora_inicio.slice(0, 5)}
                onChange={(e) =>
                  actualizarBloque(idx, "hora_inicio", e.target.value)
                }
                className={controlClass}
              />

              <span className="text-xs text-text-muted">a</span>

              <input
                type="time"
                required
                value={h.hora_fin.slice(0, 5)}
                onChange={(e) =>
                  actualizarBloque(idx, "hora_fin", e.target.value)
                }
                className={controlClass}
              />

              <button
                type="button"
                onClick={() => eliminarBloque(idx)}
                className="ml-auto cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-red-500/15 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
