import api from "@/services/axios";
import type {
  UsuarioGenerico,
  RegistroEstudiante,
  RegistroUsuario,
  ActualizarUsuario,
} from "../types/usuarioType";

/**
 * Helper interno: Convierte el payload en FormData si existe un archivo File.
 * Si no hay archivo, devuelve el objeto JSON limpio.
 */
const prepararCuerpoPeticion = (
  data: Record<string, any>,
  fotoFile?: File | null,
): FormData | Record<string, any> => {
  if (fotoFile) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        // Si es un objeto anidado (ej. datosProfesor), lo serializamos
        if (typeof value === "object" && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Asegúrate de que el nombre del campo ('foto') coincida con @UseInterceptors(FileInterceptor('foto')) en NestJS
    formData.append("foto", fotoFile);
    return formData;
  }

  return data;
};

// ============================================================================
// 1. REGISTRO PÚBLICO (Solo Estudiantes)
// ============================================================================
export const registrarEstudiante = async (
  data: RegistroEstudiante,
  fotoFile?: File | null,
): Promise<UsuarioGenerico> => {
  console.log("Data Usuarionuevo: ", data);

  const payload = prepararCuerpoPeticion(data, fotoFile);
  const response = await api.post<UsuarioGenerico>("/auth/register", payload);
  return response.data;
};

// ============================================================================
// 2. CREAR USUARIO (Cualquier Rol)
// ============================================================================
export const crearUsuario = async (
  data: RegistroUsuario,
  fotoFile?: File | null,
): Promise<UsuarioGenerico> => {
  // Si el backend espera los datos de profesor anidados como en tu ejemplo:
  const { fecha_contrato, id_especialidad, ...restoDatos } = data;
  const payloadEstructurado = {
    ...restoDatos,
    ...(data.rol === "PROFESOR" && {
      datosProfesor: {
        fecha_contrato,
        id_especialidad,
      },
    }),
  };

  const body = prepararCuerpoPeticion(payloadEstructurado, fotoFile);
  const response = await api.post<UsuarioGenerico>("/usuario", body);
  return response.data;
};

// ============================================================================
// 3. OBTENER TODOS LOS USUARIOS (Con filtro opcional por rol o estado)
// ============================================================================
export const obtenerUsuarios = async (filtros?: {
  rol?: string;
  estado?: string;
}): Promise<UsuarioGenerico[]> => {
  const response = await api.get<UsuarioGenerico[]>("/usuario", {
    params: filtros,
  });
  return response.data;
};

// ============================================================================
// 4. OBTENER UN USUARIO POR ID
// ============================================================================
export const obtenerUsuarioPorId = async (
  id: number,
): Promise<UsuarioGenerico> => {
  const response = await api.get<UsuarioGenerico>(`/usuario/${id}`);
  return response.data;
};

// ============================================================================
// 5. ACTUALIZAR USUARIO POR ID
// ============================================================================
export const actualizarUsuario = async (
  id: number,
  data: ActualizarUsuario,
  fotoFile?: File | null,
): Promise<UsuarioGenerico> => {
  // Si la contraseña viene vacía en edición, la eliminamos para no sobrescribirla
  const datosLimpios = { ...data };
  if (!datosLimpios.password || datosLimpios.password.trim() === "") {
    delete datosLimpios.password;
  }

  const { fecha_contrato, id_especialidad, ...restoDatos } = datosLimpios;
  const payloadEstructurado = {
    ...restoDatos,
    ...(datosLimpios.rol === "PROFESOR" &&
      (fecha_contrato || id_especialidad) && {
        datosProfesor: {
          fecha_contrato,
          id_especialidad,
        },
      }),
  };

  const body = prepararCuerpoPeticion(payloadEstructurado, fotoFile);
  // Nota: Cambia api.put por api.patch si tu controlador en NestJS usa @Patch(':id')
  const response = await api.patch<UsuarioGenerico>(`/usuario/${id}`, body);
  return response.data;
};

// ============================================================================
// 6. ELIMINAR USUARIO POR ID
// ============================================================================
export const eliminarUsuario = async (id: number): Promise<void> => {
  await api.delete(`/usuario/${id}`);
};

// ============================================================================
// 7. RESETEAR CONTRASEÑA USUARIO POR ID
// ============================================================================
export const resetearPasswordUsuario = async (
  id: number,
): Promise<{ message: string; passwordTemporal: string }> => {
  const response = await api.patch<{
    message: string;
    passwordTemporal: string;
  }>(`/usuario/reset-password/${id}`);
  return response.data;
};
