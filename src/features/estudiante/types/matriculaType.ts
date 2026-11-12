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

export interface MatriculaActiva {
  id_matricula: number;
  id_grupo: number;
  estado: string;
}

export interface EntregaTarea {
  id: number;
  calificacion: number | null;
  created: string;
}

export interface TareaConEntrega {
  id: number;
  nombre: string;
  fecha_entrega: string;
  entregas: EntregaTarea[];
}

// export interface MatriculaConDetalle {
//   id: number;
//   id_estudiante: number;
//   id_grupo: number;
//   created: string;
//   grupo: {
//     id: number;
//     capacidad: number;
//     id_profesor: number;
//     id_aula: number;
//     id_materia: number;
//     id_periodo: number;
//     materia: {
//       id: number;
//       nombre: string;
//       creditos: number;
//       mensualidad: number;
//     };
//     periodo: {
//       id: number;
//       nombre: string;
//       max_creditos: number;
//     };
//     profesor: {
//       id_usuario: number;
//       usuario: {
//         nombres: string;
//         apellidos: string;
//       };
//     };
//     aula: {
//       id: number;
//       nombre: string;
//     };
//     tareas: TareaConEntrega[];
//   };
// }

export interface EntregaTarea {
  id: number;
  respuesta?: string | null;
  archivo_url?: string | null;
  calificacion: number | null;
  created: string;
  updated?: string;
}

export interface TareaConEntrega {
  id: number;
  nombre: string;
  instrucciones: string;
  fecha_entrega: string;
  entregas: EntregaTarea[];
}

export interface HorarioGrupo {
  id: number;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface MatriculaConDetalle {
  id: number;
  id_estudiante: number;
  id_grupo: number;
  created: string;
  grupo: {
    id: number;
    capacidad: number;
    id_profesor: number;
    id_aula: number;
    id_materia: number;
    id_periodo: number;
    materia: {
      id: number;
      nombre: string;
      creditos: number;
      mensualidad: number;
    };
    periodo: {
      id: number;
      nombre: string;
      max_creditos: number;
    };
    profesor: {
      id_usuario: number;
      usuario: {
        nombres: string;
        apellidos: string;
      };
    };
    aula: {
      id: number;
      nombre: string;
    };
    horarios?: HorarioGrupo[];
    tareas: TareaConEntrega[];
  };
}

export interface PayloadEntrega {
  id_tarea: number;
  respuesta?: string;
  archivo_url?: string;
}
