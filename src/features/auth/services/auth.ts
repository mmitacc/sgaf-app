import api from "@/services/axios";
import type { LoginFormData } from "../schemas/loginSchema";

// 1. Interfaz alineada a la salida real de tu backend
export interface LoginResponse {
  access_token: string;
}

export interface CambiarPasswordInput {
  password: string;
}

// 2. Servicio para autenticar usuario
export async function loginAuthService(
  datos: LoginFormData,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", datos);
  return data;
}

// 3. Servicio para cambiar contraseña
export async function cambiarPasswordAutenticadoService(
  datos: CambiarPasswordInput,
): Promise<void> {
  await api.patch("/auth/new-password", datos);
}

// 4. Objeto agrupador para un consumo limpio en los componentes
export const authService = {
  login: loginAuthService,
  cambiarPassword: cambiarPasswordAutenticadoService,
};
