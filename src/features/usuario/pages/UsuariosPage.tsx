import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { obtenerUsuarios, eliminarUsuario } from "../services/usuarioService";
import type { UsuarioGenerico, Rol, EstadoUsuario } from "../types/usuarioType";
import { Button } from "@/components";
import { UserPlus } from "lucide-react";
import { CardUsuario } from "../components/CardUsuario";
import { toast } from "sonner";

export function UsuariosPage() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<UsuarioGenerico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState<Rol | "TODOS">("TODOS");
  const [filtroEstado, setFiltroEstado] = useState<EstadoUsuario | "TODOS">(
    "TODOS",
  );

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error al cargar la lista de usuarios.",
      );
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
        `${u.nombres} ${u.apellidos}`
          .toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        (u.telefono && u.telefono.includes(busqueda));

      const coincideRol = filtroRol === "TODOS" || u.rol === filtroRol;
      const coincideEstado =
        filtroEstado === "TODOS" || u.estado === filtroEstado;

      return coincideTexto && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, filtroRol, filtroEstado]);

  const handleEliminar = (usuario: UsuarioGenerico) => {
    // 1. Toast de confirmación con Sonner
    toast.warning(`¿Eliminar a ${usuario.nombres} ${usuario.apellidos}?`, {
      description: `Esta acción eliminará al ${usuario.rol.toLowerCase()} permanentemente.`,
      duration: Infinity, // No se cierra solo para forzar la confirmación
      action: {
        label: "Eliminar",
        onClick: async () => {
          try {
            await eliminarUsuario(usuario.id);

            // Actualizamos el estado en memoria para removerlo de las Cards al instante
            setUsuarios((prev) =>
              prev.filter((item) => item.id !== usuario.id),
            );

            // 2. Toast de éxito
            toast.success(
              `Usuario ${usuario.nombres} eliminado correctamente.`,
            );
          } catch (err: any) {
            // 3. Toast de error
            toast.error(
              err.response?.data?.message || "No se pudo eliminar el usuario.",
            );
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => toast.dismiss(),
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-gray-500">
            Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
            registrados.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={UserPlus}
          onClick={() => navigate("/usuario/nuevo")}
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-bg-surface p-4 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre, apellido, correo o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-bg-base border border-slate-200 dark:border-slate-700 text-text-base rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
            Rol
          </label>
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value as Rol | "TODOS")}
            className="w-full bg-bg-base border border-slate-200 dark:border-slate-700 text-text-base rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
          >
            <option value="TODOS">Todos los roles</option>
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="PROFESOR">Profesor</option>
            <option value="RECEPCIONISTA">Recepcionista</option>
            <option value="ADMINISTRADOR">Administrador</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
            Estado
          </label>
          <select
            value={filtroEstado}
            onChange={(e) =>
              setFiltroEstado(e.target.value as EstadoUsuario | "TODOS")
            }
            className="w-full bg-bg-base border border-slate-200 dark:border-slate-700 text-text-base rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="SUSPENDIDO">Suspendido</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Grid de Cards */}
      {loading ? (
        <div className="p-12 text-center text-text-muted bg-bg-surface rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800">
          Cargando usuarios...
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="p-12 text-center text-text-muted bg-bg-surface rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800">
          No se encontraron usuarios con los filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {usuariosFiltrados.map((usuario) => (
            <CardUsuario
              key={usuario.id}
              usuario={usuario}
              onEditar={(id) => navigate(`/usuario/editar/${id}`)}
              onEliminar={handleEliminar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
