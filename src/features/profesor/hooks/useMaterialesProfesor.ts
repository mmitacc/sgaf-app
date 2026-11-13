import { useEffect, useState } from "react";
import { toast } from "sonner";
import { profesorService } from "../services/profesorService";
import type { GrupoProfesor } from "../types/profesorType";
import { materialService } from "@/features/material-grupo/services/materialService";
import type {
  MaterialGrupo,
  TipoMaterial,
} from "@/features/material-grupo/types/materialType";
import { extraerMensajeError } from "@/services/errorHandle";

export function useMaterialesProfesor() {
  const [grupos, setGrupos] = useState<GrupoProfesor[]>([]);
  const [grupoId, setGrupoId] = useState<number | null>(null);
  const [materiales, setMateriales] = useState<MaterialGrupo[]>([]);
  const [cargando, setCargando] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<TipoMaterial>("VIDEO");
  const [url, setUrl] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    profesorService
      .obtenerMisGrupos()
      .then((data) => {
        setGrupos(data);
        if (data.length > 0) setGrupoId(data[0].id);
      })
      .catch((err) =>
        toast.error(extraerMensajeError(err, "Error al cargar tus grupos.")),
      )
      .finally(() => setCargando(false));
  }, []);

  const cargarMateriales = async (id: number) => {
    try {
      const lista = await materialService.listarPorGrupo(id);
      setMateriales(lista);
    } catch (err) {
      toast.error(
        extraerMensajeError(err, "No se pudieron cargar los materiales."),
      );
    }
  };

  useEffect(() => {
    if (grupoId) cargarMateriales(grupoId);
  }, [grupoId]);

  const handlePublicar = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!grupoId || !titulo.trim()) return;

    setGuardando(true);
    try {
      let urlFinal = url.trim();
      if (tipo === "ARCHIVO" && archivo) {
        const res = await materialService.subirArchivoCloudinary(archivo);
        urlFinal = res.url;
      }

      if (!urlFinal) {
        toast.error("Ingresa un enlace válido o selecciona un archivo.");
        return;
      }

      await materialService.crearMaterial({
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || undefined,
        tipo,
        url: urlFinal,
        id_grupo: grupoId,
      });

      toast.success("Material publicado para tus estudiantes.");
      setModalAbierto(false);
      setTitulo("");
      setDescripcion("");
      setUrl("");
      setArchivo(null);
      await cargarMateriales(grupoId);
    } catch (err) {
      toast.error(extraerMensajeError(err, "No se pudo publicar el material."));
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!grupoId) return;
    try {
      await materialService.eliminarMaterial(id);
      toast.success("Publicación eliminada.");
      await cargarMateriales(grupoId);
    } catch (err) {
      toast.error(extraerMensajeError(err, "Error al eliminar."));
    }
  };

  return {
    grupos,
    grupoId,
    setGrupoId,
    materiales,
    cargando,
    modalAbierto,
    setModalAbierto,
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    tipo,
    setTipo,
    url,
    setUrl,
    archivo,
    setArchivo,
    guardando,
    handlePublicar,
    handleEliminar,
  };
}
