export type DiaSemana =
  | "LUNES"
  | "MARTES"
  | "MIERCOLES"
  | "JUEVES"
  | "VIERNES"
  | "SABADO";

export interface Periodo {
  id: number;
  nombre: string;
  meses: number;
  inicio: string;
  fin: string;
  max_creditos: number;
  matricula: number | string;
}

export interface Materia {
  id: number;
  nombre: string;
  creditos: number;
  mensualidad: number | string;
}

export interface Aula {
  id: number;
  nombre: string;
  capacidad: number;
}

export interface ProfesorItem {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  email: string;
  especialidad?: string;
}

export interface Horario {
  id?: number;
  dia: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
  id_grupo?: number;
}

export interface Grupo {
  id: number;
  capacidad: number;
  id_profesor: number;
  id_aula: number;
  id_materia: number;
  id_periodo: number;
  profesor?: {
    id_usuario: number;
    usuario?: { nombres: string; apellidos: string };
    nombres?: string;
    apellidos?: string;
  };
  aula?: Aula;
  materia?: Materia;
  periodo?: Periodo;
  horarios?: Horario[];
  _count?: { matriculas?: number };
}

export interface CreateGrupoPayload {
  capacidad: number;
  id_profesor: number;
  id_aula: number;
  id_materia: number;
  id_periodo: number;
}

export interface CreateHorarioPayload {
  dia: DiaSemana;
  hora_inicio: string;
  hora_fin: string;
  id_grupo: number;
}

export interface CreatePeriodoPayload {
  nombre: string;
  meses: number;
  inicio: string;
  fin: string;
  max_creditos: number;
  matricula: number;
}

export interface CreateMateriaPayload {
  nombre: string;
  creditos: number;
  mensualidad: number;
}

export interface CreateAulaPayload {
  nombre: string;
  capacidad: number;
}
