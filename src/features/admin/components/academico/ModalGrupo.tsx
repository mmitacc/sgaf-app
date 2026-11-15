import { useState, useEffect } from "react";
import { X, Loader2, BookOpen, Plus } from "lucide-react";
import { toast } from "sonner";
import { academicoService } from "../../services/academicoService";
import { extraerMensajeError } from "@/services/errorHandle";
import { HorariosEditor } from "./HorariosEditor";
import type {
  Grupo,
  Periodo,
  Materia,
  Aula,
  ProfesorItem,
  Horario,
} from "../../types/academicoType";

interface ModalGrupoProps {
  abierto: boolean;
  grupo: Grupo | null;
  periodos: Periodo[];
  materias: Materia[];
  aulas: Aula[];
  profesores: ProfesorItem[];
  onClose: () => void;
  onGuardado: () => void;
}

const fmtHora = (h: string) =>
  h.includes("T") ? h.slice(11, 16) : h.slice(0, 5);

export function ModalGrupo({
  abierto,
  grupo,
  periodos,
  materias,
  aulas,
  profesores,
  onClose,
  onGuardado,
}: ModalGrupoProps) {
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    id_periodo: 0,
    id_materia: 0,
    id_aula: 0,
    id_profesor: 0,
    capacidad: 30,
  });
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [quickTipo, setQuickTipo] = useState<"MATERIA" | "AULA" | null>(null);
  const [quickNombre, setQuickNombre] = useState("");
  const [quickExtra, setQuickExtra] = useState(3);

  useEffect(() => {
    if (!abierto) return;
    setQuickTipo(null);
    if (grupo) {
      setForm({
        id_periodo: grupo.id_periodo,
        id_materia: grupo.id_materia,
        id_aula: grupo.id_aula,
        id_profesor: grupo.id_profesor,
        capacidad: grupo.capacidad,
      });
      setHorarios(
        (grupo.horarios ?? []).map((h) => ({
          id: h.id,
          dia: h.dia,
          hora_inicio: fmtHora(h.hora_inicio),
          hora_fin: fmtHora(h.hora_fin),
        })),
      );
    } else {
      const aulaDefault = aulas[0];
      setForm({
        id_periodo: periodos[0]?.id ?? 0,
        id_materia: materias[0]?.id ?? 0,
        id_aula: aulaDefault?.id ?? 0,
        id_profesor: profesores[0]?.id_usuario ?? 0,
        capacidad: aulaDefault?.capacidad ?? 30,
      });
      setHorarios([]);
    }
  }, [abierto, grupo, periodos, materias, aulas, profesores]);

  if (!abierto) return null;

  const handleQuickCreate = async () => {
    if (!quickNombre.trim()) return;
    try {
      if (quickTipo === "MATERIA") {
        const nueva = await academicoService.crearMateria({
          nombre: quickNombre.trim(),
          creditos: Number(quickExtra) || 3,
          mensualidad: 150,
        });
        setForm((p) => ({ ...p, id_materia: nueva.id }));
        toast.success(`Materia "${nueva.nombre}" creada.`);
      } else if (quickTipo === "AULA") {
        const nueva = await academicoService.crearAula({
          nombre: quickNombre.trim(),
          capacidad: Number(quickExtra) || 30,
        });
        setForm((p) => ({
          ...p,
          id_aula: nueva.id,
          capacidad: nueva.capacidad,
        }));
        toast.success(`Aula "${nueva.nombre}" creada.`);
      }
      setQuickTipo(null);
      setQuickNombre("");
      onGuardado();
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "No se pudo crear el registro rápido."),
      );
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setGuardando(true);
      const payload = {
        capacidad: Number(form.capacidad),
        id_profesor: Number(form.id_profesor),
        id_aula: Number(form.id_aula),
        id_materia: Number(form.id_materia),
        id_periodo: Number(form.id_periodo),
      };

      const grupoGuardado = grupo
        ? await academicoService.actualizarGrupo(grupo.id, payload)
        : await academicoService.crearGrupo(payload);

      if (grupo?.horarios?.length) {
        const idsActuales = new Set(horarios.map((h) => h.id).filter(Boolean));
        const eliminados = grupo.horarios.filter(
          (h) => h.id && !idsActuales.has(h.id),
        );
        await Promise.all(
          eliminados.map((h) => academicoService.eliminarHorario(h.id!)),
        );
      }

      const nuevosBloques = horarios.filter((h) => !h.id);
      await Promise.all(
        nuevosBloques.map((h) =>
          academicoService.crearHorario({
            dia: h.dia,
            hora_inicio: fmtHora(h.hora_inicio),
            hora_fin: fmtHora(h.hora_fin),
            id_grupo: grupoGuardado.id,
          }),
        ),
      );

      toast.success(
        grupo ? "Grupo actualizado." : "Grupo creado correctamente.",
      );
      onGuardado();
      onClose();
    } catch (error) {
      toast.error(extraerMensajeError(error, "Error al guardar el grupo."));
    } finally {
      setGuardando(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-text-muted/20 bg-bg-base px-3.5 py-2 text-sm text-text-base outline-none focus:border-brand-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-text-muted/15 bg-bg-surface p-6 text-text-base shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-text-muted/10 pb-3">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <BookOpen className="h-5 w-5 text-brand-primary" />
            {grupo ? `Editar Grupo #${grupo.id}` : "Nuevo Grupo Académico"}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-text-muted">
                Periodo
              </label>
              <select
                required
                value={form.id_periodo}
                onChange={(e) =>
                  setForm({ ...form, id_periodo: Number(e.target.value) })
                }
                className={inputClass}
              >
                {periodos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase text-text-muted">
                Profesor
              </label>
              <select
                required
                value={form.id_profesor}
                onChange={(e) =>
                  setForm({ ...form, id_profesor: Number(e.target.value) })
                }
                className={inputClass}
              >
                {profesores.map((pr) => (
                  <option key={pr.id_usuario} value={pr.id_usuario}>
                    {pr.nombres} {pr.apellidos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-text-muted">
                  Materia
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setQuickTipo("MATERIA");
                    setQuickExtra(3);
                  }}
                  className="inline-flex cursor-pointer items-center gap-0.5 text-xs font-semibold text-brand-primary hover:underline"
                >
                  <Plus className="h-3 w-3" /> Nueva
                </button>
              </div>
              <select
                required
                value={form.id_materia}
                onChange={(e) =>
                  setForm({ ...form, id_materia: Number(e.target.value) })
                }
                className={inputClass}
              >
                {materias.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} ({m.creditos} cr.)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-text-muted">
                  Aula
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setQuickTipo("AULA");
                    setQuickExtra(30);
                  }}
                  className="inline-flex cursor-pointer items-center gap-0.5 text-xs font-semibold text-brand-primary hover:underline"
                >
                  <Plus className="h-3 w-3" /> Nueva
                </button>
              </div>
              <select
                required
                value={form.id_aula}
                onChange={(e) => {
                  const idAula = Number(e.target.value);
                  const aulaSel = aulas.find((a) => a.id === idAula);
                  setForm({
                    ...form,
                    id_aula: idAula,
                    capacidad: aulaSel?.capacidad ?? form.capacidad,
                  });
                }}
                className={inputClass}
              >
                {aulas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre} (Aforo {a.capacidad})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {quickTipo && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-brand-primary/30 bg-brand-primary/10 p-3">
              <input
                type="text"
                placeholder={
                  quickTipo === "MATERIA" ? "Nombre materia" : "Nombre aula"
                }
                value={quickNombre}
                onChange={(e) => setQuickNombre(e.target.value)}
                className="flex-1 rounded-lg border border-text-muted/20 bg-bg-base px-2.5 py-1.5 text-xs text-text-base"
              />
              <input
                type="number"
                min={1}
                placeholder={quickTipo === "MATERIA" ? "Créd." : "Aforo"}
                value={quickExtra}
                onChange={(e) => setQuickExtra(Number(e.target.value))}
                className="w-20 rounded-lg border border-text-muted/20 bg-bg-base px-2.5 py-1.5 text-xs text-text-base"
              />
              <button
                type="button"
                onClick={handleQuickCreate}
                className="cursor-pointer rounded-lg bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white"
              >
                Crear
              </button>
              <button
                type="button"
                onClick={() => setQuickTipo(null)}
                className="cursor-pointer text-xs text-text-muted"
              >
                Cancelar
              </button>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-text-muted">
              Capacidad del Grupo (Cupos)
            </label>
            <input
              type="number"
              min={1}
              required
              value={form.capacidad}
              onChange={(e) =>
                setForm({ ...form, capacidad: Number(e.target.value) })
              }
              className={inputClass}
            />
          </div>

          <HorariosEditor horarios={horarios} onChange={setHorarios} />

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
              {grupo ? "Guardar Cambios" : "Crear Grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
