import type { EstadoUsuario } from "@/features/usuario/types/usuarioType";

export interface Estudiante {
  id_usuario: number;
  codigo: string;
  apoderado: string | null;
  nombres: string;
  apellidos: string;
  telefono: string | null;
  email: string;
  rol: "ESTUDIANTE";
  masculino: boolean;
  estado: EstadoUsuario;
  foto_url: string | null;
  created: string;
}
