import { z } from "zod";

const Rol = {
  RECEPCIONISTA: "RECEPCIONISTA",
  ADMINISTRADOR: "ADMINISTRADOR",
  PROFESOR: "PROFESOR",
  ESTUDIANTE: "ESTUDIANTE",
} as const;
export type Rol = (typeof Rol)[keyof typeof Rol];

const EstadoUsuario = {
  PENDIENTE: "PENDIENTE",
  ACTIVO: "ACTIVO",
  SUSPENDIDO: "SUSPENDIDO",
  INACTIVO: "INACTIVO",
} as const;

export type EstadoUsuario = (typeof EstadoUsuario)[keyof typeof EstadoUsuario];

// export interface Usuario {
//   id: string | number;
//   nombres: string;
//   apellidos: string;
//   telefono?: string;
//   email: string;
//   password: string;
//   rol: Rol;
//   masculino: boolean;
//   estado: EstadoUsuario;
//   foto_url?: string;
//   created: string;
// }

export const usuarioSchema = z.object({
  id: z.union([z.string(), z.number()]),
  nombres: z.string(),
  apellidos: z.string(),
  telefono: z.string().optional(),
  email: z.email("Ingresa un email válido"),
  password: z.string(),
  rol: z.enum(Rol),
  masculino: z.boolean(),
  estado: z.enum(EstadoUsuario),
  foto_url: z.string().url().nullish(),
  created: z.string(),
});

// Inferencia automática del Tipo de TypeScript para usar en todo tu Frontend
export type Usuario = z.infer<typeof usuarioSchema>;

// 2. Esquema para los datos del Profesor (CreateProfesorDto)
// Modifícalo según las propiedades reales que requiera tu profesor
export const createProfesorSchema = z.object({
  fecha_contrato: z.coerce
    .date({
      message: "La fecha de contrato debe ser una fecha válida.",
    })
    .optional(),
  id_especialidad: z
    .number({
      message: "La especialidad debe ser un identificador numérico.",
    })
    .optional(),
});
