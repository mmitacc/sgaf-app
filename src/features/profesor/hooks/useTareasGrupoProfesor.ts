import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { profesorService } from "../services/profesorService";
import type { GrupoProfesor } from "../types/profesorType";
import { extraerMensajeError } from "@/services/errorHandle";

export interface FilaAlumnoEntrega {
  matriculaId: number;
  idEstudiante: number;
  nombreCompleto: string;
  entrega?: GrupoProfesor["tareas"][number]["entregas"][number];
}

export function useTareasGrupoProfesor() {
  const [grupos, setGrupos] = useState<GrupoProfesor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [tareaId, setTareaId] = useState<number | null>(null);

  const [modalNuevaTarea, setModalNuevaTarea] = useState(false);
  const [nombreTarea, setNombreTarea] = useState("");
  const [instruccionesTarea, setInstruccionesTarea] = useState("");
  const [fechaEntregaTarea, setFechaEntregaTarea] = useState("");
  const [creandoTarea, setCreandoTarea] = useState(false);

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

  const handleCrearTarea = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

  const filasAlumnos: FilaAlumnoEntrega[] = useMemo(() => {
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

  return {
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
  };
}
