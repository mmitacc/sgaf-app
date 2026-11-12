import type { Rol } from "@/features/usuario/types/usuarioType";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ClipboardCheck,
  GraduationCap,
  BookOpen,
  FileSpreadsheet,
  CalendarCheck,
  Receipt,
  type LucideIcon,
} from "lucide-react";

export interface ItemMenu {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string; // Opcional: útil para mostrar contadores o etiquetas "Nuevo"
}

export interface ConfiguracionRol {
  rutaInicial: string;
  tituloPanel: string;
  subtituloPanel: string;
  menu: ItemMenu[];
}

export const CONFIG_POR_ROL: Record<Rol, ConfiguracionRol> = {
  ADMINISTRADOR: {
    rutaInicial: "/admin/dashboard",
    tituloPanel: "Panel de Administración",
    subtituloPanel:
      "Control global académico, financiero y gestión de personal.",
    menu: [
      {
        label: "Panel General",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Gestión de Usuarios",
        path: "/usuario", // Alineado con tu ruta existente en AppRouter
        icon: Users,
      },
      {
        label: "Finanzas y Reportes",
        path: "/admin/finanzas",
        icon: Wallet,
      },
    ],
  },

  RECEPCIONISTA: {
    rutaInicial: "/recepcion/dashboard",
    tituloPanel: "Panel de Recepción y Caja",
    subtituloPanel: "Gestión de matrículas, inscripciones y cobros.",
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
      },
      {
        label: "Caja y Pagos",
        path: "/recepcion/pagos",
        icon: Receipt,
      },
      {
        label: "Directorio Estudiantes",
        path: "/recepcion/estudiantes",
        icon: GraduationCap,
      },
    ],
  },

  PROFESOR: {
    rutaInicial: "/profesor/dashboard",
    tituloPanel: "Portal Docente",
    subtituloPanel:
      "Tus asignaturas asignadas, control de asistencia y calificaciones.",
    menu: [
      {
        label: "Inicio Docente",
        path: "/profesor/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Mis Cursos Asignados",
        path: "/profesor/cursos",
        icon: BookOpen,
      },
      {
        label: "Registro de Notas",
        path: "/profesor/notas",
        icon: FileSpreadsheet,
      },
      {
        label: "Control de Asistencia",
        path: "/profesor/asistencia",
        icon: CalendarCheck,
      },
    ],
  },

  ESTUDIANTE: {
    rutaInicial: "/estudiante/dashboard",
    tituloPanel: "Portal del Estudiante",
    subtituloPanel:
      "Consulta tus asignaturas, rendimiento académico y estado de cuenta.",
    menu: [
      {
        label: "Mi Resumen",
        path: "/estudiante/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Mis Calificaciones",
        path: "/estudiante/notas",
        icon: FileSpreadsheet,
      },
      {
        label: "Estado de Cuenta",
        path: "/estudiante/pagos",
        icon: Wallet,
      },
      {
        label: "Matrícula en Línea",
        path: "/estudiante/matricula",
        icon: BookOpen,
      },
    ],
  },
};

// Helper rápido para mantener compatibilidad limpia en LoginPage y RoleRedirect
export const RUTA_INICIAL_POR_ROL: Record<Rol, string> = {
  ADMINISTRADOR: CONFIG_POR_ROL.ADMINISTRADOR.rutaInicial,
  RECEPCIONISTA: CONFIG_POR_ROL.RECEPCIONISTA.rutaInicial,
  PROFESOR: CONFIG_POR_ROL.PROFESOR.rutaInicial,
  ESTUDIANTE: CONFIG_POR_ROL.ESTUDIANTE.rutaInicial,
};
