import api from "@/services/axios";
import type { Rol, EstadoUsuario } from "@/features/usuario/types/usuarioType";

export interface PerfilFormData {
  nombres: string;
  apellidos: string;
  telefono?: string;
}

export interface UserProfile {
  id: number | string;
  nombres: string;
  apellidos: string;
  email: string;
  estado: EstadoUsuario;
  rol: Rol;
  foto_url?: string | null;
  telefono?: string | null;
}

export const perfilService = {
  obtener: () => api.get<UserProfile>("/auth/profile").then((r) => r.data),

  actualizar: (datos: PerfilFormData, foto?: File | null) => {
    const formData = new FormData();
    formData.append("nombres", datos.nombres);
    formData.append("apellidos", datos.apellidos);

    if (datos.telefono) {
      formData.append("telefono", datos.telefono);
    }
    if (foto) {
      formData.append("foto", foto);
    }

    return api.put<UserProfile>("/auth/perfil", formData).then((r) => r.data);
  },
};

export const cambiarPasswordService = async (data: {
  passwordActual: string;
  passwordNueva: string;
}) => {
  const response = await api.patch("/auth/cambiar-password", data);
  return response.data;
};
