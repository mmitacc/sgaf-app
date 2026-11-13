export interface PeriodoOption {
  id: number;
  nombre: string;
}

export interface FinanzasKpis {
  totalProyectado: number;
  totalRecaudado: number;
  saldoPendiente: number;
  totalMorosos: number;
  totalCuentas: number;
}

export interface DatoConcepto {
  name: string;
  value: number;
}

export interface DatoCanal {
  canal: string;
  monto: number;
}

export interface DatoEvolucion {
  mes: string;
  recaudado: number;
}

export interface MovimientoPago {
  id: number;
  fecha: string;
  estudiante: string;
  concepto: string;
  descripcion: string;
  tipoPago: string;
  canal: string;
  monto: number;
}

export interface ResumenFinancieroResponse {
  periodos: PeriodoOption[];
  periodoSeleccionado: number | null;
  kpis: FinanzasKpis;
  charts: {
    porConcepto: DatoConcepto[];
    porCanal: DatoCanal[];
    evolucionMensual: DatoEvolucion[];
  };
  ultimosPagos: MovimientoPago[];
}

export interface GrupoOcupacion {
  nombre: string;
  profesor: string;
  inscritos: number;
  capacidad: number;
  porcentaje: number;
}

export interface DashboardEjecutivoResponse {
  periodo: string;
  comunidad: {
    estudiantes: number;
    profesores: number;
    recepcionistas: number;
  };
  academico: {
    totalGrupos: number;
    totalMatriculas: number;
    ocupacionGrupos: GrupoOcupacion[];
  };
  finanzasResumen: {
    recaudado: number;
    pendiente: number;
  };
}
