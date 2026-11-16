import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Receipt,
  CreditCard,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { recepcionService } from "../services/recepcionService";
import { estudianteService } from "@/features/estudiante/services/estudianteService";
import { ModalRegistrarPago } from "../components/ModalRegistrarPago";
import type { Pago } from "../types/recepcionType";
import type { Estudiante } from "@/features/estudiante/types/estudianteType";
import { extraerMensajeError } from "@/services/errorHandle";
import { abrirVentanaPasarela } from "@/utils/abrirPasarela";

export function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [filtroConcepto, setFiltroConcepto] = useState("TODOS");
  const [modalAbierto, setModalAbierto] = useState(false);

  // Definimos cargarDatos a nivel del componente para reutilizarlo
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [listaPagos, listaEstudiantes] = await Promise.all([
        recepcionService.listarPagos(),
        estudianteService.obtenerTodos(),
      ]);
      setPagos(listaPagos.sort((a, b) => b.id - a.id));
      setEstudiantes(listaEstudiantes);
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "Error al cargar el historial de pagos."),
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);
  const obtenerInfoEstudiante = (idEstudiante: number) => {
    const est = estudiantes.find((e) => e.id_usuario === idEstudiante);
    return est
      ? `${est.nombres} ${est.apellidos} (${est.codigo})`
      : `Estudiante #${idEstudiante}`;
  };

  const pagosFiltrados = pagos.filter((pago) => {
    const coincideConcepto =
      filtroConcepto === "TODOS" || pago.concepto === filtroConcepto;
    const infoEst = obtenerInfoEstudiante(pago.id_estudiante).toLowerCase();
    const q = busqueda.toLowerCase().trim();
    const coincideTexto =
      !q ||
      infoEst.includes(q) ||
      pago.descripcion.toLowerCase().includes(q) ||
      String(pago.id).includes(q);

    return coincideConcepto && coincideTexto;
  });

  const totalRecaudado = pagosFiltrados
    .filter((p) => p.estado_pago === "APROBADO")
    .reduce((acc, p) => acc + p.monto, 0);

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-text-muted/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
            Caja y Registro de Pagos
          </h1>
          <p className="text-text-muted mt-1">
            Consulta los comprobantes emitidos y registra nuevos cobros de
            matrícula o pensiones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white font-semibold shadow-md shadow-brand-primary/20 hover:opacity-90 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-5 w-5" />
          Registrar Nuevo Pago
        </button>
      </div>

      {/* Filtros y Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por estudiante, código o descripción..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-bg-surface border border-text-muted/15 text-text-base focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={filtroConcepto}
            onChange={(e) => setFiltroConcepto(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-bg-surface border border-text-muted/15 text-text-base focus:outline-none focus:border-brand-primary transition-colors"
          >
            <option value="TODOS">Todos los conceptos</option>
            <option value="MATRICULA">Matrícula</option>
            <option value="MENSUALIDAD">Mensualidad</option>
            <option value="OTROS">Otros</option>
          </select>
        </div>

        <div className="md:col-span-4 rounded-xl bg-bg-surface px-4 py-2.5 border border-text-muted/15 flex items-center justify-between">
          <span className="text-xs font-medium text-text-muted flex items-center gap-1.5">
            <Wallet className="h-4 w-4 text-brand-primary" />
            Total Aprobado:
          </span>
          <span className="text-base font-extrabold text-brand-primary">
            S/ {totalRecaudado.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tabla de Pagos */}
      <div className="rounded-2xl bg-bg-surface border border-text-muted/10 overflow-hidden shadow-sm">
        {cargando ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
            <p className="text-sm text-text-muted">
              Cargando movimientos de caja...
            </p>
          </div>
        ) : pagosFiltrados.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Receipt className="h-10 w-10 text-text-muted/40 mx-auto" />
            <p className="font-bold text-text-base">No se encontraron pagos</p>
            <p className="text-xs text-text-muted">
              Prueba cambiando los filtros o registra un nuevo comprobante.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-text-muted/10 bg-bg-base/50 text-xs font-bold uppercase text-text-muted">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Estudiante</th>
                  <th className="py-3.5 px-4">Concepto / Descripción</th>
                  <th className="py-3.5 px-4">Método</th>
                  <th className="py-3.5 px-4">Monto</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text-muted/10 text-sm">
                {pagosFiltrados.map((pago) => (
                  <tr
                    key={pago.id}
                    className="hover:bg-text-muted/5 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-brand-primary">
                      #{pago.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-text-base">
                      {obtenerInfoEstudiante(pago.id_estudiante)}
                      <span className="block text-xs text-text-muted">
                        Deuda ID: #{pago.id_deuda}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-text-base block">
                        {pago.concepto}
                      </span>
                      <span className="text-xs text-text-muted">
                        {pago.descripcion}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                        <CreditCard className="h-3.5 w-3.5" />
                        {pago.tipo_pago}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-text-base">
                      S/ {pago.monto.toFixed(2)}
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

                          {/* Botón para abrir la pasarela si tiene referencia_externa */}
                          {pago.referencia_externa && (
                            <button
                              type="button"
                              onClick={() =>
                                abrirVentanaPasarela(
                                  pago.referencia_externa!,
                                  () => {
                                    toast.info(
                                      "Verificando estado del pago...",
                                    );
                                    cargarDatos();
                                  },
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-primary text-white hover:opacity-90 transition-opacity cursor-pointer"
                            >
                              Ir a Pasarela
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
                      {new Date(pago.created).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Modularizado */}
      <ModalRegistrarPago
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        estudiantes={estudiantes}
        onPagoRegistrado={(nuevoPago) =>
          setPagos((prev) => [nuevoPago, ...prev])
        }
        onRefrescarLista={cargarDatos}
      />
    </div>
  );
}
