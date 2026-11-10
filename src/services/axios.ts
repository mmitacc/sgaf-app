import axios from "axios";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
});

// Interceptor de request: agrega el token si existe
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: manejo global de sesión y permisos
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    // Solo cerramos sesión y redirigimos si el 401 NO viene del intento de login
    if (error.response?.status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (error.response?.status === 403) {
      toast.info(
        "No tienes los permisos necesarios para realizar esta acción.",
      );
    }

    return Promise.reject(error);
  },
);

export default api;
