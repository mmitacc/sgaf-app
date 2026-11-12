import api from "@/services/axios";
import type { Estudiante } from "../types/estudianteType";
import type { EstadoUsuario } from "@/features/usuario/types/usuarioType";
import type {
  DeudaEstudiante,
  Pago,
} from "@/features/recepcion/types/recepcionType";
import type {
  CrearMatriculaPayload,
  Grupo,
  GrupoEnriquecido,
  Materia,
  PeriodoDetalle,
  ProfesorDetalle,
} from "../types/matriculaType";

export interface FiltrosEstudiante {
  estado?: EstadoUsuario;
  busqueda?: string;
}

export const estudianteService = {
  obtenerTodos: async (filtros?: FiltrosEstudiante): Promise<Estudiante[]> => {
    const { data } = await api.get<Estudiante[]>("/estudiante");

    let resultado = data;

    // Filtramos por estado (ej. PENDIENTE)
    if (filtros?.estado) {
      resultado = resultado.filter((est) => est.estado === filtros.estado);
    }

    // Filtro opcional por texto (código, nombres, apellidos o email)
    if (filtros?.busqueda && filtros.busqueda.trim() !== "") {
      const termino = filtros.busqueda.toLowerCase().trim();
      resultado = resultado.filter(
        (est) =>
          est.codigo.toLowerCase().includes(termino) ||
          est.nombres.toLowerCase().includes(termino) ||
          est.apellidos.toLowerCase().includes(termino) ||
          est.email.toLowerCase().includes(termino),
      );
    }

    return resultado;
  },

  obtenerMiDeuda: async (): Promise<DeudaEstudiante> => {
    const { data } = await api.get<DeudaEstudiante>("/deuda/estudiante");
    return data;
  },

  obtenerMisPagos: async (): Promise<Pago[]> => {
    const { data } = await api.get<Pago[]>("/pago/estudiante");
    return data;
  },

  obtenerGruposDisponibles: async (): Promise<GrupoEnriquecido[]> => {
    // 1. Traemos todos los grupos
    const { data: grupos } = await api.get<Grupo[]>("/grupo");

    // 2. Extraemos IDs únicos para evitar peticiones duplicadas
    const idsMaterias = [...new Set(grupos.map((g) => g.id_materia))];
    const idsProfesores = [...new Set(grupos.map((g) => g.id_profesor))];
    const idsPeriodos = [...new Set(grupos.map((g) => g.id_periodo))];

    // 3. Consultamos todos los catálogos en paralelo
    const [materiasRes, profesoresRes, periodosRes] = await Promise.all([
      Promise.allSettled(
        idsMaterias.map((id) => api.get<Materia>(`/materia/${id}`)),
      ),
      Promise.allSettled(
        idsProfesores.map((id) => api.get<ProfesorDetalle>(`/profesor/${id}`)),
      ),
      Promise.allSettled(
        idsPeriodos.map((id) => api.get<PeriodoDetalle>(`/periodo/${id}`)),
      ),
    ]);

    // 4. Armamos diccionarios rápidos por ID
    const mapaMaterias = new Map<number, Materia>();
    materiasRes.forEach((r) => {
      if (r.status === "fulfilled")
        mapaMaterias.set(r.value.data.id, r.value.data);
    });

    const mapaProfesores = new Map<number, ProfesorDetalle>();
    profesoresRes.forEach((r) => {
      if (r.status === "fulfilled") {
        const prof = r.value.data;
        mapaProfesores.set(prof.id_usuario, prof);
      }
    });

    const mapaPeriodos = new Map<number, PeriodoDetalle>();
    periodosRes.forEach((r) => {
      if (r.status === "fulfilled")
        mapaPeriodos.set(r.value.data.id, r.value.data);
    });

    // 5. Devolvemos cada grupo con toda su información lista para mostrar
    return grupos.map((g) => ({
      ...g,
      materia: mapaMaterias.get(g.id_materia),
      profesor: mapaProfesores.get(g.id_profesor),
      periodo: mapaPeriodos.get(g.id_periodo),
    }));
  },

  matricularseEnGrupo: async (payload: CrearMatriculaPayload) => {
    const { data } = await api.post("/matricula", payload);
    return data;
  },
};
