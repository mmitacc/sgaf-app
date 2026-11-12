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
  MapPin,
  Paperclip,
  Send,
  Upload,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { estudianteService } from "../services/estudianteService";
import type {
  MatriculaConDetalle,
  TareaConEntrega,
} from "../types/matriculaType";
import { extraerMensajeError } from "@/services/errorHandle";

export function AulaVirtualEstudiantePage() {
  const [matriculas, setMatriculas] = useState<MatriculaConDetalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [grupoActivoId, setGrupoActivoId] = useState<number | null>(null);

  // Estados para el Modal de Entrega
  const [tareaSeleccionada, setTareaSeleccionada] =
    useState<TareaConEntrega | null>(null);
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(
    null,
  );
  const [archivoUrlActual, setArchivoUrlActual] = useState<string>("");
  const [enviando, setEnviando] = useState(false);

  const cargarCursos = async () => {
    setCargando(true);
    try {
      const data = await estudianteService.obtenerMisMatriculas();
      setMatriculas(data);
      if (data.length > 0 && !grupoActivoId) {
        setGrupoActivoId(data[0].grupo.id);
      }
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "No se pudieron cargar tus cursos."),
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const cursoActual = useMemo(() => {
    return (
      matriculas.find((m) => m.grupo.id === grupoActivoId) || matriculas[0]
    );
  }, [matriculas, grupoActivoId]);

  const abrirModalTarea = (tarea: TareaConEntrega) => {
    const entregaPrevia = tarea.entregas?.[0];
    setTareaSeleccionada(tarea);
    setRespuestaTexto(entregaPrevia?.respuesta || "");
    setArchivoUrlActual(entregaPrevia?.archivo_url || "");
    setArchivoSeleccionado(null);
  };

  const cerrarModalTarea = () => {
    if (enviando) return;
    setTareaSeleccionada(null);
    setRespuestaTexto("");
    setArchivoSeleccionado(null);
    setArchivoUrlActual("");
  };

  const handleGuardarEntrega = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!tareaSeleccionada) return;

    if (!respuestaTexto.trim() && !archivoSeleccionado && !archivoUrlActual) {
      toast.error(
        "Escribe una respuesta o adjunta un archivo antes de enviar.",
      );
      return;
    }

    setEnviando(true);
    try {
      let urlFinal = archivoUrlActual;

      // 1. Si seleccionó un archivo nuevo, lo subimos primero a Cloudinary
      if (archivoSeleccionado) {
        const resUpload =
          await estudianteService.subirArchivoTarea(archivoSeleccionado);
        urlFinal = resUpload.url;
      }

      // 2. Registramos o actualizamos la entrega en el backend
      await estudianteService.registrarEntrega({
        id_tarea: tareaSeleccionada.id,
        respuesta: respuestaTexto.trim() || undefined,
        archivo_url: urlFinal || undefined,
      });

      toast.success("¡Tarea entregada correctamente!");
      cerrarModalTarea();
      await cargarCursos(); // Refrescamos el estado de las tareas
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "Ocurrió un error al enviar tu tarea."),
      );
    } finally {
      setEnviando(false);
    }
  };

  const entregaModal = tareaSeleccionada?.entregas?.[0];
  const yaCalificadaModal =
    entregaModal?.calificacion !== null &&
    entregaModal?.calificacion !== undefined;

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="border-b border-text-muted/10 pb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
          <GraduationCap className="h-4 w-4" />
          Campus Virtual
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
          Aula Virtual y Tareas
        </h1>
        <p className="text-text-muted mt-1">
          Accede a tus asignaturas inscritas, revisa las instrucciones de tus
          docentes y sube tus entregas.
        </p>
      </div>

      {cargando ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-sm text-text-muted">
            Cargando tus cursos y actividades...
          </p>
        </div>
      ) : matriculas.length === 0 ? (
        <div className="rounded-2xl bg-bg-surface border border-text-muted/10 py-16 text-center space-y-2">
          <BookOpen className="h-10 w-10 text-text-muted/40 mx-auto" />
          <p className="font-bold text-text-base">
            Aún no tienes cursos activos
          </p>
          <p className="text-xs text-text-muted">
            Dirígete a Matrícula en Línea para inscribirte en tus grupos del
            periodo.
          </p>
        </div>
      ) : (
        <>
          {/* Selector de Cursos (Pestañas horizontales) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {matriculas.map((m) => {
              const activo = cursoActual?.grupo.id === m.grupo.id;
              const pendientes = m.grupo.tareas.filter(
                (t) => !t.entregas || t.entregas.length === 0,
              ).length;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setGrupoActivoId(m.grupo.id)}
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

          {/* Banner Informativo del Curso Seleccionado */}
          {cursoActual && (
            <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-primary/15 text-brand-primary">
                    Grupo #{cursoActual.grupo.id}
                  </span>
                  <span className="text-xs font-medium text-text-muted">
                    {cursoActual.grupo.periodo.nombre}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-text-base">
                  {cursoActual.grupo.materia.nombre}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4 text-brand-primary" />
                    Prof. {cursoActual.grupo.profesor.usuario.nombres}{" "}
                    {cursoActual.grupo.profesor.usuario.apellidos}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-brand-primary" />
                    {cursoActual.grupo.aula.nombre}
                  </span>
                </div>
              </div>

              <div className="text-left md:text-right shrink-0">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Actividades del curso
                </p>
                <p className="text-2xl font-extrabold text-text-base mt-0.5">
                  {cursoActual.grupo.tareas.length}{" "}
                  <span className="text-sm font-normal text-text-muted">
                    asignadas
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Grid de Tareas del Curso */}
          {cursoActual && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
                Tareas y Evaluaciones
              </h3>

              {cursoActual.grupo.tareas.length === 0 ? (
                <div className="rounded-2xl bg-bg-surface border border-text-muted/10 py-12 text-center space-y-2">
                  <FileText className="h-9 w-9 text-text-muted/40 mx-auto" />
                  <p className="font-bold text-text-base">
                    Sin tareas publicadas
                  </p>
                  <p className="text-xs text-text-muted">
                    El docente aún no ha subido actividades para esta
                    asignatura.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cursoActual.grupo.tareas.map((tarea) => {
                    const entrega = tarea.entregas?.[0];
                    const calificada =
                      entrega?.calificacion !== null &&
                      entrega?.calificacion !== undefined;

                    return (
                      <div
                        key={tarea.id}
                        className="flex flex-col justify-between rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
                              <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                              Entrega:{" "}
                              <strong className="text-text-base">
                                {new Date(
                                  tarea.fecha_entrega,
                                ).toLocaleDateString("es-PE", {
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
                            {tarea.instrucciones ||
                              "Sin instrucciones adicionales."}
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
                            <span className="text-xs text-text-muted">
                              Sin archivo adjunto
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => abrirModalTarea(tarea)}
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
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal de Instrucciones y Subida de Entrega */}
      {tareaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-bg-surface border border-text-muted/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Cabecera del Modal */}
            <div className="flex items-start justify-between p-6 border-b border-text-muted/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Detalle de Actividad
                </span>
                <h3 className="text-xl font-extrabold text-text-base mt-0.5">
                  {tareaSeleccionada.nombre}
                </h3>
              </div>
              <button
                type="button"
                onClick={cerrarModalTarea}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-base hover:bg-text-muted/10 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cuerpo del Modal */}
            <form onSubmit={handleGuardarEntrega} className="p-6 space-y-5">
              {/* Instrucciones */}
              <div className="rounded-xl bg-black/5 dark:bg-white/5 p-4 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Instrucciones del docente
                </p>
                <p className="text-sm text-text-base whitespace-pre-line leading-relaxed">
                  {tareaSeleccionada.instrucciones}
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

              {/* Campo Respuesta de Texto */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Respuesta o comentarios
                </label>
                <textarea
                  rows={4}
                  disabled={yaCalificadaModal || enviando}
                  value={respuestaTexto}
                  onChange={(e) => setRespuestaTexto(e.target.value)}
                  placeholder="Escribe aquí tu respuesta, enlace o comentarios para el profesor..."
                  className="w-full rounded-xl bg-bg-surface border border-text-muted/15 p-3 text-sm text-text-base focus:outline-none focus:border-brand-primary disabled:opacity-60"
                />
              </div>

              {/* Campo Archivo Adjunto */}
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
                      onChange={(e) =>
                        setArchivoSeleccionado(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-text-muted/10">
                <button
                  type="button"
                  onClick={cerrarModalTarea}
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
      )}
    </div>
  );
}
