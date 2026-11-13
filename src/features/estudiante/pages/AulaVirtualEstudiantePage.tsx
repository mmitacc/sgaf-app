import { BookOpen, FileText, GraduationCap, Loader2 } from "lucide-react";
import { useAulaVirtualEstudiante } from "../hooks/useAulaVirtualEstudiante";
import { SelectorCursosAula } from "../components/SelectorCursosAula";
import { BannerCursoAula } from "../components/BannerCursoAula";
import { TarjetaTareaEstudiante } from "../components/TarjetaTareaEstudiante";
import { ModalEntregaTarea } from "../components/ModalEntregaTarea";
import { SeccionMaterialesCurso } from "../components/SeccionMaterialesCurso";

export function AulaVirtualEstudiantePage() {
  const {
    matriculas,
    cargando,
    cursoActual,
    setGrupoActivoId,
    tareaSeleccionada,
    respuestaTexto,
    setRespuestaTexto,
    archivoSeleccionado,
    setArchivoSeleccionado,
    archivoUrlActual,
    enviando,
    abrirModalTarea,
    cerrarModalTarea,
    handleGuardarEntrega,
  } = useAulaVirtualEstudiante();

  return (
    <div className="space-y-8">
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
          <SelectorCursosAula
            matriculas={matriculas}
            grupoActivoId={cursoActual?.grupo.id}
            onSeleccionarGrupo={setGrupoActivoId}
          />

          {cursoActual && <BannerCursoAula curso={cursoActual} />}

          {cursoActual && (
            <>
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
                    {cursoActual.grupo.tareas.map((tarea) => (
                      <TarjetaTareaEstudiante
                        key={tarea.id}
                        tarea={tarea}
                        onAbrirModal={abrirModalTarea}
                      />
                    ))}
                  </div>
                )}
              </div>

              <SeccionMaterialesCurso idGrupo={cursoActual.grupo.id} />
            </>
          )}
        </>
      )}

      <ModalEntregaTarea
        tarea={tareaSeleccionada}
        respuestaTexto={respuestaTexto}
        onChangeRespuesta={setRespuestaTexto}
        archivoSeleccionado={archivoSeleccionado}
        onChangeArchivo={setArchivoSeleccionado}
        archivoUrlActual={archivoUrlActual}
        enviando={enviando}
        onCerrar={cerrarModalTarea}
        onSubmit={handleGuardarEntrega}
      />
    </div>
  );
}
