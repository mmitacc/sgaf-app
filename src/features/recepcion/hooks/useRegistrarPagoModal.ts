import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { recepcionService } from "../services/recepcionService";
import { estudianteService } from "@/features/estudiante/services/estudianteService";
import { extraerMensajeError } from "@/services/errorHandle";
import { abrirVentanaPasarela } from "@/utils/abrirPasarela";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import type {
  Pago,
  CrearPagoPayload,
  DeudaEstudiante,
} from "../types/recepcionType";
import type { Estudiante } from "@/features/estudiante/types/estudianteType";
import type { EstudianteFijoInfo } from "../components/ModalRegistrarPago";

interface UseRegistrarPagoParams {
  abierto: boolean;
  estudiantes?: Estudiante[];
  estudianteFijo?: EstudianteFijoInfo;
  onClose: () => void;
  onPagoRegistrado: (nuevoPago: Pago) => void;
  onRefrescarLista?: () => void;
}

export function useRegistrarPagoModal({
  abierto,
  estudiantes,
  estudianteFijo,
  onClose,
  onPagoRegistrado,
  onRefrescarLista,
}: UseRegistrarPagoParams) {
  const usuarioLogueado = useAuthStore((s) => s.usuario);
  const esModoEstudiante = Boolean(estudianteFijo);

  const [guardando, setGuardando] = useState(false);
  const [deudaActual, setDeudaActual] = useState<DeudaEstudiante | null>(null);
  const [cargandoDeuda, setCargandoDeuda] = useState(false);
  const [errorDeuda, setErrorDeuda] = useState<string | null>(null);
  const [matriculaAprobada, setMatriculaAprobada] = useState<boolean>(false);

  const [formData, setFormData] = useState<CrearPagoPayload>({
    concepto: "MATRICULA",
    descripcion: "",
    monto: 0,
    tipo_pago: esModoEstudiante ? "ONLINE" : "EFECTIVO",
    id_estudiante: 0,
    id_deuda: 0,
  });

  const estudianteSeleccionado = estudianteFijo
    ? {
        ...estudianteFijo,
        estado: estudianteFijo.estado ?? usuarioLogueado?.estado,
      }
    : estudiantes?.find((e) => e.id_usuario === formData.id_estudiante);

  const esMatricula = formData.concepto === "MATRICULA";
  const estaPendiente = !matriculaAprobada;
  const yaMatriculado = matriculaAprobada;

  const handleSeleccionarEstudiante = useCallback(
    async (idEstudiante: number) => {
      setDeudaActual(null);
      setErrorDeuda(null);

      if (!idEstudiante || idEstudiante <= 0) {
        setFormData((prev) => ({
          ...prev,
          id_estudiante: 0,
          id_deuda: 0,
          monto: 0,
        }));
        return;
      }

      const alumno = estudianteFijo
        ? {
            ...estudianteFijo,
            estado: estudianteFijo.estado ?? usuarioLogueado?.estado,
          }
        : estudiantes?.find((e) => e.id_usuario === idEstudiante);

      setCargandoDeuda(true);
      try {
        // 1. Obtener la deuda del estudiante (incluye id_periodo)
        const deuda = esModoEstudiante
          ? await estudianteService.obtenerMiDeuda()
          : await recepcionService.obtenerDeudaEstudiante(idEstudiante);

        // 2. Consultar directamente POST /api/pago/matricula con id_periodo e id_estudiante
        const tieneMatricula = await recepcionService.verificarMatriculaPeriodo(
          deuda.id_periodo,
          idEstudiante,
        );

        setMatriculaAprobada(tieneMatricula);
        setDeudaActual(deuda);

        const conceptoCorrecto = tieneMatricula ? "MENSUALIDAD" : "MATRICULA";

        setFormData((prev) => ({
          ...prev,
          id_estudiante: idEstudiante,
          concepto: conceptoCorrecto,
          tipo_pago: esModoEstudiante ? "ONLINE" : prev.tipo_pago,
          id_deuda: deuda.id,
          monto: conceptoCorrecto === "MATRICULA" ? 100 : deuda.deuda_mes,
        }));
      } catch (error) {
        const msg = extraerMensajeError(
          error,
          "Este estudiante no tiene una cuenta de deuda asignada.",
        );
        setErrorDeuda(msg);

        const tieneMatPorEstado = alumno?.estado === "ACTIVO";
        setMatriculaAprobada(tieneMatPorEstado);

        setFormData((prev) => ({
          ...prev,
          id_estudiante: idEstudiante,
          concepto: tieneMatPorEstado ? "MENSUALIDAD" : "MATRICULA",
          tipo_pago: esModoEstudiante ? "ONLINE" : prev.tipo_pago,
          id_deuda: 0,
          monto: tieneMatPorEstado ? 0 : 100,
        }));
      } finally {
        setCargandoDeuda(false);
      }
    },
    [estudianteFijo, estudiantes, esModoEstudiante, usuarioLogueado?.estado],
  );

  useEffect(() => {
    if (abierto && estudianteFijo) {
      handleSeleccionarEstudiante(estudianteFijo.id_usuario);
    }
  }, [abierto, estudianteFijo, handleSeleccionarEstudiante]);

  const handleCerrar = () => {
    setDeudaActual(null);
    setErrorDeuda(null);
    setFormData({
      concepto: "MATRICULA",
      descripcion: "",
      monto: 0,
      tipo_pago: esModoEstudiante ? "ONLINE" : "EFECTIVO",
      id_estudiante: 0,
      id_deuda: 0,
    });
    onClose();
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.id_estudiante || !estudianteSeleccionado) {
      toast.warning("Selecciona un estudiante válido.");
      return;
    }

    if (yaMatriculado && esMatricula) {
      toast.warning(
        "Este estudiante ya tiene matrícula aprobada. Corresponde cobrar mensualidad.",
      );
      return;
    }

    if (estaPendiente && formData.concepto === "MENSUALIDAD") {
      toast.warning(
        "El estudiante aún no registra matrícula aprobada. Debe pagar MATRÍCULA primero.",
      );
      return;
    }

    if (!esMatricula && !deudaActual) {
      toast.warning(
        "Este estudiante no tiene una deuda registrada para cobrar mensualidad.",
      );
      return;
    }

    if (formData.monto <= 0) {
      toast.warning("El monto debe ser mayor a 0.");
      return;
    }

    setGuardando(true);
    try {
      const nuevoPago = await recepcionService.registrarPago({
        concepto: formData.concepto,
        descripcion: formData.descripcion.trim(),
        monto: Number(formData.monto),
        tipo_pago: esModoEstudiante ? "ONLINE" : formData.tipo_pago,
        id_estudiante: Number(formData.id_estudiante),
        ...(deudaActual ? { id_deuda: deudaActual.id } : {}),
      });

      onPagoRegistrado(nuevoPago);
      handleCerrar();

      if (nuevoPago.tipo_pago === "ONLINE" && nuevoPago.referencia_externa) {
        toast.info("Abriendo pasarela de pago segura...", {
          description: "Completa la operación en la ventana emergente.",
        });
        abrirVentanaPasarela(nuevoPago.referencia_externa, () => {
          toast.success("Ventana de pago cerrada. Actualizando estado...");
          onRefrescarLista?.();
        });
      } else {
        toast.success(`Pago #${nuevoPago.id} registrado correctamente.`);
      }
    } catch (error) {
      toast.error(extraerMensajeError(error, "No se pudo registrar el pago."));
    } finally {
      setGuardando(false);
    }
  };

  return {
    esModoEstudiante,
    guardando,
    deudaActual,
    cargandoDeuda,
    errorDeuda,
    formData,
    setFormData,
    estaPendiente,
    yaMatriculado,
    esMatricula,
    handleSeleccionarEstudiante,
    handleCerrar,
    handleSubmit,
  };
}
