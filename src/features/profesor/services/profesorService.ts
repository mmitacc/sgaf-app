import api from "@/services/axios";
import type { GrupoProfesor, PayloadNuevaTarea } from "../types/profesorType";

export const profesorService = {
  async obtenerMisGrupos(): Promise<GrupoProfesor[]> {
    const { data } = await api.get<GrupoProfesor[]>("/grupo/profesor");
    return data;
  },

  async crearTarea(payload: PayloadNuevaTarea) {
    const { data } = await api.post("/tarea", payload);
    return data;
  },

  async calificarEntrega(idEntrega: number, calificacion: number) {
    const { data } = await api.patch(`/entrega/calificacion/${idEntrega}`, {
      calificacion: Math.round(calificacion),
    });
    return data;
  },
};
