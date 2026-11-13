import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { profesorService } from "../services/profesorService";
import type { GrupoProfesor } from "../types/profesorType";
import { extraerMensajeError } from "@/services/errorHandle";

export interface AlumnoConPromedio {
  id: number;
  estudiante: GrupoProfesor["matriculas"][number]["estudiante"];
  entregasRealizadas: number;
  totalTareas: number;
  promedio: string | null;
}

export function useGruposProfesor() {
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

  const alumnosConPromedio: AlumnoConPromedio[] = useMemo(() => {
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

  return {
    grupos,
    cargando,
    estadisticas,
    grupoActual,
    setGrupoSeleccionadoId,
    busquedaAlumno,
    setBusquedaAlumno,
    alumnosConPromedio,
  };
}
