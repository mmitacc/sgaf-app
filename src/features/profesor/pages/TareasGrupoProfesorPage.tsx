import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Loader2,
  Plus,
  Save,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { profesorService } from "../services/profesorService";
import type { GrupoProfesor, TareaGrupo } from "../types/profesorType";
import { extraerMensajeError } from "@/services/errorHandle";

export function TareasGrupoProfesorPage() {
  const [grupos, setGrupos] = useState<GrupoProfesor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [tareaId, setTareaId] = useState<number | null>(null);

  // Estados para modal de Nueva Tarea
  const [modalNuevaTarea, setModalNuevaTarea] = useState(false);
  const [nombreTarea, setNombreTarea] = useState("");
  const [instruccionesTarea, setInstruccionesTarea] = useState("");
  const [fechaEntregaTarea, setFechaEntregaTarea] = useState("");
  const [creandoTarea, setCreandoTarea] = useState(false);

  // Control de inputs de calificación por ID de entrega
  const [notasInput, setNotasInput] = useState<Record<number, string>>({});
  const [guardandoNotaId, setGuardandoNotaId] = useState<number | null>(null);

  const cargarDatos = async (mantenerSeleccion = true) => {
    setCargando(true);
    try {
      const data = await profesorService.obtenerMisGrupos();
      setGrupos(data);

      if (data.length > 0) {
        const grupoObj =
          mantenerSeleccion && grupoId
            ? data.find((g) => g.id === grupoId) || data[0]
            : data[0];
        setGrupoId(grupoObj.id);

        if (grupoObj.tareas.length > 0) {
          const tareaObj =
            mantenerSeleccion && tareaId
              ? grupoObj.tareas.find((t) => t.id === tareaId) ||
                grupoObj.tareas[0]
              : grupoObj.tareas[0];
          setTareaId(tareaObj.id);
        } else {
          setTareaId(null);
        }
      }
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "No se pudieron cargar las tareas."),
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos(false);
  }, []);

  const grupoActual = useMemo(
    () => grupos.find((g) => g.id === grupoId) || grupos[0],
    [grupos, grupoId],
  );

  const tareaActual = useMemo(
    () =>
      grupoActual?.tareas.find((t) => t.id === tareaId) ||
      grupoActual?.tareas[0],
    [grupoActual, tareaId],
  );

  // Sincronizar los inputs de nota cuando cambia la tarea seleccionada
  useEffect(() => {
    if (!tareaActual) return;
    const inicial: Record<number, string> = {};
    tareaActual.entregas.forEach((e) => {
      inicial[e.id] =
        e.calificacion !== null && e.calificacion !== undefined
          ? String(e.calificacion)
          : "";
    });
    setNotasInput(inicial);
  }, [tareaActual]);

  const handleCambiarGrupo = (nuevoGrupoId: number) => {
    setGrupoId(nuevoGrupoId);
    const g = grupos.find((item) => item.id === nuevoGrupoId);
    setTareaId(g?.tareas[0]?.id ?? null);
  };

  const handleCrearTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grupoActual) return;

    if (
      !nombreTarea.trim() ||
      !instruccionesTarea.trim() ||
      !fechaEntregaTarea
    ) {
      toast.error("Completa todos los campos de la tarea.");
      return;
    }

    setCreandoTarea(true);
    try {
      await profesorService.crearTarea({
        nombre: nombreTarea.trim(),
        instrucciones: instruccionesTarea.trim(),
        fecha_entrega: fechaEntregaTarea,
        id_grupo: grupoActual.id,
      });

      toast.success("¡Tarea publicada correctamente!");
      setModalNuevaTarea(false);
      setNombreTarea("");
      setInstruccionesTarea("");
      setFechaEntregaTarea("");
      await cargarDatos(true);
    } catch (error) {
      toast.error(extraerMensajeError(error, "No se pudo crear la tarea."));
    } finally {
      setCreandoTarea(false);
    }
  };

  const handleGuardarNota = async (idEntrega: number) => {
    const valorStr = notasInput[idEntrega];
    const valorNum = Number(valorStr);

    if (valorStr === "" || isNaN(valorNum) || valorNum < 0 || valorNum > 20) {
      toast.error("Ingresa una calificación entera válida entre 0 y 20.");
      return;
    }

    setGuardandoNotaId(idEntrega);
    try {
      await profesorService.calificarEntrega(idEntrega, valorNum);
      toast.success("Calificación guardada correctamente.");
      await cargarDatos(true);
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "No se pudo registrar la calificación."),
      );
    } finally {
      setGuardandoNotaId(null);
    }
  };

  // Cruzar todos los alumnos matriculados en el grupo con sus entregas en la tarea actual
  const filasAlumnos = useMemo(() => {
    if (!grupoActual || !tareaActual) return [];

    const lista = grupoActual.matriculas.map((m) => {
      const idEst = m.estudiante.id_usuario;
      const entrega = tareaActual.entregas.find(
        (e) => e.id_estudiante === idEst,
      );
      return {
        matriculaId: m.id,
        idEstudiante: idEst,
        nombreCompleto: `${m.estudiante.usuario.apellidos}, ${m.estudiante.usuario.nombres}`,
        entrega,
      };
    });

    // Prioridad: 1° Entregados sin nota -> 2° Entregados con nota -> 3° Sin entrega
    return lista.sort((a, b) => {
      const prioridad = (item: (typeof lista)[number]) => {
        if (!item.entrega) return 3;
        if (
          item.entrega.calificacion === null ||
          item.entrega.calificacion === undefined
        ) {
          return 1;
        }
        return 2;
      };

      const diff = prioridad(a) - prioridad(b);
      if (diff !== 0) return diff;
      return a.nombreCompleto.localeCompare(b.nombreCompleto);
    });
  }, [grupoActual, tareaActual]);

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-text-muted/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <GraduationCap className="h-4 w-4" />
            Evaluación Académica
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
            Tareas y Calificaciones
          </h1>
          <p className="text-text-muted mt-1">
            Crea actividades para tus secciones, revisa los archivos enviados y
            registra las calificaciones.
          </p>
        </div>

        {grupoActual && (
          <button
            type="button"
            onClick={() => setModalNuevaTarea(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Nueva Tarea
          </button>
        )}
      </div>

      {cargando ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-sm text-text-muted">
            Cargando secciones y entregas...
          </p>
        </div>
      ) : grupos.length === 0 ? (
        <div className="rounded-2xl bg-bg-surface border border-text-muted/10 py-16 text-center space-y-2">
          <BookOpen className="h-10 w-10 text-text-muted/40 mx-auto" />
          <p className="font-bold text-text-base">No tienes grupos asignados</p>
          <p className="text-xs text-text-muted">
            Cuando se te asignen grupos podrás crear tareas y calificar desde
            aquí.
          </p>
        </div>
      ) : (
        <>
          {/* Selector de Grupo */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {grupos.map((g) => {
              const activo = grupoActual?.id === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleCambiarGrupo(g.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    activo
                      ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-blue-500/20"
                      : "bg-bg-surface text-text-base border-text-muted/10 hover:border-brand-primary/50"
                  }`}
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>
                    {g.materia.nombre} (Grupo #{g.id})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Layout: Lista de Tareas (Izquierda) + Entregas de Alumnos (Derecha) */}
          {grupoActual && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Columna Izquierda: Tareas del Grupo */}
              <div className="lg:col-span-4 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Actividades del Grupo ({grupoActual.tareas.length})
                </h2>

                {grupoActual.tareas.length === 0 ? (
                  <div className="rounded-2xl bg-bg-surface border border-text-muted/10 p-6 text-center space-y-2">
                    <FileText className="h-8 w-8 text-text-muted/40 mx-auto" />
                    <p className="text-sm font-bold text-text-base">
                      Sin tareas creadas
                    </p>
                    <p className="text-xs text-text-muted">
                      Haz clic en "Nueva Tarea" para publicar la primera
                      actividad.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {grupoActual.tareas.map((tarea: TareaGrupo) => {
                      const seleccionada = tareaActual?.id === tarea.id;
                      const entregadas = tarea.entregas.length;
                      const totalAlumnos = grupoActual.matriculas.length;

                      return (
                        <button
                          key={tarea.id}
                          type="button"
                          onClick={() => setTareaId(tarea.id)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                            seleccionada
                              ? "bg-brand-primary/10 border-brand-primary shadow-md"
                              : "bg-bg-surface border-text-muted/10 hover:border-brand-primary/40"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                              {new Date(tarea.fecha_entrega).toLocaleDateString(
                                "es-PE",
                                {
                                  day: "2-digit",
                                  month: "short",
                                },
                              )}
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold">
                              <Users className="h-3.5 w-3.5" />
                              {entregadas}/{totalAlumnos} entregas
                            </span>
                          </div>
                          <p className="font-extrabold text-sm text-text-base">
                            {tarea.nombre}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Columna Derecha: Detalle de Tarea y Tabla de Calificación */}
              <div className="lg:col-span-8">
                {!tareaActual ? (
                  <div className="rounded-2xl bg-bg-surface border border-text-muted/10 p-12 text-center text-sm text-text-muted">
                    Selecciona o crea una tarea para revisar las entregas de tus
                    estudiantes.
                  </div>
                ) : (
                  <div className="rounded-2xl bg-bg-surface border border-text-muted/10 overflow-hidden">
                    {/* Info de la Tarea */}
                    <div className="p-6 border-b border-text-muted/10 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-xl font-extrabold text-text-base">
                          {tareaActual.nombre}
                        </h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-primary/15 text-brand-primary">
                          Vence:{" "}
                          {new Date(
                            tareaActual.fecha_entrega,
                          ).toLocaleDateString("es-PE", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted whitespace-pre-line leading-relaxed">
                        {tareaActual.instrucciones}
                      </p>
                    </div>

                    {/* Tabla de Entregas por Estudiante */}
                    {filasAlumnos.length === 0 ? (
                      <div className="p-10 text-center text-sm text-text-muted">
                        Este grupo aún no tiene estudiantes matriculados.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-text-muted/10 text-xs uppercase text-text-muted bg-black/5 dark:bg-white/5">
                              <th className="py-3.5 px-5">Estudiante</th>
                              <th className="py-3.5 px-5">Entrega / Archivo</th>
                              <th className="py-3.5 px-5 text-right">
                                Calificación (0-20)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-text-muted/10 text-sm">
                            {filasAlumnos.map((fila) => {
                              const entrega = fila.entrega;
                              const guardando = guardandoNotaId === entrega?.id;
                              const pendienteNota =
                                Boolean(entrega) &&
                                (entrega?.calificacion === null ||
                                  entrega?.calificacion === undefined);

                              return (
                                <tr
                                  key={fila.matriculaId}
                                  className={`transition-colors ${
                                    pendienteNota
                                      ? "bg-amber-500/5 hover:bg-amber-500/10"
                                      : "hover:bg-black/5 dark:hover:bg-white/5"
                                  }`}
                                >
                                  <td className="py-4 px-5 align-top">
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-text-base">
                                        {fila.nombreCompleto}
                                      </p>
                                      {pendienteNota && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                          Por calificar
                                        </span>
                                      )}
                                    </div>
                                    {entrega ? (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 mt-0.5">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Entregado el{" "}
                                        {new Date(
                                          entrega.created,
                                        ).toLocaleDateString("es-PE")}
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500 mt-0.5">
                                        <Clock className="h-3 w-3" />
                                        Sin entrega
                                      </span>
                                    )}
                                  </td>

                                  <td className="py-4 px-5 align-top space-y-1.5 max-w-xs">
                                    {!entrega ? (
                                      <span className="text-xs text-text-muted">
                                        El alumno aún no ha enviado su trabajo.
                                      </span>
                                    ) : (
                                      <>
                                        {entrega.respuesta && (
                                          <p className="text-xs text-text-base bg-black/5 dark:bg-white/5 p-2.5 rounded-lg line-clamp-3">
                                            {entrega.respuesta}
                                          </p>
                                        )}
                                        {entrega.archivo_url && (
                                          <a
                                            href={entrega.archivo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
                                          >
                                            Ver archivo adjunto
                                            <ExternalLink className="h-3.5 w-3.5" />
                                          </a>
                                        )}
                                      </>
                                    )}
                                  </td>

                                  <td className="py-4 px-5 align-top text-right">
                                    {!entrega ? (
                                      <span className="text-xs text-text-muted">
                                        —
                                      </span>
                                    ) : (
                                      <div className="inline-flex items-center gap-2">
                                        <input
                                          type="number"
                                          min={0}
                                          max={20}
                                          step={1}
                                          value={notasInput[entrega.id] ?? ""}
                                          onChange={(e) =>
                                            setNotasInput((prev) => ({
                                              ...prev,
                                              [entrega.id]: e.target.value,
                                            }))
                                          }
                                          placeholder="0-20"
                                          className={`w-20 px-2.5 py-1.5 text-center text-sm font-bold rounded-xl border text-text-base placeholder:text-text-muted/35 placeholder:font-normal focus:outline-none focus:border-brand-primary transition-colors ${
                                            pendienteNota
                                              ? "bg-amber-500/10 border-amber-500/50"
                                              : "bg-bg-surface border-emerald-500/40"
                                          }`}
                                        />
                                        <button
                                          type="button"
                                          disabled={guardando}
                                          onClick={() =>
                                            handleGuardarNota(entrega.id)
                                          }
                                          title="Guardar calificación"
                                          className={`p-2 rounded-xl text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer ${
                                            pendienteNota
                                              ? "bg-amber-500 shadow-sm shadow-amber-500/25"
                                              : "bg-brand-primary"
                                          }`}
                                        >
                                          {guardando ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Save className="h-4 w-4" />
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal para Crear Nueva Tarea */}
      {modalNuevaTarea && grupoActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-bg-surface border border-text-muted/15 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-text-muted/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  {grupoActual.materia.nombre} • Grupo #{grupoActual.id}
                </span>
                <h3 className="text-xl font-extrabold text-text-base mt-0.5">
                  Nueva Actividad
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalNuevaTarea(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-base hover:bg-text-muted/10 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCrearTarea} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-text-muted">
                  Título de la tarea
                </label>
                <input
                  type="text"
                  required
                  value={nombreTarea}
                  onChange={(e) => setNombreTarea(e.target.value)}
                  placeholder="Ej. Tarea 3 - Derivadas parciales"
                  className="w-full rounded-xl bg-bg-surface border border-text-muted/15 px-3.5 py-2.5 text-sm text-text-base focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-text-muted">
                  Fecha límite de entrega
                </label>
                <input
                  type="date"
                  required
                  value={fechaEntregaTarea}
                  onChange={(e) => setFechaEntregaTarea(e.target.value)}
                  className="w-full rounded-xl bg-bg-surface border border-text-muted/15 px-3.5 py-2.5 text-sm text-text-base focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-text-muted">
                  Instrucciones
                </label>
                <textarea
                  rows={4}
                  required
                  value={instruccionesTarea}
                  onChange={(e) => setInstruccionesTarea(e.target.value)}
                  placeholder="Describe los ejercicios, formato de entrega y criterios de evaluación..."
                  className="w-full rounded-xl bg-bg-surface border border-text-muted/15 p-3 text-sm text-text-base focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-text-muted/10">
                <button
                  type="button"
                  onClick={() => setModalNuevaTarea(false)}
                  disabled={creandoTarea}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-text-muted hover:text-text-base cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creandoTarea}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {creandoTarea ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Publicar Tarea
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
