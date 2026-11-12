import { useEffect, useState, useCallback } from "react";
import {
  Wallet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Loader2,
  Receipt,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { ModalRegistrarPago } from "@/features/recepcion/components/ModalRegistrarPago";
import type {
  DeudaEstudiante,
  Pago,
} from "@/features/recepcion/types/recepcionType";
import { extraerMensajeError } from "@/services/errorHandle";
import { abrirVentanaPasarela } from "@/utils/abrirPasarela";
import { estudianteService } from "../services/estudianteService";

export function EstadoCuentaEstudiantePage() {
  const usuario = useAuthStore((state) => state.usuario);

  const [deuda, setDeuda] = useState<DeudaEstudiante | null>(null);
  const [misPagos, setMisPagos] = useState<Pago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarEstadoCuenta = useCallback(async () => {
    setCargando(true);
    try {
      const [deudaRes, pagosRes] = await Promise.allSettled([
        estudianteService.obtenerMiDeuda(),
        estudianteService.obtenerMisPagos(),
      ]);

      if (deudaRes.status === "fulfilled") {
        setDeuda(deudaRes.value);
      }

      if (pagosRes.status === "fulfilled") {
        setMisPagos(pagosRes.value.sort((a, b) => b.id - a.id));
      }
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "No se pudo cargar tu estado de cuenta."),
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarEstadoCuenta();
  }, [cargarEstadoCuenta]);

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-text-muted/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
            Mi Estado de Cuenta
          </h1>
          <p className="text-text-muted mt-1">
            Consulta tus cuotas pendientes, deudas vencidas y realiza pagos en
            línea.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-md shadow-brand-primary/20 hover:opacity-90 transition-all cursor-pointer shrink-0"
        >
          <CreditCard className="h-5 w-5" />
          Realizar Pago
        </button>
      </div>

      {cargando ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-sm text-text-muted">
            Consultando tu cuenta financiera...
          </p>
        </div>
      ) : (
        <>
          {/* ALERTA DE DEUDA VENCIDA / MOROSIDAD */}
          {deuda && deuda.moroso && deuda.pendiente > 0 && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-700 dark:text-amber-400">
                    Tienes cuotas vencidas pendientes de pago
                  </h3>
                  <p className="text-sm text-text-base mt-0.5">
                    Saldo pendiente total:{" "}
                    <strong>S/ {deuda.pendiente.toFixed(2)}</strong> (Cuota
                    mensual: <strong>S/ {deuda.deuda_mes.toFixed(2)}</strong>).
                    Regulariza tu cuenta para evitar restricciones.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalAbierto(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold shrink-0 cursor-pointer"
              >
                Pagar Ahora
              </button>
            </div>
          )}

          {/* TARJETAS DE RESUMEN FINANCIERO */}
          {deuda && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10">
                <div className="flex items-center justify-between text-text-muted mb-2">
                  <span className="text-xs font-bold uppercase">
                    Saldo Pendiente
                  </span>
                  <Wallet className="h-5 w-5 text-brand-primary" />
                </div>
                <p className="text-3xl font-extrabold text-text-base">
                  S/ {deuda.pendiente.toFixed(2)}
                </p>
                <span
                  className={`inline-block mt-2 text-xs font-semibold ${
                    deuda.moroso ? "text-amber-500" : "text-emerald-500"
                  }`}
                >
                  {deuda.pendiente > 0
                    ? `${Math.ceil(deuda.pendiente / deuda.deuda_mes)} cuota(s) por pagar`
                    : "Cuenta al día"}
                </span>
              </div>

              <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10">
                <div className="flex items-center justify-between text-text-muted mb-2">
                  <span className="text-xs font-bold uppercase">
                    Cuota Mensual
                  </span>
                  <Calendar className="h-5 w-5 text-brand-primary" />
                </div>
                <p className="text-3xl font-extrabold text-text-base">
                  S/ {deuda.deuda_mes.toFixed(2)}
                </p>
                <span className="inline-block mt-2 text-xs text-text-muted">
                  Periodo ID: #{deuda.id_periodo}
                </span>
              </div>

              <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10">
                <div className="flex items-center justify-between text-text-muted mb-2">
                  <span className="text-xs font-bold uppercase">
                    Deuda Total
                  </span>
                  <Receipt className="h-5 w-5 text-brand-primary" />
                </div>
                <p className="text-3xl font-extrabold text-text-base">
                  S/ {deuda.total_deuda.toFixed(2)}
                </p>
                <span className="inline-block mt-2 text-xs text-text-muted">
                  Cuenta #{deuda.id}
                </span>
              </div>
            </div>
          )}

          {/* HISTORIAL DE PAGOS */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-text-base">
              Historial de Pagos
            </h2>

            <div className="rounded-2xl bg-bg-surface border border-text-muted/10 overflow-hidden shadow-sm">
              {misPagos.length === 0 ? (
                <div className="py-14 text-center space-y-2">
                  <Receipt className="h-10 w-10 text-text-muted/40 mx-auto" />
                  <p className="font-bold text-text-base">
                    Aún no registras pagos
                  </p>
                  <p className="text-xs text-text-muted">
                    Presiona "Realizar Pago" para abonar tu matrícula o
                    mensualidad.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-text-muted/10 bg-bg-base/50 text-xs font-bold uppercase text-text-muted">
                        <th className="py-3.5 px-4">Recibo</th>
                        <th className="py-3.5 px-4">Concepto / Descripción</th>
                        <th className="py-3.5 px-4">Método</th>
                        <th className="py-3.5 px-4">Monto</th>
                        <th className="py-3.5 px-4">Estado</th>
                        <th className="py-3.5 px-4">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-text-muted/10 text-sm">
                      {misPagos.map((pago) => (
                        <tr
                          key={pago.id}
                          className="hover:bg-text-muted/5 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-bold text-brand-primary">
                            #{pago.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-text-base block">
                              {pago.concepto}
                            </span>
                            <span className="text-xs text-text-muted">
                              {pago.descripcion}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs font-medium text-text-muted">
                            {pago.tipo_pago}
                          </td>
                          <td className="py-3.5 px-4">
                            {pago.estado_pago === "APROBADO" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                APROBADO
                              </span>
                            ) : pago.estado_pago === "PENDIENTE" ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                  <Clock className="h-3.5 w-3.5" />
                                  PENDIENTE
                                </span>
                                {pago.referencia_externa && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      abrirVentanaPasarela(
                                        pago.referencia_externa!,
                                        () => {
                                          toast.info("Actualizando estado...");
                                          cargarEstadoCuenta();
                                        },
                                      )
                                    }
                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-primary text-white hover:opacity-90 cursor-pointer"
                                  >
                                    Completar Pago
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400">
                                <XCircle className="h-3.5 w-3.5" />
                                RECHAZADO
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-text-muted whitespace-nowrap">
                            {new Date(pago.created).toLocaleDateString(
                              "es-PE",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* MODAL REUTILIZADO CON LOS DATOS DE useAuthStore */}
      {usuario && (
        <ModalRegistrarPago
          abierto={modalAbierto}
          onClose={() => setModalAbierto(false)}
          estudianteFijo={{
            id_usuario: Number(usuario.id),
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            estado: deuda ? "ACTIVO" : "PENDIENTE",
          }}
          onPagoRegistrado={(nuevoPago) =>
            setMisPagos((prev) => [nuevoPago, ...prev])
          }
          onRefrescarLista={cargarEstadoCuenta}
        />
      )}
    </div>
  );
}
