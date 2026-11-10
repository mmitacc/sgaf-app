import z from "zod";

export const perfilSchema = z.object({
  email: z.email("Ingresa un email válido"),
  telefono: z
    .string()
    .regex(/^\d{8,15}$/, "Ingresa un teléfono válido")
    .optional(),
});
