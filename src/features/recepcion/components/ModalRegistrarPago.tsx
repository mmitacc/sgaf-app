import { Receipt, X, Loader2 } from "lucide-react";
import type { Pago } from "../types/recepcionType";
import type { Estudiante } from "@/features/estudiante/types/estudianteType";
import type { EstadoUsuario } from "@/features/usuario/types/usuarioType";
import { useRegistrarPagoModal } from "../hooks/useRegistrarPagoModal";
import { RegistrarPagoCampos } from "./RegistrarPagoCampos";

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

export function ModalRegistrarPago(props: ModalRegistrarPagoProps) {
  const { abierto, estudiantes, estudianteFijo } = props;
  const {
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
  } = useRegistrarPagoModal(props);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-bg-surface border border-text-muted/15 shadow-2xl overflow-hidden">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <RegistrarPagoCampos
            formData={formData}
            setFormData={setFormData}
            estudiantes={estudiantes}
            estudianteFijo={estudianteFijo}
            esModoEstudiante={esModoEstudiante}
            estaPendiente={estaPendiente}
            yaMatriculado={yaMatriculado}
            esMatricula={esMatricula}
            deudaActual={deudaActual}
            cargandoDeuda={cargandoDeuda}
            errorDeuda={errorDeuda}
            onSelectEstudiante={handleSeleccionarEstudiante}
          />

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
