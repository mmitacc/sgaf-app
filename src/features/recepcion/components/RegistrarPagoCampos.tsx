import { Loader2 } from "lucide-react";
import type { CrearPagoPayload, DeudaEstudiante } from "../types/recepcionType";
import type { Estudiante } from "@/features/estudiante/types/estudianteType";
import type { EstudianteFijoInfo } from "./ModalRegistrarPago";

interface RegistrarPagoCamposProps {
  formData: CrearPagoPayload;
  setFormData: React.Dispatch<React.SetStateAction<CrearPagoPayload>>;
  estudiantes?: Estudiante[];
  estudianteFijo?: EstudianteFijoInfo;
  esModoEstudiante: boolean;
  estaPendiente: boolean;
  yaMatriculado: boolean;
  esMatricula: boolean;
  deudaActual: DeudaEstudiante | null;
  cargandoDeuda: boolean;
  errorDeuda: string | null;
  onSelectEstudiante: (id: number) => void;
}

export function RegistrarPagoCampos({
  formData,
  setFormData,
  estudiantes,
  estudianteFijo,
  esModoEstudiante,
  estaPendiente,
  yaMatriculado,
  esMatricula,
  deudaActual,
  cargandoDeuda,
  errorDeuda,
  onSelectEstudiante,
}: RegistrarPagoCamposProps) {
  const inputClass =
    "w-full px-3.5 py-2.5 text-sm rounded-xl bg-bg-base border border-text-muted/20 text-text-base focus:outline-none focus:border-brand-primary disabled:opacity-60";

  return (
    <>
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
            onChange={(e) => onSelectEstudiante(Number(e.target.value))}
            className={inputClass}
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
              Cuota mensual: S/ {deudaActual.deuda_mes.toFixed(2)} • Total: S/{" "}
              {deudaActual.total_deuda.toFixed(2)}
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
        <div>
          <label className="block text-xs font-bold uppercase text-text-muted mb-1">
            Concepto
          </label>
          <select
            value={formData.concepto}
            onChange={(e) =>
              setFormData({ ...formData, concepto: e.target.value })
            }
            className={inputClass}
          >
            <option value="MATRICULA" disabled={yaMatriculado}>
              MATRICULA {yaMatriculado ? "(Ya pagada)" : ""}
            </option>
            <option value="MENSUALIDAD" disabled={estaPendiente}>
              MENSUALIDAD {estaPendiente ? "(Requiere matrícula)" : ""}
            </option>
            {!esModoEstudiante && <option value="OTROS">OTROS</option>}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-text-muted mb-1">
            Método de Pago
          </label>
          <select
            value={formData.tipo_pago}
            onChange={(e) =>
              setFormData({ ...formData, tipo_pago: e.target.value })
            }
            className={inputClass}
          >
            {!esModoEstudiante && <option value="EFECTIVO">EFECTIVO</option>}
            {!esModoEstudiante && (
              <option value="TRANSFERENCIA">TRANSFERENCIA</option>
            )}
            {!esModoEstudiante && <option value="TARJETA">TARJETA</option>}
            <option value="ONLINE">ONLINE</option>
          </select>
        </div>
      </div>

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
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-text-muted mb-1">
            Monto (S/)
          </label>
          <input
            type="number"
            step="0.01"
            min="1"
            disabled={formData.monto === 0 || esModoEstudiante}
            required
            value={formData.monto}
            onChange={(e) =>
              setFormData({ ...formData, monto: Number(e.target.value) })
            }
            className={inputClass}
          />
        </div>

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
    </>
  );
}
