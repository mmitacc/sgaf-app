import type { UsuarioGenerico, Rol, EstadoUsuario } from "../types/usuarioType";
import { Button } from "@/components";
import { Pencil, Trash2 } from "lucide-react";

// En el pie de CardUsuario.tsx:

interface CardUsuarioProps {
  usuario: UsuarioGenerico;
  onEditar?: (id: number) => void;
  onEliminar?: (usuario: UsuarioGenerico) => void;
}

const badgeRol = (rol: Rol) => {
  const estilos: Record<Rol, string> = {
    ADMINISTRADOR: "bg-purple-100 text-purple-800 border-purple-200",
    PROFESOR: "bg-blue-100 text-blue-800 border-blue-200",
    RECEPCIONISTA: "bg-amber-100 text-amber-800 border-amber-200",
    ESTUDIANTE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  return estilos[rol] || "bg-gray-100 text-gray-800";
};

const badgeEstado = (estado: EstadoUsuario) => {
  const estilos: Record<EstadoUsuario, string> = {
    ACTIVO: "bg-green-100 text-green-800",
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    SUSPENDIDO: "bg-orange-100 text-orange-800",
    INACTIVO: "bg-red-100 text-red-800",
  };
  return estilos[estado] || "bg-gray-100 text-gray-800";
};

export function CardUsuario({
  usuario,
  onEditar,
  onEliminar,
}: CardUsuarioProps) {
  const fechaContratoLimpia = usuario.fecha_contrato
    ? usuario.fecha_contrato.slice(0, 10)
    : "Sin fecha";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between overflow-hidden">
      {/* Cuerpo de la Card */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeRol(
              usuario.rol,
            )}`}
          >
            {usuario.rol}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeEstado(
              usuario.estado,
            )}`}
          >
            {usuario.estado}
          </span>
        </div>

        {/* Avatar e Identidad */}
        <div className="flex items-center gap-3.5 mb-4">
          {usuario.foto_url ? (
            <img
              src={usuario.foto_url}
              alt={`${usuario.nombres} ${usuario.apellidos}`}
              className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200 text-base uppercase shrink-0">
              {usuario.nombres.charAt(0)}
              {usuario.apellidos.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-base truncate">
              {usuario.nombres} {usuario.apellidos}
            </h3>
            <p className="text-xs text-gray-400">
              ID: #{usuario.id} • {usuario.masculino ? "Masculino" : "Femenino"}
            </p>
          </div>
        </div>

        {/* Detalles de Contacto y Rol */}
        <div className="space-y-1.5 text-sm text-gray-600 border-t border-gray-100 pt-3">
          <p className="truncate">
            <span className="font-medium text-gray-800">Correo:</span>{" "}
            {usuario.email}
          </p>
          <p>
            <span className="font-medium text-gray-800">Teléfono:</span>{" "}
            {usuario.telefono || "No registrado"}
          </p>

          {usuario.rol === "ESTUDIANTE" && usuario.apoderado && (
            <p className="truncate">
              <span className="font-medium text-gray-800">Apoderado:</span>{" "}
              {usuario.apoderado}
            </p>
          )}

          {usuario.rol === "PROFESOR" && (
            <p>
              <span className="font-medium text-gray-800">Contrato:</span>{" "}
              {fechaContratoLimpia}
            </p>
          )}
        </div>
      </div>

      {/* Pie de la Card (Solo se muestra si se pasan acciones) */}

      {(onEditar || onEliminar) && (
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
          {onEditar && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Pencil}
              onClick={() => onEditar(usuario.id)}
            >
              Editar
            </Button>
          )}

          {onEliminar && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => onEliminar(usuario)}
            >
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
