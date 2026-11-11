import axios from "axios";

export function extraerMensajeError(err: unknown, porDefecto: string): string {
  // 1. Validar si es un error específico de Axios
  if (axios.isAxiosError(err)) {
    if (!err.response) return "No hay conexión al servidor. Espere y reintente.";

    const datos = err.response.data;
    const detalle = datos?.details?.[0]?.mensaje;

    // NestJS devuelve un array cuando falla class-validator (DTO)
    if (Array.isArray(datos?.message)) {
      return datos.message[0] ?? porDefecto;
    }

    return detalle ?? datos?.message ?? porDefecto;
  }

  // 2. Validar si es un error nativo de JavaScript/TypeScript
  if (err instanceof Error) {
    return err.message;
  }

  // 3. Fallback
  return "Error inesperado";
}
