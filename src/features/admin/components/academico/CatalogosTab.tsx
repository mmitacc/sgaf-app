import { useState } from "react";
import { Plus, Trash2, BookMarked, DoorOpen } from "lucide-react";
import { toast } from "sonner";
import { extraerMensajeError } from "@/services/errorHandle";
import { academicoService } from "../../services/academicoService";
import type { Materia, Aula } from "../../types/academicoType";

interface CatalogosTabProps {
  materias: Materia[];
  aulas: Aula[];
  onRecargar: () => void;
  onConfirmarEliminar: (titulo: string, fn: () => Promise<void>) => void;
}

export function CatalogosTab({
  materias,
  aulas,
  onRecargar,
  onConfirmarEliminar,
}: CatalogosTabProps) {
  const [matForm, setMatForm] = useState({
    nombre: "",
    creditos: 3,
    mensualidad: 150,
  });
  const [aulaForm, setAulaForm] = useState({ nombre: "", capacidad: 30 });
  const [guardandoMat, setGuardandoMat] = useState(false);
  const [guardandoAula, setGuardandoAula] = useState(false);

  const handleCrearMateria = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setGuardandoMat(true);
      await academicoService.crearMateria({
        nombre: matForm.nombre.trim(),
        creditos: Number(matForm.creditos),
        mensualidad: Number(matForm.mensualidad),
      });
      toast.success("Materia registrada correctamente.");
      setMatForm({ nombre: "", creditos: 3, mensualidad: 150 });
      onRecargar();
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "No se pudo registrar la materia."),
      );
    } finally {
      setGuardandoMat(false);
    }
  };

  const handleCrearAula = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setGuardandoAula(true);
      await academicoService.crearAula({
        nombre: aulaForm.nombre.trim(),
        capacidad: Number(aulaForm.capacidad),
      });
      toast.success("Aula registrada correctamente.");
      setAulaForm({ nombre: "", capacidad: 30 });
      onRecargar();
    } catch (error) {
      toast.error(extraerMensajeError(error, "No se pudo registrar el aula."));
    } finally {
      setGuardandoAula(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-text-muted/20 bg-bg-base px-3 py-2 text-sm text-text-base outline-none focus:border-brand-primary";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Panel Materias */}
      <div className="space-y-4 rounded-2xl border border-text-muted/15 bg-bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BookMarked className="h-5 w-5 text-brand-primary" />
          <h2 className="text-base font-bold text-text-base">
            Catálogo de Materias
          </h2>
        </div>

        <form
          onSubmit={handleCrearMateria}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-4"
        >
          <input
            type="text"
            required
            placeholder="Nombre de materia"
            value={matForm.nombre}
            onChange={(e) => setMatForm({ ...matForm, nombre: e.target.value })}
            className={`${inputClass} sm:col-span-2`}
          />
          <input
            type="number"
            min={1}
            required
            placeholder="Créditos"
            value={matForm.creditos}
            onChange={(e) =>
              setMatForm({ ...matForm, creditos: Number(e.target.value) })
            }
            className={inputClass}
          />
          <button
            type="submit"
            disabled={guardandoMat}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-brand-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Crear
          </button>
        </form>

        <div className="divide-y divide-text-muted/10 border-t border-text-muted/10">
          {materias.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              <div>
                <p className="font-semibold text-text-base">{m.nombre}</p>
                <p className="text-xs text-text-muted">
                  {m.creditos} créditos • Mensualidad: S/{" "}
                  {Number(m.mensualidad).toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onConfirmarEliminar(`la materia ${m.nombre}`, () =>
                    academicoService.eliminarMateria(m.id),
                  )
                }
                className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-red-500/15 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Panel Aulas */}
      <div className="space-y-4 rounded-2xl border border-text-muted/15 bg-bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <DoorOpen className="h-5 w-5 text-brand-primary" />
          <h2 className="text-base font-bold text-text-base">
            Aulas y Laboratorios
          </h2>
        </div>

        <form
          onSubmit={handleCrearAula}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-4"
        >
          <input
            type="text"
            required
            placeholder="Ej. Lab. Cómputo 1"
            value={aulaForm.nombre}
            onChange={(e) =>
              setAulaForm({ ...aulaForm, nombre: e.target.value })
            }
            className={`${inputClass} sm:col-span-2`}
          />
          <input
            type="number"
            min={1}
            required
            placeholder="Aforo"
            value={aulaForm.capacidad}
            onChange={(e) =>
              setAulaForm({ ...aulaForm, capacidad: Number(e.target.value) })
            }
            className={inputClass}
          />
          <button
            type="submit"
            disabled={guardandoAula}
            className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-brand-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Crear
          </button>
        </form>

        <div className="divide-y divide-text-muted/10 border-t border-text-muted/10">
          {aulas.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              <div>
                <p className="font-semibold text-text-base">{a.nombre}</p>
                <p className="text-xs text-text-muted">
                  Capacidad máxima: {a.capacidad} alumnos
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onConfirmarEliminar(`el aula ${a.nombre}`, () =>
                    academicoService.eliminarAula(a.id),
                  )
                }
                className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:bg-red-500/15 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
