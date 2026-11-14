import { create } from "zustand";
import { persist } from "zustand/middleware";
import { perfilService } from "../services/perfil";
import type { Rol, EstadoUsuario } from "@/features/usuario/types/usuarioType";
import { toast } from "sonner";
import { extraerMensajeError } from "@/services/errorHandle";
import { RUTA_INICIAL_POR_ROL } from "@/config/roles.config";

export interface UsuarioAutenticado {
  id: string | number;
  nombres: string;
  apellidos: string;
  email: string;
  estado: EstadoUsuario;
  rol: Rol;
  foto_url?: string | null;
  telefono?: string | null;
}

interface AuthState {
  token: string | null;
  usuario: UsuarioAutenticado | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<UsuarioAutenticado>;
  logout: () => void;
  actualizarPerfil: (
    datosActualizados?: Partial<UsuarioAutenticado>,
  ) => Promise<void>;
  obtenerRutaInicial: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      login: async (token) => {
        try {
          set({ token }); // Guardamos el token primero para que perfilService lo use en el header Authorization
          const datosCompletosUsuario = await perfilService.obtener();

          set({
            usuario: datosCompletosUsuario,
            isAuthenticated: true, // Confirmamos autenticación solo cuando ya tenemos el rol
          });

          return datosCompletosUsuario; // Devolvemos el usuario a LoginPage
        } catch (error) {
          get().logout();
          throw error;
        }
      },

      logout: () => set({ token: null, usuario: null, isAuthenticated: false }),

      actualizarPerfil: async (datosActualizados) => {
        if (datosActualizados) {
          set((state) => ({
            usuario: state.usuario
              ? { ...state.usuario, ...datosActualizados }
              : null,
          }));
          return;
        }

        try {
          const datosFrescos = await perfilService.obtener();
          set({ usuario: datosFrescos });
        } catch (error) {
          toast.error(
            extraerMensajeError(
              error,
              "Error al sincronizar el perfil modificado.",
            ),
          );
        }
      },

      // Devuelve la ruta exacta del rol actual o /login si no hay sesión
      obtenerRutaInicial: () => {
        const rol = get().usuario?.rol;
        return rol ? RUTA_INICIAL_POR_ROL[rol] : "/login";
      },
    }),
    { name: "auth-storage" },
  ),
);
