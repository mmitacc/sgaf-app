import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Loader2,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { profesorService } from "../services/profesorService";
import type { GrupoProfesor } from "../types/profesorType";
import { extraerMensajeError } from "@/services/errorHandle";

export function GruposProfesorPage() {
  const [grupos, setGrupos] = useState<GrupoProfesor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [grupoSeleccionadoId, setGrupoSeleccionadoId] = useState<number | null>(
    null,
  );
  const [busquedaAlumno, setBusquedaAlumno] = useState("");

  useEffect(() => {
    const cargarGrupos = async () => {
      setCargando(true);
      try {
        const data = await profesorService.obtenerMisGrupos();
        setGrupos(data);
        if (data.length > 0) {
          setGrupoSeleccionadoId(data[0].id);
        }
      } catch (error) {
        toast.error(
          extraerMensajeError(error, "No se pudieron cargar tus grupos."),
        );
      } finally {
        setCargando(false);
      }
    };

    cargarGrupos();
  }, []);

  // Estadísticas globales del docente
  const estadisticas = useMemo(() => {
    let totalAlumnos = 0;
    let entregasPendientes = 0;
    let sumaNotas = 0;
    let totalCalificadas = 0;

    grupos.forEach((g) => {
      totalAlumnos += g.matriculas.length;
      g.tareas.forEach((t) => {
        t.entregas.forEach((e) => {
          if (e.calificacion === null || e.calificacion === undefined) {
            entregasPendientes += 1;
          } else {
            sumaNotas += Number(e.calificacion);
            totalCalificadas += 1;
          }
        });
      });
    });

    const promedioGlobal =
      totalCalificadas > 0 ? (sumaNotas / totalCalificadas).toFixed(1) : "--";

    return {
      totalGrupos: grupos.length,
      totalAlumnos,
      entregasPendientes,
      promedioGlobal,
    };
  }, [grupos]);

  const grupoActual = useMemo(() => {
    return grupos.find((g) => g.id === grupoSeleccionadoId) || grupos[0];
  }, [grupos, grupoSeleccionadoId]);

  // Calcular promedio real sobre el TOTAL de tareas del grupo (no entregada = 0)
  const alumnosConPromedio = useMemo(() => {
    if (!grupoActual) return [];

    const totalTareas = grupoActual.tareas.length;

    return grupoActual.matriculas
      .map((m) => {
        const idEst = m.estudiante.id_usuario;
        let sumaNotas = 0;
        let entregasRealizadas = 0;

        grupoActual.tareas.forEach((t) => {
          const entrega = t.entregas.find((e) => e.id_estudiante === idEst);
          if (entrega) {
            entregasRealizadas += 1;
            if (
              entrega.calificacion !== null &&
              entrega.calificacion !== undefined
            ) {
              sumaNotas += Number(entrega.calificacion);
            }
          }
        });

        // Si el grupo tiene tareas asignadas, dividimos entre el total de tareas (las faltantes suman 0)
        const promedio =
          totalTareas > 0 ? (sumaNotas / totalTareas).toFixed(1) : null;

        return {
          ...m,
          entregasRealizadas,
          totalTareas,
          promedio,
        };
      })
      .filter((item) => {
        const q = busquedaAlumno.toLowerCase().trim();
        if (!q) return true;
        const nombreCompleto =
          `${item.estudiante.usuario.nombres} ${item.estudiante.usuario.apellidos}`.toLowerCase();
        return nombreCompleto.includes(q);
      });
  }, [grupoActual, busquedaAlumno]);

  return (
    <div className="space-y-8">
      {/* Cabecera */}
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

      {/* KPIs Globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 dark:hover:border-brand-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-text-muted">
              Grupos Asignados
            </span>
            <BookOpen className="h-5 w-5 text-brand-primary" />
          </div>
          <p className="text-3xl font-extrabold text-text-base mt-2">
            {estadisticas.totalGrupos}
          </p>
        </div>

        <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 dark:hover:border-brand-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-text-muted">
              Total Estudiantes
            </span>
            <Users className="h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-text-base mt-2">
            {estadisticas.totalAlumnos}
          </p>
        </div>

        <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 dark:hover:border-brand-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-text-muted">
              Por Calificar
            </span>
            <ClipboardCheck className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-text-base mt-2">
            {estadisticas.entregasPendientes}
          </p>
        </div>

        <div className="rounded-2xl bg-bg-surface p-5 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 dark:hover:border-brand-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-text-muted">
              Promedio General
            </span>
            <Award className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-text-base mt-2">
            {estadisticas.promedioGlobal}
            <span className="text-sm font-normal text-text-muted"> / 20</span>
          </p>
        </div>
      </div>

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
          {/* Tarjetas selectoras de Grupo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grupos.map((g) => {
              const activo = grupoActual?.id === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGrupoSeleccionadoId(g.id)}
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

          {/* Tabla de Estudiantes del Grupo Seleccionado */}
          {grupoActual && (
            <div className="rounded-2xl bg-bg-surface border border-text-muted/10 overflow-hidden">
              <div className="p-5 border-b border-text-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-extrabold text-text-base">
                    Estudiantes en {grupoActual.materia.nombre} (Grupo #
                    {grupoActual.id})
                  </h2>
                  <p className="text-xs text-text-muted">
                    Listado oficial de alumnos matriculados y progreso de
                    evaluaciones.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="text"
                    value={busquedaAlumno}
                    onChange={(e) => setBusquedaAlumno(e.target.value)}
                    placeholder="Buscar estudiante..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-bg-surface border border-text-muted/15 text-text-base focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {alumnosConPromedio.length === 0 ? (
                <div className="p-10 text-center text-sm text-text-muted">
                  No hay estudiantes matriculados que coincidan con la búsqueda.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-text-muted/10 text-xs uppercase text-text-muted bg-black/5 dark:bg-white/5">
                        <th className="py-3.5 px-5">Estudiante</th>
                        <th className="py-3.5 px-5 text-center">
                          Tareas Entregadas
                        </th>
                        <th className="py-3.5 px-5 text-center">
                          Promedio Actual
                        </th>
                        <th className="py-3.5 px-5 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-text-muted/10 text-sm">
                      {alumnosConPromedio.map((item) => {
                        const aprobado =
                          item.promedio !== null && Number(item.promedio) >= 11;

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="py-3.5 px-5">
                              <p className="font-bold text-text-base">
                                {item.estudiante.usuario.apellidos},{" "}
                                {item.estudiante.usuario.nombres}
                              </p>
                              {item.estudiante.usuario.correo && (
                                <span className="text-xs text-text-muted">
                                  {item.estudiante.usuario.correo}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-5 text-center">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-base">
                                <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" />
                                {item.entregasRealizadas} / {item.totalTareas}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-center font-extrabold text-text-base">
                              {item.promedio !== null ? item.promedio : "—"}
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              {item.promedio === null ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-500">
                                  En curso
                                </span>
                              ) : (
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                    aprobado
                                      ? "bg-emerald-500/15 text-emerald-500"
                                      : "bg-rose-500/15 text-rose-500"
                                  }`}
                                >
                                  {aprobado ? "Aprobado" : "En riesgo"}
                                </span>
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
        </>
      )}
    </div>
  );
}
