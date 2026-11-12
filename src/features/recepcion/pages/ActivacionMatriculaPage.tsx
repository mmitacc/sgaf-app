import { useEffect, useState } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  UserCheck,
  Calendar,
  Receipt,
  CreditCard,
  Loader2,
  AlertCircle,
  Users,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { recepcionService } from "../services/recepcionService";
import { estudianteService } from "@/features/estudiante/services/estudianteService";
import type { Pago, PeriodoActual } from "../types/recepcionType";
import type { Estudiante } from "@/features/estudiante/types/estudianteType";
import { extraerMensajeError } from "@/services/errorHandle";

export function ActivacionMatriculaPage() {
  // Periodo actual
  const [periodo, setPeriodo] = useState<PeriodoActual | null>(null);
  const [cargandoPeriodo, setCargandoPeriodo] = useState(true);

  // Lista de estudiantes pendientes
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(true);
  const [filtroTexto, setFiltroTexto] = useState("");

  // Estudiante seleccionado y validación de pago
  const [estudianteSeleccionado, setEstudianteSeleccionado] =
    useState<Estudiante | null>(null);
  const [buscandoPago, setBuscandoPago] = useState(false);
  const [pagoEncontrado, setPagoEncontrado] = useState<Pago | null>(null);
  const [mensajeSinPago, setMensajeSinPago] = useState<string | null>(null);

  // Estado de activación
  const [activando, setActivando] = useState(false);

  // 1. Cargar periodo actual y estudiantes pendientes al iniciar
  useEffect(() => {
    const inicializarDatos = async () => {
      try {
        const [periodoData, estudiantesData] = await Promise.all([
          recepcionService.obtenerPeriodoActual(),
          estudianteService.obtenerTodos({ estado: "PENDIENTE" }),
        ]);
        setPeriodo(periodoData);
        setEstudiantes(estudiantesData);
      } catch (err) {
        toast.error(
          extraerMensajeError(
            err,
            "Error al cargar los datos iniciales de matrícula.",
          ),
        );
      } finally {
        setCargandoPeriodo(false);
        setCargandoEstudiantes(false);
      }
    };

    inicializarDatos();
  }, []);

  // 2. Seleccionar un estudiante y validar automáticamente su pago de matrícula
  const handleSeleccionarYValidar = async (estudiante: Estudiante) => {
    if (!periodo) {
      toast.error("No hay un periodo académico vigente configurado.");
      return;
    }

    setEstudianteSeleccionado(estudiante);
    setBuscandoPago(true);
    setPagoEncontrado(null);
    setMensajeSinPago(null);

    try {
      const pago = await recepcionService.validarPagoMatricula({
        id_periodo: periodo.id,
        id_estudiante: estudiante.id_usuario, // Usamos id_usuario del endpoint /estudiante
      });

      setPagoEncontrado(pago);
      toast.success(
        `Pago verificado para ${estudiante.nombres} ${estudiante.apellidos}`,
      );
    } catch (error: any) {
      const msgBackend =
        error?.response?.data?.message ||
        extraerMensajeError(
          error,
          "El estudiante aún no registra pago de matrícula.",
        );
      setMensajeSinPago(msgBackend);
    } finally {
      setBuscandoPago(false);
    }
  };

  // 3. Dar de alta al estudiante (estado = ACTIVO) y quitarlo de la lista de pendientes
  const handleActivarEstudiante = async () => {
    if (!estudianteSeleccionado || !pagoEncontrado) return;

    setActivando(true);
    try {
      await recepcionService.activarEstudiante(
        estudianteSeleccionado.id_usuario,
      );

      toast.success(
        `¡${estudianteSeleccionado.nombres} ${estudianteSeleccionado.apellidos} (${estudianteSeleccionado.codigo}) ha sido ACTIVADO!`,
      );

      // Lo removemos de la lista local de pendientes y limpiamos la selección
      setEstudiantes((prev) =>
        prev.filter((e) => e.id_usuario !== estudianteSeleccionado.id_usuario),
      );
      setEstudianteSeleccionado(null);
      setPagoEncontrado(null);
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "No se pudo activar al estudiante."),
      );
    } finally {
      setActivando(false);
    }
  };

  // Filtrado rápido en pantalla por código, nombre o correo
  const estudiantesFiltrados = estudiantes.filter((est) => {
    const q = filtroTexto.toLowerCase().trim();
    if (!q) return true;
    return (
      est.codigo.toLowerCase().includes(q) ||
      `${est.nombres} ${est.apellidos}`.toLowerCase().includes(q) ||
      est.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Encabezado y Periodo Actual */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-text-muted/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
            Validación y Alta de Matrícula
          </h1>
          <p className="text-text-muted mt-1">
            Selecciona un estudiante pendiente para verificar su pago y activar
            su cuenta.
          </p>
        </div>

        {/* Badge Periodo Actual */}
        <div className="rounded-2xl bg-bg-surface px-5 py-3.5 border border-text-muted/10 flex items-center gap-3.5 shrink-0">
          <div className="p-2.5 rounded-xl bg-brand-primary/15 text-brand-primary">
            <Calendar className="h-5 w-5" />
          </div>
          {cargandoPeriodo ? (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando periodo...
            </div>
          ) : periodo ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
                Periodo Vigente (ID: {periodo.id})
              </p>
              <p className="text-sm font-bold text-text-base">
                {periodo.nombre}
              </p>
              <p className="text-xs text-text-muted">
                Matrícula:{" "}
                <span className="font-semibold text-text-base">
                  S/ {periodo.matricula.toFixed(2)}
                </span>
              </p>
            </div>
          ) : (
            <span className="text-xs text-red-500 font-medium">
              Sin periodo activo
            </span>
          )}
        </div>
      </div>

      {/* Contenedor Principal en 2 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMNA IZQUIERDA: Lista de Estudiantes Pendientes */}
        <div className="lg:col-span-5 rounded-2xl bg-bg-surface border border-text-muted/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" />
              Pendientes de Alta
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
              {estudiantesFiltrados.length}
            </span>
          </div>

          {/* Buscador rápido */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder="Buscar por código (MAT-2026...) o nombre..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-bg-base border border-text-muted/20 text-text-base focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>

          {/* Listado */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {cargandoEstudiantes ? (
              <div className="py-10 text-center text-sm text-text-muted flex flex-col items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
                Cargando estudiantes pendientes...
              </div>
            ) : estudiantesFiltrados.length === 0 ? (
              <div className="py-10 text-center text-sm text-text-muted">
                No hay estudiantes pendientes por validar.
              </div>
            ) : (
              estudiantesFiltrados.map((est) => {
                const isSelected =
                  estudianteSeleccionado?.id_usuario === est.id_usuario;
                return (
                  <button
                    key={est.id_usuario}
                    type="button"
                    onClick={() => handleSeleccionarYValidar(est)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-primary/10 border-brand-primary shadow-sm"
                        : "bg-bg-base/60 border-text-muted/10 hover:border-brand-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary">
                        <Hash className="h-3.5 w-3.5" />
                        {est.codigo}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        {est.estado}
                      </span>
                    </div>
                    <p className="font-bold text-sm text-text-base mt-1">
                      {est.nombres} {est.apellidos}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {est.email}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Detalle de Validación y Acción */}
        <div className="lg:col-span-7">
          {!estudianteSeleccionado ? (
            <div className="rounded-2xl bg-bg-surface border border-dashed border-text-muted/20 p-12 text-center space-y-2">
              <Receipt className="h-10 w-10 text-text-muted/50 mx-auto" />
              <h3 className="font-bold text-text-base">
                Ningún estudiante seleccionado
              </h3>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                Haz clic sobre un estudiante de la lista izquierda para
                consultar automáticamente si tiene su matrícula pagada.
              </p>
            </div>
          ) : buscandoPago ? (
            <div className="rounded-2xl bg-bg-surface border border-text-muted/10 p-12 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
              <p className="text-sm font-medium text-text-base">
                Consultando pago de matrícula de{" "}
                <span className="font-bold">
                  {estudianteSeleccionado.nombres}
                </span>
                ...
              </p>
            </div>
          ) : mensajeSinPago ? (
            /* CASO A: NO HA PAGADO (404) */
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-red-500/20 text-red-500 shrink-0">
                  <XCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase text-red-500">
                    {estudianteSeleccionado.codigo} • ID #
                    {estudianteSeleccionado.id_usuario}
                  </span>
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                    {estudianteSeleccionado.nombres}{" "}
                    {estudianteSeleccionado.apellidos}
                  </h3>
                  <p className="text-sm text-text-base pt-1">
                    {mensajeSinPago}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-red-500/20 text-xs text-text-muted">
                Apoderado registrado:{" "}
                <strong className="text-text-base">
                  {estudianteSeleccionado.apoderado || "No registrado"}
                </strong>
              </div>
            </div>
          ) : pagoEncontrado ? (
            /* CASO B: PAGO VERIFICADO Y APTO PARA ACTIVAR */
            <div className="rounded-2xl bg-bg-surface border border-text-muted/10 overflow-hidden transition-all duration-300 shadow-lg shadow-blue-500/5 dark:border-brand-primary/40">
              <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <div>
                    <h3 className="font-bold text-text-base">
                      {estudianteSeleccionado.nombres}{" "}
                      {estudianteSeleccionado.apellidos}
                    </h3>
                    <p className="text-xs text-text-muted">
                      Código: <strong>{estudianteSeleccionado.codigo}</strong> •
                      Pago #{pagoEncontrado.id}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  {pagoEncontrado.estado_pago}
                </span>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-text-muted uppercase font-medium">
                    Concepto
                  </p>
                  <p className="text-sm font-bold text-text-base mt-1">
                    {pagoEncontrado.concepto} ({pagoEncontrado.descripcion})
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted uppercase font-medium">
                    Monto Abonado
                  </p>
                  <p className="text-lg font-extrabold text-brand-primary mt-0.5">
                    S/ {pagoEncontrado.monto.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted uppercase font-medium">
                    Método de Pago
                  </p>
                  <p className="text-sm font-semibold text-text-base mt-1 inline-flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-text-muted" />
                    {pagoEncontrado.tipo_pago}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-muted uppercase font-medium">
                    Fecha de Pago
                  </p>
                  <p className="text-sm font-semibold text-text-base mt-1">
                    {new Date(pagoEncontrado.created).toLocaleDateString(
                      "es-PE",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-bg-base/50 border-t border-text-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <AlertCircle className="h-4 w-4 text-brand-primary shrink-0" />
                  <span>
                    Se actualizará el estado a{" "}
                    <strong className="text-text-base">ACTIVO</strong>.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleActivarEstudiante}
                  disabled={
                    activando || pagoEncontrado.estado_pago !== "APROBADO"
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {activando ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Activando...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-5 w-5" />
                      Dar de Alta (Activar)
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
