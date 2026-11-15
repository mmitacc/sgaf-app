import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { academicoService } from "../services/academicoService";
import { extraerMensajeError } from "@/services/errorHandle";
import type {
  Grupo,
  Periodo,
  Materia,
  Aula,
  ProfesorItem,
} from "../types/academicoType";

export type TabAcademico = "GRUPOS" | "PERIODOS" | "CATALOGOS";

export function useAdminAcademico() {
  const [tabActiva, setTabActiva] = useState<TabAcademico>("GRUPOS");
  const [loading, setLoading] = useState(true);

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [profesores, setProfesores] = useState<ProfesorItem[]>([]);

  const [filtroPeriodo, setFiltroPeriodo] = useState<number | "TODOS">("TODOS");
  const [busqueda, setBusqueda] = useState("");

  const cargarTodo = useCallback(async () => {
    try {
      setLoading(true);
      const [gData, pData, mData, aData, profData] = await Promise.all([
        academicoService.obtenerGrupos(),
        academicoService.obtenerPeriodos(),
        academicoService.obtenerMaterias(),
        academicoService.obtenerAulas(),
        academicoService.obtenerProfesores(),
      ]);
      setGrupos(gData);
      setPeriodos(pData);
      setMaterias(mData);
      setAulas(aData);
      setProfesores(profData);
    } catch (error) {
      toast.error(
        extraerMensajeError(error, "Error al cargar la estructura académica."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const gruposFiltrados = useMemo(() => {
    return grupos.filter((g) => {
      const coincidePeriodo =
        filtroPeriodo === "TODOS" || g.id_periodo === filtroPeriodo;
      const nombreMateria = g.materia?.nombre?.toLowerCase() ?? "";
      const nombreAula = g.aula?.nombre?.toLowerCase() ?? "";
      const profNombre =
        `${g.profesor?.nombres ?? g.profesor?.usuario?.nombres ?? ""} ${
          g.profesor?.apellidos ?? g.profesor?.usuario?.apellidos ?? ""
        }`.toLowerCase();

      const term = busqueda.toLowerCase().trim();
      const coincideTexto =
        !term ||
        nombreMateria.includes(term) ||
        nombreAula.includes(term) ||
        profNombre.includes(term);

      return coincidePeriodo && coincideTexto;
    });
  }, [grupos, filtroPeriodo, busqueda]);

  const confirmarEliminacion = (
    titulo: string,
    onConfirm: () => Promise<void>,
  ) => {
    toast.warning(`¿Eliminar ${titulo}?`, {
      description: "Esta acción realizará una baja lógica en el sistema.",
      duration: Infinity,
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await onConfirm();
            toast.success(`${titulo} eliminado correctamente.`);
            cargarTodo();
          } catch (error) {
            toast.error(
              extraerMensajeError(error, "No se pudo eliminar el registro."),
            );
          }
        },
      },
      cancel: { label: "Cancelar", onClick: () => toast.dismiss() },
    });
  };

  return {
    tabActiva,
    setTabActiva,
    loading,
    gruposFiltrados,
    periodos,
    materias,
    aulas,
    profesores,
    filtroPeriodo,
    setFiltroPeriodo,
    busqueda,
    setBusqueda,
    cargarTodo,
    confirmarEliminacion,
  };
}
