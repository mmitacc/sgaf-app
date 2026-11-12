export interface EstudianteGrupo {
  id: number;
  id_estudiante: number;
  created: string;
  estudiante: {
    id_usuario: number;
    usuario: {
      nombres: string;
      apellidos: string;
      correo?: string;
    };
  };
}

export interface EntregaAlumno {
  id: number;
  respuesta?: string | null;
  archivo_url?: string | null;
  calificacion: number | null;
  id_estudiante: number;
  id_tarea: number;
  created: string;
  estudiante: {
    id_usuario: number;
    usuario: {
      nombres: string;
      apellidos: string;
    };
  };
}

export interface TareaGrupo {
  id: number;
  nombre: string;
  instrucciones: string;
  fecha_entrega: string;
  id_grupo: number;
  entregas: EntregaAlumno[];
}

export interface GrupoProfesor {
  id: number;
  capacidad: number;
  materia: {
    id: number;
    nombre: string;
    creditos: number;
  };
  periodo: {
    id: number;
    nombre: string;
  };
  aula: {
    id: number;
    nombre: string;
  };
  matriculas: EstudianteGrupo[];
  tareas: TareaGrupo[];
}

export interface PayloadNuevaTarea {
  nombre: string;
  instrucciones: string;
  fecha_entrega: string;
  id_grupo: number;
}
