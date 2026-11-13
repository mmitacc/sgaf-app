import api from "@/services/axios";
import type { TipoMaterial, MaterialGrupo } from "../types/materialType";

export const materialService = {
  async listarPorGrupo(idGrupo: number): Promise<MaterialGrupo[]> {
    const { data } = await api.get(`/material-grupo/grupo/${idGrupo}`);
    return data;
  },

  async crearMaterial(payload: {
    titulo: string;
    descripcion?: string;
    tipo: TipoMaterial;
    url: string;
    id_grupo: number;
  }): Promise<MaterialGrupo> {
    const { data } = await api.post("/material-grupo", payload);
    return data;
  },

  async subirArchivoCloudinary(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/entrega/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async eliminarMaterial(id: number): Promise<void> {
    await api.delete(`/material-grupo/${id}`);
  },
};
