import { BookOpen, GraduationCap, Loader2, Plus } from "lucide-react";
import { useTareasGrupoProfesor } from "../hooks/useTareasGrupoProfesor";
import { ListaTareasGrupo } from "../components/ListaTareasGrupo";
import { TablaEntregasCalificacion } from "../components/TablaEntregasCalificacion";
import { ModalNuevaTarea } from "../components/ModalNuevaTarea";

export function TareasGrupoProfesorPage() {
  const {
    grupos,
    cargando,
    grupoActual,
    tareaActual,
    setTareaId,
    handleCambiarGrupo,
    modalNuevaTarea,
    setModalNuevaTarea,
    nombreTarea,
    setNombreTarea,
    instruccionesTarea,
    setInstruccionesTarea,
    fechaEntregaTarea,
    setFechaEntregaTarea,
    creandoTarea,
    handleCrearTarea,
    notasInput,
    setNotasInput,
    guardandoNotaId,
    handleGuardarNota,
    filasAlumnos,
  } = useTareasGrupoProfesor();

  return (
    <div className="space-y-8">
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

          {grupoActual && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <ListaTareasGrupo
                grupo={grupoActual}
                tareaActivaId={tareaActual?.id}
                onSeleccionarTarea={setTareaId}
              />

              <TablaEntregasCalificacion
                tarea={tareaActual}
                filasAlumnos={filasAlumnos}
                notasInput={notasInput}
                onChangeNota={(id, val) =>
                  setNotasInput((prev) => ({ ...prev, [id]: val }))
                }
                guardandoNotaId={guardandoNotaId}
                onGuardarNota={handleGuardarNota}
              />
            </div>
          )}
        </>
      )}

      <ModalNuevaTarea
        abierto={modalNuevaTarea}
        grupo={grupoActual}
        nombre={nombreTarea}
        onChangeNombre={setNombreTarea}
        fechaEntrega={fechaEntregaTarea}
        onChangeFecha={setFechaEntregaTarea}
        instrucciones={instruccionesTarea}
        onChangeInstrucciones={setInstruccionesTarea}
        creando={creandoTarea}
        onCerrar={() => setModalNuevaTarea(false)}
        onSubmit={handleCrearTarea}
      />
    </div>
  );
}
