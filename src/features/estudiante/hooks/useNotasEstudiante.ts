import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { estudianteService } from "../services/estudianteService";
import type { MatriculaConDetalle } from "../types/matriculaType";
import { extraerMensajeError } from "@/services/errorHandle";

export const NOTA_MINIMA_APROBATORIA = 11;

export interface CursoConPromedio extends MatriculaConDetalle {
  promedioCurso: number | null;
  tareasCalificadas: number;
  totalTareas: number;
}

export function useNotasEstudiante() {
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

  const periodosDisponibles = useMemo(() => {
    const map = new Map<number, string>();
    matriculas.forEach((m) => {
      if (m.grupo?.periodo) {
        map.set(m.grupo.periodo.id, m.grupo.periodo.nombre);
      }
    });
    return Array.from(map.entries());
  }, [matriculas]);

  const matriculasFiltradas = useMemo(() => {
    if (periodoSeleccionado === "TODOS") return matriculas;
    return matriculas.filter(
      (m) => String(m.grupo.periodo.id) === periodoSeleccionado,
    );
  }, [matriculas, periodoSeleccionado]);

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

    const lista: CursoConPromedio[] = matriculasFiltradas.map((m) => {
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

  return {
    cargando,
    periodoSeleccionado,
    setPeriodoSeleccionado,
    periodosDisponibles,
    cursosProcesados,
    promedioGeneral,
    creditosTotales,
    cursosAprobados,
  };
}
