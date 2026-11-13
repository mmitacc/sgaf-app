import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { estudianteService } from "../services/estudianteService";
import type {
  MatriculaConDetalle,
  TareaConEntrega,
} from "../types/matriculaType";
import { extraerMensajeError } from "@/services/errorHandle";

export function useAulaVirtualEstudiante() {
  const [matriculas, setMatriculas] = useState<MatriculaConDetalle[]>([]);
  const [cargando, setCargando] = useState(true);
  const [grupoActivoId, setGrupoActivoId] = useState<number | null>(null);

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

  const handleGuardarEntrega = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ) => {
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

      if (archivoSeleccionado) {
        const resUpload =
          await estudianteService.subirArchivoTarea(archivoSeleccionado);
        urlFinal = resUpload.url;
      }

      await estudianteService.registrarEntrega({
        id_tarea: tareaSeleccionada.id,
        respuesta: respuestaTexto.trim() || undefined,
        archivo_url: urlFinal || undefined,
      });

      toast.success("¡Tarea entregada correctamente!");
      cerrarModalTarea();
      await cargarCursos();
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "Ocurrió un error al enviar tu tarea."),
      );
    } finally {
      setEnviando(false);
    }
  };

  return {
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
  };
}
