import type { Rol } from "@/features/usuario/types/usuarioType";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ClipboardCheck,
  GraduationCap,
  BookOpen,
  FileSpreadsheet,
  Receipt,
  BookOpenCheck,
  type LucideIcon,
  FolderKanban,
  BarChart3,
} from "lucide-react";

export interface ItemMenu {
  label: string;
  path: string;
  icon: LucideIcon;
  descripcion?: string;
  badge?: string;
}

export interface ConfiguracionRol {
  rutaInicial: string;
  tituloPanel: string;
  subtituloPanel: string;
  etiquetaRol: string;
  menu: ItemMenu[];
}

export const CONFIG_POR_ROL: Record<Rol, ConfiguracionRol> = {
  ADMINISTRADOR: {
    rutaInicial: "/admin/dashboard",
    tituloPanel: "Panel de Administración",
    subtituloPanel:
      "Control global académico, financiero y gestión de personal.",
    etiquetaRol: "Administración Central",
    menu: [
      {
        label: "Panel General",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Gestión de Usuarios",
        path: "/usuario",
        icon: Users,
        descripcion:
          "Administra cuentas, roles y permisos de docentes, estudiantes y personal.",
      },
      {
        label: "Estadísticas Globales",
        path: "/admin/estadisticas",
        icon: BarChart3,
        descripcion:
          "Visualiza métricas de comunidad estudiantil, plana docente y ocupación de grupos.",
      },
      {
        label: "Finanzas y Reportes",
        path: "/admin/finanzas",
        icon: Wallet,
        descripcion:
          "Supervisa recaudación global, historial de pagos y reportes financieros.",
      },
    ],
  },

  RECEPCIONISTA: {
    rutaInicial: "/recepcion/dashboard",
    tituloPanel: "Panel de Recepción y Caja",
    subtituloPanel: "Gestión de matrículas, inscripciones y cobros.",
    etiquetaRol: "Atención y Caja",
    menu: [
      {
        label: "Inicio Recepción",
        path: "/recepcion/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Matrículas e Inscripciones",
        path: "/recepcion/matriculas",
        icon: ClipboardCheck,
        descripcion:
          "Valida pagos de matrícula inicial y activa estudiantes pendientes.",
      },
      {
        label: "Caja y Pagos",
        path: "/recepcion/pagos",
        icon: Receipt,
        descripcion:
          "Registra cobros de mensualidades, matrículas y consulta estados de cuenta.",
      },
      // {
      //   label: "Directorio Estudiantes",
      //   path: "/recepcion/estudiantes",
      //   icon: GraduationCap,
      //   descripcion:
      //     "Consulta datos de contacto, estado académico y situación financiera.",
      // },
    ],
  },

  PROFESOR: {
    rutaInicial: "/profesor/dashboard",
    tituloPanel: "Portal Docente",
    subtituloPanel:
      "Tus asignaturas asignadas, control de asistencia y calificaciones.",
    etiquetaRol: "Plana Docente",
    menu: [
      {
        label: "Inicio Docente",
        path: "/profesor/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Mis Grupos Asignados",
        path: "/profesor/grupos",
        icon: BookOpen,
        descripcion:
          "Revisa tus secciones asignadas, métricas y nómina de estudiantes.",
      },
      {
        label: "Materiales de Clase",
        path: "/profesor/materiales",
        icon: FolderKanban,
        descripcion:
          "Publica enlaces de videos, diapositivas y recursos de cada sesión.",
      },
      {
        label: "Tareas y Evaluaciones",
        path: "/profesor/tareas-grupo",
        icon: FileSpreadsheet,
        descripcion:
          "Publica nuevas actividades, revisa archivos enviados y registra notas.",
      },
    ],
  },

  ESTUDIANTE: {
    rutaInicial: "/estudiante/dashboard",
    tituloPanel: "Portal del Estudiante",
    subtituloPanel:
      "Consulta tus asignaturas, rendimiento académico y estado de cuenta.",
    etiquetaRol: "Comunidad Estudiantil",
    menu: [
      {
        label: "Mi Resumen",
        path: "/estudiante/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Aula Virtual",
        path: "/estudiante/aula-virtual",
        icon: BookOpenCheck,
        descripcion:
          "Accede a tus cursos inscritos, lee instrucciones y sube tus entregas.",
      },
      {
        label: "Mis Calificaciones",
        path: "/estudiante/notas",
        icon: FileSpreadsheet,
        descripcion:
          "Consulta tus notas por asignatura, evaluaciones y promedio ponderado.",
      },
      {
        label: "Estado de Cuenta",
        path: "/estudiante/pagos",
        icon: Wallet,
        descripcion:
          "Revisa tus cuotas pendientes, historial de pagos y paga en línea.",
      },
      {
        label: "Matrícula en Línea",
        path: "/estudiante/matricula",
        icon: BookOpen,
        descripcion:
          "Inscríbete en los grupos disponibles y arma tu carga académica del ciclo.",
      },
    ],
  },
};

export const RUTA_INICIAL_POR_ROL: Record<Rol, string> = {
  ADMINISTRADOR: CONFIG_POR_ROL.ADMINISTRADOR.rutaInicial,
  RECEPCIONISTA: CONFIG_POR_ROL.RECEPCIONISTA.rutaInicial,
  PROFESOR: CONFIG_POR_ROL.PROFESOR.rutaInicial,
  ESTUDIANTE: CONFIG_POR_ROL.ESTUDIANTE.rutaInicial,
};
