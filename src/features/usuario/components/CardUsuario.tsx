import { useState } from "react";
import type { UsuarioGenerico, Rol, EstadoUsuario } from "../types/usuarioType";
import { Button } from "@/components";
import { Pencil, Trash2, KeyRound } from "lucide-react";
import { resetearPasswordUsuario } from "../services/usuarioService";
import { toast } from "sonner";

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
  const [isResetting, setIsResetting] = useState(false);

  const fechaContratoLimpia = usuario.fecha_contrato
    ? usuario.fecha_contrato.slice(0, 10)
    : "Sin fecha";

  // Función de reseteo de contraseña
  const handleResetPassword = () => {
    const primerNombre = usuario.nombres.trim().split(" ")[0];
    const primerApellido = usuario.apellidos.trim().split(" ")[0];
    const iniciales =
      `${primerNombre.charAt(0)}${primerApellido.charAt(0)}`.toUpperCase();
    const claveTemporal = `${iniciales}.usuario123`;

    // 1. Lanzamos un toast de advertencia/confirmación
    toast.warning(`¿Resetear contraseña de ${usuario.nombres}?`, {
      description: `La nueva clave temporal será: ${claveTemporal}`,
      duration: Infinity, // No se cierra automáticamente para forzar la decisión
      action: {
        label: "Confirmar",
        onClick: async () => {
          try {
            setIsResetting(true);
            const res = await resetearPasswordUsuario(usuario.id);

            // 2. Toast de éxito con botón de copiado rápido
            toast.success("Contraseña restablecida con éxito", {
              description: `Clave temporal: ${res.passwordTemporal}`,
              duration: 10000, // 10 segundos visibles
              action: {
                label: "Copiar",
                onClick: () => {
                  navigator.clipboard.writeText(res.passwordTemporal);
                  toast.info("Copiado al portapapeles");
                },
              },
            });
          } catch (err: any) {
            toast.error(
              err.response?.data?.message || "Error al resetear la contraseña.",
            );
          } finally {
            setIsResetting(false);
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
    <div className="bg-bg-surface rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between overflow-hidden transform hover:-translate-y-1 hover:bg-white dark:hover:bg-zinc-900 hover:border-brand-primary/40 dark:hover:border-brand-primary/50 hover:shadow-xl hover:shadow-brand-primary/10 dark:hover:shadow-brand-primary/5">
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
              className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center border border-blue-200 dark:border-blue-900 text-base uppercase shrink-0">
              {usuario.nombres.charAt(0)}
              {usuario.apellidos.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="font-bold text-text-base text-base truncate">
              {usuario.nombres} {usuario.apellidos}
            </h3>
            <p className="text-xs text-text-muted/80">
              ID: #{usuario.id} • {usuario.masculino ? "Masculino" : "Femenino"}
            </p>
          </div>
        </div>

        {/* Detalles de Contacto y Rol */}
        <div className="space-y-1.5 text-sm text-text-base border-t border-slate-200/60 dark:border-slate-800 pt-3">
          <p className="truncate">
            <span className="font-semibold text-text-muted mr-1">Correo:</span>{" "}
            {usuario.email}
          </p>
          <p>
            <span className="font-semibold text-text-muted mr-1">
              Teléfono:
            </span>{" "}
            {usuario.telefono || "No registrado"}
          </p>

          {usuario.rol === "ESTUDIANTE" && usuario.apoderado && (
            <p className="truncate">
              <span className="font-semibold text-text-muted mr-1">
                Apoderado:
              </span>{" "}
              {usuario.apoderado}
            </p>
          )}

          {usuario.rol === "PROFESOR" && (
            <p>
              <span className="font-semibold text-text-muted mr-1">
                Contrato:
              </span>{" "}
              {fechaContratoLimpia}
            </p>
          )}
        </div>
      </div>

      {/* Pie de la Card (Acciones) */}
      <div className="bg-slate-50/50 dark:bg-zinc-900/40 px-5 py-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
        <div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={KeyRound}
            onClick={handleResetPassword}
            isLoading={isResetting}
            className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
            title="Resetear Contraseña"
          >
            Resetear Clave
          </Button>
        </div>

        <div className="flex items-center gap-2">
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
      </div>
    </div>
  );
}
