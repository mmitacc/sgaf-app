export type Rol = "RECEPCIONISTA" | "ADMINISTRADOR" | "PROFESOR" | "ESTUDIANTE";

export type EstadoUsuario = "PENDIENTE" | "ACTIVO" | "SUSPENDIDO" | "INACTIVO";

export interface EspecialidadOption {
  id: number;
  nombre: string;
}

export interface UsuarioGenerico {
  id: number;
  nombres: string;
  apellidos: string;
  telefono?: string;
  email: string;
  password: string;
  rol: Rol;
  masculino: boolean;
  estado: EstadoUsuario;
  foto_url?: string;
  fotoFile?: File | null;
  created: string;
  // Solo profesor
  fecha_contrato: string;
  id_especialidad?: number;
  // Solo estudiante
  apoderado: string;
}

// Formulario General de registrar y actualizar usuarios
export type FormularioUsuarioValues = Omit<UsuarioGenerico, "id" | "created">;

// Registrar un nuevo estudiante
export type RegistroEstudiante = Omit<
  UsuarioGenerico,
  "id" | "rol" | "created" | "fecha_contrato" | "id_especialidad" | "fotoFile"
>;

// Registrar un nuevo usuario distinto a estudiante
export type RegistroUsuario = Omit<
  UsuarioGenerico,
  "id" | "created" | "apoderado" | "fotoFile"
>;

// Actualizar usuario o estudiante (password opcional y campos opcionales)
export type ActualizarUsuario = Partial<
  Omit<UsuarioGenerico, "id" | "created">
>;
