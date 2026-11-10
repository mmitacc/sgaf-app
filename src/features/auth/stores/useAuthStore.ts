import { create } from "zustand";
import { persist } from "zustand/middleware";
import { perfilService } from "../services/perfil";
import type { Rol } from "@/features/usuario/schemas/usuarioSchema";
import { toast } from "sonner";
import { extraerMensajeError } from "@/services/errorHandle";

export interface UsuarioAutenticado {
  id: string | number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: Rol;
  foto_url?: string | null;
  telefono?: string | null;
}

interface AuthState {
  token: string | null;
  usuario: UsuarioAutenticado | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  actualizarPerfil: (
    datosActualizados?: Partial<UsuarioAutenticado>,
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      login: async (token) => {
        try {
          set({ token, isAuthenticated: true });
          const datosCompletosUsuario = await perfilService.obtener();
          set({ usuario: datosCompletosUsuario });
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
    }),
    { name: "auth-storage" },
  ),
);
