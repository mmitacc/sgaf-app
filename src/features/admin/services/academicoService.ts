import api from "@/services/axios";
import type {
  Periodo,
  Materia,
  Aula,
  ProfesorItem,
  Grupo,
  Horario,
  CreateGrupoPayload,
  CreateHorarioPayload,
  CreatePeriodoPayload,
  CreateMateriaPayload,
  CreateAulaPayload,
} from "../types/academicoType";

export const academicoService = {
  // --- GRUPOS ---
  obtenerGrupos: async (): Promise<Grupo[]> => {
    const { data } = await api.get<Grupo[]>("/grupo");
    return data;
  },
  crearGrupo: async (payload: CreateGrupoPayload): Promise<Grupo> => {
    const { data } = await api.post<Grupo>("/grupo", payload);
    return data;
  },
  actualizarGrupo: async (
    id: number,
    payload: Partial<CreateGrupoPayload>,
  ): Promise<Grupo> => {
    const { data } = await api.patch<Grupo>(`/grupo/${id}`, payload);
    return data;
  },
  eliminarGrupo: async (id: number): Promise<void> => {
    await api.delete(`/grupo/${id}`);
  },

  // --- HORARIOS ---
  crearHorario: async (payload: CreateHorarioPayload): Promise<Horario> => {
    const { data } = await api.post<Horario>("/horario", payload);
    return data;
  },
  eliminarHorario: async (id: number): Promise<void> => {
    await api.delete(`/horario/${id}`);
  },

  // --- PERIODOS ---
  obtenerPeriodos: async (): Promise<Periodo[]> => {
    const { data } = await api.get<Periodo[]>("/periodo");
    return data;
  },
  crearPeriodo: async (payload: CreatePeriodoPayload): Promise<Periodo> => {
    const { data } = await api.post<Periodo>("/periodo", payload);
    return data;
  },
  actualizarPeriodo: async (
    id: number,
    payload: Partial<CreatePeriodoPayload>,
  ): Promise<Periodo> => {
    const { data } = await api.patch<Periodo>(`/periodo/${id}`, payload);
    return data;
  },
  eliminarPeriodo: async (id: number): Promise<void> => {
    await api.delete(`/periodo/${id}`);
  },

  // --- MATERIAS ---
  obtenerMaterias: async (): Promise<Materia[]> => {
    const { data } = await api.get<Materia[]>("/materia");
    return data;
  },
  crearMateria: async (payload: CreateMateriaPayload): Promise<Materia> => {
    const { data } = await api.post<Materia>("/materia", payload);
    return data;
  },
  actualizarMateria: async (
    id: number,
    payload: Partial<CreateMateriaPayload>,
  ): Promise<Materia> => {
    const { data } = await api.patch<Materia>(`/materia/${id}`, payload);
    return data;
  },
  eliminarMateria: async (id: number): Promise<void> => {
    await api.delete(`/materia/${id}`);
  },

  // --- AULAS ---
  obtenerAulas: async (): Promise<Aula[]> => {
    const { data } = await api.get<Aula[]>("/aula");
    return data;
  },
  crearAula: async (payload: CreateAulaPayload): Promise<Aula> => {
    const { data } = await api.post<Aula>("/aula", payload);
    return data;
  },
  actualizarAula: async (
    id: number,
    payload: Partial<CreateAulaPayload>,
  ): Promise<Aula> => {
    const { data } = await api.patch<Aula>(`/aula/${id}`, payload);
    return data;
  },
  eliminarAula: async (id: number): Promise<void> => {
    await api.delete(`/aula/${id}`);
  },

  // --- PROFESORES ---
  obtenerProfesores: async (): Promise<ProfesorItem[]> => {
    const { data } = await api.get<ProfesorItem[]>("/profesor");
    return data;
  },
};
