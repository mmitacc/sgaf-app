export interface Grupo {
  id: number;
  capacidad: number;
  id_profesor: number;
  id_aula: number;
  id_materia: number;
  id_periodo: number;
  created: string;
}

export interface Materia {
  id: number;
  nombre: string;
  creditos: number;
  mensualidad: number;
  created: string;
}

export interface ProfesorDetalle {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  email: string;
  foto_url: string | null;
}

export interface PeriodoDetalle {
  id: number;
  nombre: string;
  meses: number;
  inicio: string;
  fin: string;
  max_creditos: number;
  matricula: number;
}

export interface GrupoEnriquecido extends Grupo {
  materia?: Materia;
  profesor?: ProfesorDetalle;
  periodo?: PeriodoDetalle;
}

export interface CrearMatriculaPayload {
  id_grupo: number;
}
