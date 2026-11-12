import { useEffect, useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  Loader2,
  TrendingUp,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { estudianteService } from "../services/estudianteService";
import type { MatriculaConDetalle } from "../types/matriculaType";
import { extraerMensajeError } from "@/services/errorHandle";

const NOTA_MINIMA_APROBATORIA = 11;

export function NotasEstudiantePage() {
  const [matriculas, setMatriculas] = useState<MatriculaConDetalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [periodoSeleccionado, setPeriodoSeleccionado] =
    useState<string>("TODOS");

  useEffect(() => {
    const cargarCalificaciones = async () => {
      setCargando(true);
      try {
        const data = await estudianteService.obtenerMisMatriculas();
        setMatriculas(data);
      } catch (error) {
        toast.error(
          extraerMensajeError(
            error,
            "No se pudieron cargar tus calificaciones.",
          ),
        );
      } finally {
        setCargando(false);
      }
    };

    cargarCalificaciones();
  }, []);

  // Extraer periodos únicos para el filtro
  const periodosDisponibles = useMemo(() => {
    const map = new Map<number, string>();
    matriculas.forEach((m) => {
      if (m.grupo?.periodo) {
        map.set(m.grupo.periodo.id, m.grupo.periodo.nombre);
      }
    });
    return Array.from(map.entries());
  }, [matriculas]);

  // Filtrar matrículas por periodo
  const matriculasFiltradas = useMemo(() => {
    if (periodoSeleccionado === "TODOS") return matriculas;
    return matriculas.filter(
      (m) => String(m.grupo.periodo.id) === periodoSeleccionado,
    );
  }, [matriculas, periodoSeleccionado]);

  // Procesar promedio por curso y KPIs globales
  const {
    cursosProcesados,
    promedioGeneral,
    creditosTotales,
    cursosAprobados,
  } = useMemo(() => {
    let sumaPonderada = 0;
    let creditosConNota = 0;
    let totalCreditos = 0;
    let aprobados = 0;

    const lista = matriculasFiltradas.map((m) => {
      const tareas = m.grupo.tareas || [];
      let sumaNotas = 0;
      let cantidadCalificadas = 0;

      tareas.forEach((t) => {
        const entrega = t.entregas?.[0];
        if (
          entrega &&
          entrega.calificacion !== null &&
          entrega.calificacion !== undefined
        ) {
          sumaNotas += Number(entrega.calificacion);
          cantidadCalificadas += 1;
        }
      });

      // Dividimos entre el TOTAL de tareas del grupo (no entregada/calificada suma 0)
      const promedioCurso =
        tareas.length > 0 ? sumaNotas / tareas.length : null;

      const creditos = m.grupo.materia.creditos || 0;
      totalCreditos += creditos;

      if (promedioCurso !== null) {
        sumaPonderada += promedioCurso * creditos;
        creditosConNota += creditos;
        if (promedioCurso >= NOTA_MINIMA_APROBATORIA) {
          aprobados += 1;
        }
      }

      return {
        ...m,
        promedioCurso,
        tareasCalificadas: cantidadCalificadas,
        totalTareas: tareas.length,
      };
    });

    const promGeneral =
      creditosConNota > 0 ? (sumaPonderada / creditosConNota).toFixed(2) : "--";

    return {
      cursosProcesados: lista,
      promedioGeneral: promGeneral,
      creditosTotales: totalCreditos,
      cursosAprobados: aprobados,
    };
  }, [matriculasFiltradas]);

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-text-muted/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <GraduationCap className="h-4 w-4" />
            Record Académico
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
            Mis Calificaciones
          </h1>
          <p className="text-text-muted mt-1">
            Revisa tus notas por asignatura, evaluaciones entregadas y promedio
            ponderado.
          </p>
        </div>

        {/* Selector de Periodo */}
        {periodosDisponibles.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="h-4 w-4 text-text-muted" />
            <select
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              className="rounded-xl bg-bg-surface px-4 py-2.5 text-sm font-medium text-text-base border border-text-muted/15 focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
            >
              <option value="TODOS">Todos los periodos</option>
              {periodosDisponibles.map(([id, nombre]) => (
                <option key={id} value={String(id)}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* KPIs Académicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Promedio Ponderado
            </span>
            <div className="p-2 rounded-xl bg-brand-primary/15 text-brand-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-text-base mt-3">
            {promedioGeneral}
            <span className="text-sm font-normal text-text-muted"> / 20</span>
          </p>
        </div>

        <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Cursos Aprobados
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-text-base mt-3">
            {cursosAprobados}{" "}
            <span className="text-sm font-normal text-text-muted">
              de {cursosProcesados.length} inscritos
            </span>
          </p>
        </div>

        <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Carga Académica
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-500">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-text-base mt-3">
            {creditosTotales}{" "}
            <span className="text-sm font-normal text-text-muted">
              créditos totales
            </span>
          </p>
        </div>
      </div>

      {/* Listado de Asignaturas y Desglose de Notas */}
      {cargando ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-sm text-text-muted">
            Calculando tu historial de calificaciones...
          </p>
        </div>
      ) : cursosProcesados.length === 0 ? (
        <div className="rounded-2xl bg-bg-surface border border-text-muted/10 py-16 text-center space-y-2">
          <BookOpen className="h-10 w-10 text-text-muted/40 mx-auto" />
          <p className="font-bold text-text-base">
            No tienes asignaturas registradas
          </p>
          <p className="text-xs text-text-muted">
            Inscríbete en tus grupos desde Matrícula en Línea para ver tus
            notas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cursosProcesados.map((curso) => {
            const aprobado =
              curso.promedioCurso !== null &&
              curso.promedioCurso >= NOTA_MINIMA_APROBATORIA;

            return (
              <div
                key={curso.id}
                className="flex flex-col justify-between rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary"
              >
                <div>
                  {/* Cabecera de la asignatura */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-primary/15 text-brand-primary">
                          Grupo #{curso.grupo.id}
                        </span>
                        <span className="text-xs font-semibold text-text-muted">
                          • {curso.grupo.materia.creditos} Créditos
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-text-base">
                        {curso.grupo.materia.nombre}
                      </h3>
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-brand-primary" />
                        {curso.grupo?.profesor?.usuario
                          ? `Prof. ${curso.grupo.profesor.usuario.nombres} ${curso.grupo.profesor.usuario.apellidos}`
                          : "Por asignar"}
                      </p>
                    </div>

                    {/* Badge de Promedio del Curso */}
                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex flex-col items-center px-3.5 py-2 rounded-xl border ${
                          curso.promedioCurso === null
                            ? "bg-amber-500/10 border-amber-500/25 text-amber-500"
                            : aprobado
                              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-500"
                              : "bg-rose-500/10 border-rose-500/25 text-rose-500"
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {curso.promedioCurso === null
                            ? "Pendiente"
                            : aprobado
                              ? "Aprobado"
                              : "Desaprobado"}
                        </span>
                        <span className="text-xl font-extrabold leading-tight mt-0.5">
                          {curso.promedioCurso !== null
                            ? curso.promedioCurso.toFixed(1)
                            : "--"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Tareas / Evaluaciones */}
                  <div className="mt-5 pt-4 border-t border-text-muted/10 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-text-muted">
                      <span>Evaluaciones ({curso.totalTareas})</span>
                      <span>Nota</span>
                    </div>

                    {curso.grupo.tareas.length === 0 ? (
                      <p className="text-xs text-text-muted py-2">
                        Aún no hay evaluaciones publicadas en este grupo.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {curso.grupo.tareas.map((tarea) => {
                          const entrega = tarea.entregas?.[0];
                          const nota = entrega?.calificacion;

                          return (
                            <div
                              key={tarea.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 text-xs"
                            >
                              <div className="space-y-0.5">
                                <p className="font-semibold text-text-base">
                                  {tarea.nombre}
                                </p>
                                <div className="flex items-center gap-3 text-text-muted">
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(
                                      tarea.fecha_entrega,
                                    ).toLocaleDateString("es-PE", {
                                      day: "2-digit",
                                      month: "short",
                                    })}
                                  </span>
                                  {entrega ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-500 font-medium">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Entregado
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
                                      <Clock className="h-3 w-3" />
                                      Sin entrega
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="font-extrabold text-sm">
                                {nota !== null && nota !== undefined ? (
                                  <span
                                    className={
                                      nota >= NOTA_MINIMA_APROBATORIA
                                        ? "text-emerald-500"
                                        : "text-rose-500"
                                    }
                                  >
                                    {nota.toFixed(1)}
                                  </span>
                                ) : (
                                  <span className="text-xs font-medium text-text-muted px-2 py-1 rounded-md bg-text-muted/10">
                                    Por calificar
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pie de tarjeta con Periodo */}
                <div className="mt-4 pt-3 border-t border-text-muted/10 flex items-center justify-between text-[11px] text-text-muted">
                  <span>{curso.grupo.periodo.nombre}</span>
                  <span>
                    {curso.tareasCalificadas} de {curso.totalTareas} calificadas
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
