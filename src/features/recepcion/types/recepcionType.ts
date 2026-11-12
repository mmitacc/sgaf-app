export type EstadoPago = "APROBADO" | "PENDIENTE" | "RECHAZADO";
export type ConceptoPago = "MATRICULA" | "MENSUALIDAD" | "OTROS";
export type TipoPago = "EFECTIVO" | "TRANSFERENCIA" | "ONLINE";

export interface PeriodoActual {
  id: number;
  nombre: string;
  meses: number;
  inicio: string;
  fin: string;
  max_creditos: number;
  matricula: number;
  created: string;
}

export interface ValidarPagoMatriculaPayload {
  id_periodo: number;
  id_estudiante: number;
}

export interface Pago {
  id: number;
  concepto: string;
  descripcion: string;
  monto: number;
  tipo_pago: string;
  estado_pago: EstadoPago;
  referencia_externa: string | null;
  created: string;
  id_operador: number;
  id_estudiante: number;
  id_deuda: number;
}

export interface CrearPagoPayload {
  concepto: string;
  descripcion: string;
  monto: number;
  tipo_pago: string;
  id_estudiante: number;
  id_deuda?: number;
}

export interface DeudaEstudiante {
  id: number;
  total_deuda: number;
  pendiente: number;
  deuda_mes: number;
  moroso: boolean;
  id_periodo: number;
  id_estudiante: number;
  created: string;
}
