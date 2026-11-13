import { BookOpen, GraduationCap, Loader2 } from "lucide-react";
import { useGruposProfesor } from "../hooks/useGruposProfesor";
import { KpisGruposProfesor } from "../components/KpisGruposProfesor";
import { SelectorGruposProfesor } from "../components/SelectorGruposProfesor";
import { TablaNominaGrupo } from "../components/TablaNominaGrupo";

export function GruposProfesorPage() {
  const {
    grupos,
    cargando,
    estadisticas,
    grupoActual,
    setGrupoSeleccionadoId,
    busquedaAlumno,
    setBusquedaAlumno,
    alumnosConPromedio,
  } = useGruposProfesor();

  return (
    <div className="space-y-8">
      <div className="border-b border-text-muted/10 pb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
          <GraduationCap className="h-4 w-4" />
          Gestión Docente
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
          Mis Grupos y Estudiantes
        </h1>
        <p className="text-text-muted mt-1">
          Supervisa tus secciones asignadas, métricas de rendimiento y nómina de
          alumnos matriculados.
        </p>
      </div>

      <KpisGruposProfesor estadisticas={estadisticas} />

      {cargando ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-sm text-text-muted">
            Cargando tus grupos y nómina de estudiantes...
          </p>
        </div>
      ) : grupos.length === 0 ? (
        <div className="rounded-2xl bg-bg-surface border border-text-muted/10 py-16 text-center space-y-2">
          <BookOpen className="h-10 w-10 text-text-muted/40 mx-auto" />
          <p className="font-bold text-text-base">No tienes grupos asignados</p>
          <p className="text-xs text-text-muted">
            Aún no se te han asignado secciones para el periodo actual.
          </p>
        </div>
      ) : (
        <>
          <SelectorGruposProfesor
            grupos={grupos}
            grupoActivoId={grupoActual?.id}
            onSeleccionarGrupo={setGrupoSeleccionadoId}
          />

          {grupoActual && (
            <TablaNominaGrupo
              grupo={grupoActual}
              busqueda={busquedaAlumno}
              onChangeBusqueda={setBusquedaAlumno}
              alumnos={alumnosConPromedio}
            />
          )}
        </>
      )}
    </div>
  );
}
