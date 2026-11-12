import { useState, useEffect } from "react";
import { Receipt, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { recepcionService } from "../services/recepcionService";
import type {
  Pago,
  CrearPagoPayload,
  DeudaEstudiante,
} from "../types/recepcionType";
import type { Estudiante } from "@/features/estudiante/types/estudianteType";
import { extraerMensajeError } from "@/services/errorHandle";
import { abrirVentanaPasarela } from "@/utils/abrirPasarela";
import type { EstadoUsuario } from "@/features/usuario/types/usuarioType";
import { estudianteService } from "@/features/estudiante/services/estudianteService";

export interface EstudianteFijoInfo {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  estado?: EstadoUsuario;
}

interface ModalRegistrarPagoProps {
  abierto: boolean;
  onClose: () => void;
  estudiantes?: Estudiante[];
  estudianteFijo?: EstudianteFijoInfo;
  onPagoRegistrado: (nuevoPago: Pago) => void;
  onRefrescarLista?: () => void;
}

export function ModalRegistrarPago({
  abierto,
  onClose,
  estudiantes,
  estudianteFijo,
  onPagoRegistrado,
  onRefrescarLista,
}: ModalRegistrarPagoProps) {
  const [guardando, setGuardando] = useState(false);

  // Estados de deuda automática
  const [deudaActual, setDeudaActual] = useState<DeudaEstudiante | null>(null);
  const [cargandoDeuda, setCargandoDeuda] = useState(false);
  const [errorDeuda, setErrorDeuda] = useState<string | null>(null);

  // Formulario
  const [formData, setFormData] = useState<CrearPagoPayload>({
    concepto: "MENSUALIDAD",
    descripcion: "",
    monto: 0,
    tipo_pago: "EFECTIVO",
    id_estudiante: 0,
    id_deuda: 0,
  });

  // Buscamos el estudiante seleccionado para conocer su estado (ACTIVO / PENDIENTE)
  const esModoEstudiante = Boolean(estudianteFijo);

  // Si viene estudianteFijo lo usamos directo; si no, lo buscamos en la lista
  const estudianteSeleccionado = estudianteFijo
    ? estudianteFijo
    : estudiantes?.find((e) => e.id_usuario === formData.id_estudiante);

  const estaActivo = estudianteSeleccionado?.estado === "ACTIVO";
  const estaPendiente = estudianteSeleccionado?.estado === "PENDIENTE";
  const esMatricula = formData.concepto === "MATRICULA";

  useEffect(() => {
    if (abierto && estudianteFijo) {
      handleSeleccionarEstudiante(estudianteFijo.id_usuario);
    }
  }, [abierto, estudianteFijo]);

  if (!abierto) return null;

  // Limpiar y cerrar
  const handleCerrar = () => {
    setDeudaActual(null);
    setErrorDeuda(null);
    setFormData({
      concepto: "MENSUALIDAD",
      descripcion: "",
      monto: 0,
      tipo_pago: "EFECTIVO",
      id_estudiante: 0,
      id_deuda: 0,
    });
    onClose();
  };

  // Consultar deuda única y ajustar concepto según estado del estudiante
  const handleSeleccionarEstudiante = async (idEstudiante: number) => {
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

    const alumno =
      estudianteFijo ?? estudiantes?.find((e) => e.id_usuario === idEstudiante);
    const conceptoPorDefecto =
      alumno?.estado === "ACTIVO" ? "MENSUALIDAD" : "MATRICULA";

    setFormData((prev) => ({
      ...prev,
      id_estudiante: idEstudiante,
      concepto: conceptoPorDefecto,
    }));
    setCargandoDeuda(true);

    try {
      const deuda = esModoEstudiante
        ? await estudianteService.obtenerMiDeuda()
        : await recepcionService.obtenerDeudaEstudiante(idEstudiante);
      setDeudaActual(deuda);

      setFormData((prev) => ({
        ...prev,
        id_estudiante: idEstudiante,
        concepto: conceptoPorDefecto,
        id_deuda: deuda.id,
        // Si está activo sugerimos deuda_mes (o pendiente), si es matrícula sugerimos 100
        monto: deuda.deuda_mes,
      }));
    } catch (error) {
      const msg = extraerMensajeError(
        error,
        "Este estudiante no tiene una cuenta de deuda asignada.",
      );
      setErrorDeuda(msg);
      setFormData((prev) => ({
        ...prev,
        id_deuda: 0,
        monto: alumno?.estado === "PENDIENTE" ? 100 : 0,
      }));
    } finally {
      setCargandoDeuda(false);
    }
  };

  // Enviar pago (POST /pago)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id_estudiante || !estudianteSeleccionado) {
      toast.warning("Selecciona un estudiante válido.");
      return;
    }

    // Regla de negocio: Un estudiante ACTIVO nunca puede pagar MATRICULA
    if (estaActivo && esMatricula) {
      toast.warning(
        "Este estudiante ya se encuentra ACTIVO. No corresponde cobrar matrícula.",
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
        tipo_pago: formData.tipo_pago,
        id_estudiante: Number(formData.id_estudiante),
        ...(deudaActual ? { id_deuda: deudaActual.id } : {}),
      });

      onPagoRegistrado(nuevoPago);
      handleCerrar();

      // Si es pago ONLINE y el backend devolvió el checkout_url en referencia_externa
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-bg-surface border border-text-muted/15 shadow-2xl overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-text-muted/10">
          <h2 className="text-lg font-bold text-text-base flex items-center gap-2">
            <Receipt className="h-5 w-5 text-brand-primary" />
            Registrar Nuevo Pago
          </h2>
          <button
            type="button"
            onClick={handleCerrar}
            className="p-1.5 rounded-lg text-text-muted hover:bg-text-muted/10 hover:text-text-base cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Selector de Estudiante */}
          {esModoEstudiante && estudianteFijo ? (
            <div className="p-3 rounded-xl bg-bg-base border border-text-muted/15">
              <p className="text-xs text-text-muted">Titular de la cuenta</p>
              <p className="text-sm font-bold text-text-base">
                {estudianteFijo.nombres} {estudianteFijo.apellidos}
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-1">
                Estudiante
              </label>
              <select
                required
                value={formData.id_estudiante}
                onChange={(e) =>
                  handleSeleccionarEstudiante(Number(e.target.value))
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-bg-base border border-text-muted/20 text-text-base focus:outline-none focus:border-brand-primary"
              >
                <option value={0}>-- Selecciona un estudiante --</option>
                {estudiantes?.map((est) => (
                  <option key={est.id_usuario} value={est.id_usuario}>
                    {est.codigo} - {est.nombres} {est.apellidos} ({est.estado})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Estado de Deuda Asociada */}
          {cargandoDeuda && (
            <div className="p-3 rounded-xl bg-bg-base border border-text-muted/15 flex items-center gap-2 text-xs text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
              Consultando cuenta y deuda del estudiante...
            </div>
          )}

          {errorDeuda && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 font-medium">
              {errorDeuda}
            </div>
          )}

          {deudaActual && (
            <div className="p-3.5 rounded-xl bg-brand-primary/10 border border-brand-primary/25 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-brand-primary block">
                  Deuda Asociada #{deudaActual.id} • Periodo ID:{" "}
                  {deudaActual.id_periodo}
                </span>
                <span className="text-text-muted">
                  Cuota mensual: S/ {deudaActual.deuda_mes.toFixed(2)} • Total:
                  S/ {deudaActual.total_deuda.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-text-muted block">Saldo Pendiente</span>
                <span className="text-sm font-extrabold text-text-base">
                  S/ {deudaActual.pendiente.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Concepto condicionado por estado del estudiante */}
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-1">
                Concepto
              </label>
              <select
                value={formData.concepto}
                onChange={(e) =>
                  setFormData({ ...formData, concepto: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-bg-base border border-text-muted/20 text-text-base focus:outline-none focus:border-brand-primary"
              >
                <option value="MATRICULA" disabled={estaActivo}>
                  MATRICULA {estaActivo ? "(Ya pagada)" : ""}
                </option>
                <option value="MENSUALIDAD" disabled={estaPendiente}>
                  MENSUALIDAD {estaPendiente ? "(Requiere matrícula)" : ""}
                </option>
                <option value="OTROS">OTROS</option>
              </select>
            </div>

            {/* Tipo de Pago */}
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-1">
                Método de Pago
              </label>
              <select
                value={formData.tipo_pago}
                onChange={(e) =>
                  setFormData({ ...formData, tipo_pago: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-bg-base border border-text-muted/20 text-text-base focus:outline-none focus:border-brand-primary"
              >
                {!esModoEstudiante && (
                  <option value="EFECTIVO">EFECTIVO</option>
                )}
                {!esModoEstudiante && (
                  <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                )}
                {!esModoEstudiante && <option value="TARJETA">TARJETA</option>}
                <option value="ONLINE">ONLINE</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-bold uppercase text-text-muted mb-1">
              Descripción
            </label>
            <input
              type="text"
              required
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              placeholder={
                esMatricula
                  ? "Ej. Matrícula Periodo III-2026"
                  : "Ej. Mensualidad Octubre-2026"
              }
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-bg-base border border-text-muted/20 text-text-base focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monto */}
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-1">
                Monto (S/)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                disabled={formData.monto === 0}
                required
                value={formData.monto}
                onChange={(e) =>
                  setFormData({ ...formData, monto: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-bg-base border border-text-muted/20 text-text-base focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* ID Deuda (Solo lectura) */}
            <div>
              <label className="block text-xs font-bold uppercase text-text-muted mb-1">
                ID Deuda Asociada
              </label>
              <input
                type="text"
                readOnly
                value={
                  deudaActual
                    ? `#${deudaActual.id} (Periodo ${deudaActual.id_periodo})`
                    : "Sin asignar"
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-bg-base/60 border border-text-muted/15 text-text-muted font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="pt-4 border-t border-text-muted/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCerrar}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-text-muted hover:bg-text-muted/10 cursor-pointer"
            >
              {formData.monto === 0 ? "No tiene deudas vigentes" : "Cancelar"}
            </button>
            {formData.monto !== 0 && (
              <button
                type="submit"
                disabled={
                  guardando ||
                  cargandoDeuda ||
                  !formData.id_estudiante ||
                  (!esMatricula && !deudaActual)
                }
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-brand-primary text-white hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {guardando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Guardar Pago"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
