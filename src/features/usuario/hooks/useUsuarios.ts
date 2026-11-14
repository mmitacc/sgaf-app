import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { obtenerUsuarios, eliminarUsuario } from "../services/usuarioService";
import { extraerMensajeError } from "@/services/errorHandle";
import type { UsuarioGenerico, Rol, EstadoUsuario } from "../types/usuarioType";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioGenerico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState<Rol | "TODOS">("TODOS");
  const [filtroEstado, setFiltroEstado] = useState<EstadoUsuario | "TODOS">("TODOS");

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (err: unknown) {
      setError(extraerMensajeError(err, "Error al cargar la lista de usuarios."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const coincideTexto =
        `${u.nombres} ${u.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        (u.telefono && u.telefono.includes(busqueda));

      const coincideRol = filtroRol === "TODOS" || u.rol === filtroRol;
      const coincideEstado = filtroEstado === "TODOS" || u.estado === filtroEstado;

      return coincideTexto && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  const handleEliminar = (usuario: UsuarioGenerico) => {
    toast.warning(`¿Eliminar a ${usuario.nombres} ${usuario.apellidos}?`, {
      description: `Esta acción eliminará al ${usuario.rol.toLowerCase()} permanentemente.`,
      duration: Infinity,
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await eliminarUsuario(usuario.id);
            setUsuarios((prev) => prev.filter((item) => item.id !== usuario.id));
            toast.success(`Usuario ${usuario.nombres} eliminado correctamente.`);
          } catch (err: unknown) {
            toast.error(extraerMensajeError(err, "No se pudo eliminar el usuario."));
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => toast.dismiss(),
      },
    });
  };

  return {
    usuarios,
    usuariosFiltrados,
    loading,
    error,
    busqueda,
    setBusqueda,
    filtroRol,
    setFiltroRol,
    filtroEstado,
    setFiltroEstado,
    handleEliminar,
  };
}
