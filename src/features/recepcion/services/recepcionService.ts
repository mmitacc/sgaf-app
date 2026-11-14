import api from "@/services/axios";
import type {
  PeriodoActual,
  Pago,
  ValidarPagoMatriculaPayload,
  CrearPagoPayload,
  DeudaEstudiante,
} from "../types/recepcionType";

export const recepcionService = {
  // 1. Obtener el periodo académico activo
  obtenerPeriodoActual: async (): Promise<PeriodoActual> => {
    const { data } = await api.get<PeriodoActual>("/periodo/actual");
    return data;
  },

  // 2. Validar si el estudiante pagó su matrícula en el periodo
  // Nota: Si tu backend recibe POST usa api.post, si recibe GET con body/params ajústalo aquí
  validarPagoMatricula: async (
    payload: ValidarPagoMatriculaPayload,
  ): Promise<Pago> => {
    const { data } = await api.post<Pago>("/pago/matricula", payload);
    return data;
  },

  // 3. Dar de alta al estudiante (estado = ACTIVO)
  activarEstudiante: async (idEstudiante: number): Promise<void> => {
    await api.patch(`/estudiante/activar/${idEstudiante}`);
  },

  // 4. Traer todos los pagos
  listarPagos: async (): Promise<Pago[]> => {
    const { data } = await api.get<Pago[]>("/pago");
    return data;
  },

  // 5. Registrar un nuevo pago
  registrarPago: async (payload: CrearPagoPayload): Promise<Pago> => {
    const { data } = await api.post<Pago>("/pago", payload);
    return data;
  },

  // 6. Traer la data de deuda relacionada al estudiante por su ID
  obtenerDeudaEstudiante: async (
    idEstudiante: number,
  ): Promise<DeudaEstudiante> => {
    const { data } = await api.get<DeudaEstudiante>(
      `/deuda/estudiante/${idEstudiante}`,
    );
    return data;
  },

  async verificarMatriculaPeriodo(
    idPeriodo: number,
    idEstudiante: number,
  ): Promise<boolean> {
    try {
      await api.post("/pago/matricula", {
        id_periodo: idPeriodo,
        id_estudiante: idEstudiante,
      });
      return true; // Tiene matrícula aprobada en este periodo
    } catch (error: unknown) {
      const err = error as { response?: { status?: number }; status?: number };
      if (err?.response?.status === 404 || err?.status === 404) {
        return false; // Aún no ha pagado su matrícula en este periodo
      }
      throw error;
    }
  },
};
