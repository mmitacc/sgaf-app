import { useState, useEffect } from "react";
import { X, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { academicoService } from "../../services/academicoService";
import { extraerMensajeError } from "@/services/errorHandle";
import type { Periodo } from "../../types/academicoType";

interface ModalPeriodoProps {
  abierto: boolean;
  periodo: Periodo | null;
  onClose: () => void;
  onGuardado: () => void;
}

export function ModalPeriodo({
  abierto,
  periodo,
  onClose,
  onGuardado,
}: ModalPeriodoProps) {
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    meses: 3,
    inicio: "",
    fin: "",
    max_creditos: 20,
    matricula: 100,
  });
  useEffect(() => {
    if (!abierto) return;
    if (periodo) {
      setForm({
        nombre: periodo.nombre,
        meses: periodo.meses,
        inicio: periodo.inicio.slice(0, 10),
        fin: periodo.fin.slice(0, 10),
        max_creditos: periodo.max_creditos,
        matricula: Number(periodo.matricula),
      });
    } else {
      setForm({
        nombre: "",
        meses: 3,
        inicio: "",
        fin: "",
        max_creditos: 20,
        matricula: 100,
      });
    }
  }, [abierto, periodo]);

  if (!abierto) return null;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setGuardando(true);
      const payload = {
        nombre: form.nombre.trim(),
        meses: Number(form.meses),
        inicio: form.inicio,
        fin: form.fin,
        max_creditos: Number(form.max_creditos),
        matricula: Number(form.matricula),
      };
      if (periodo) {
        await academicoService.actualizarPeriodo(periodo.id, payload);
        toast.success("Periodo actualizado correctamente.");
      } else {
        await academicoService.crearPeriodo(payload);
        toast.success("Periodo académico creado.");
      }
      onGuardado();
      onClose();
    } catch (error) {
      toast.error(extraerMensajeError(error, "No se pudo guardar el periodo."));
    } finally {
      setGuardando(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-text-muted/20 bg-bg-base px-3.5 py-2 text-sm text-text-base outline-none focus:border-brand-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-text-muted/15 bg-bg-surface p-6 text-text-base shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-text-muted/10 pb-3">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Calendar className="h-5 w-5 text-brand-primary" />
            {periodo ? "Editar Periodo Académico" : "Nuevo Periodo Académico"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-text-muted hover:text-text-base"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-text-muted">
              Nombre (mín. 8 caracteres)
            </label>
            <input
              type="text"
              required
              minLength={8}
              maxLength={100}
              placeholder="Ej. Periodo Regular III - 2026"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-text-muted">
                Fecha Inicio
              </label>
              <input
                type="date"
                required
                value={form.inicio}
                onChange={(e) => setForm({ ...form, inicio: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-text-muted">
                Fecha Fin
              </label>
              <input
                type="date"
                required
                value={form.fin}
                onChange={(e) => setForm({ ...form, fin: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-text-muted">
                Meses
              </label>
              <input
                type="number"
                min={1}
                required
                value={form.meses}
                onChange={(e) =>
                  setForm({ ...form, meses: Number(e.target.value) })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-text-muted">
                Máx. Créditos
              </label>
              <input
                type="number"
                min={1}
                required
                value={form.max_creditos}
                onChange={(e) =>
                  setForm({ ...form, max_creditos: Number(e.target.value) })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-text-muted">
                Matrícula (S/)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                required
                value={form.matricula}
                onChange={(e) =>
                  setForm({ ...form, matricula: Number(e.target.value) })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-text-muted/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-text-muted/20 px-4 py-2 text-sm text-text-muted hover:text-text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-brand-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {guardando && <Loader2 className="h-4 w-4 animate-spin" />}
              {periodo ? "Guardar Cambios" : "Crear Periodo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
