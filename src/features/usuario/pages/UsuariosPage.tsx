import { useNavigate } from "react-router";
import { UserPlus } from "lucide-react";
import { Button } from "@/components";
import { CardUsuario } from "../components/CardUsuario";
import { useUsuarios } from "../hooks/useUsuarios";
import type { Rol, EstadoUsuario } from "../types/usuarioType";

export function UsuariosPage() {
  const navigate = useNavigate();
  const {
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
  } = useUsuarios();

  const controlClass =
    "w-full bg-bg-base border border-text-muted/20 text-text-base rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all";

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-base">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-text-muted">
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

      <div className="bg-bg-surface p-4 rounded-xl shadow-sm border border-text-muted/15 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nombre, apellido, correo o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={controlClass}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-muted uppercase mb-1">
            Rol
          </label>
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value as Rol | "TODOS")}
            className={controlClass}
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
            className={controlClass}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="SUSPENDIDO">Suspendido</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-red-500/30 bg-red-500/15 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-text-muted bg-bg-surface rounded-xl shadow-sm border border-text-muted/15">
          Cargando usuarios...
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="p-12 text-center text-text-muted bg-bg-surface rounded-xl shadow-sm border border-text-muted/15">
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
