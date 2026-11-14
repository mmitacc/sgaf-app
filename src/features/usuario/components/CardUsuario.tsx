import { useState } from "react";
import type { UsuarioGenerico, Rol, EstadoUsuario } from "../types/usuarioType";
import { Button } from "@/components";
import { Pencil, Trash2, KeyRound } from "lucide-react";
import { resetearPasswordUsuario } from "../services/usuarioService";
import { extraerMensajeError } from "@/services/errorHandle";
import { toast } from "sonner";

interface CardUsuarioProps {
  usuario: UsuarioGenerico;
  onEditar?: (id: number) => void;
  onEliminar?: (usuario: UsuarioGenerico) => void;
}

const badgeRol = (rol: Rol) => {
  const estilos: Record<Rol, string> = {
    ADMINISTRADOR:
      "bg-purple-500/15 text-purple-700 border-purple-500/30 dark:text-purple-400",
    PROFESOR:
      "bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-400",
    RECEPCIONISTA:
      "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-400",
    ESTUDIANTE:
      "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  };
  return estilos[rol] || "bg-text-muted/15 text-text-muted border-text-muted/30";
};

const badgeEstado = (estado: EstadoUsuario) => {
  const estilos: Record<EstadoUsuario, string> = {
    ACTIVO: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    PENDIENTE: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    SUSPENDIDO: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
    INACTIVO: "bg-red-500/15 text-red-700 dark:text-red-400",
  };
  return estilos[estado] || "bg-text-muted/15 text-text-muted";
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

  const handleResetPassword = () => {
    const primerNombre = usuario.nombres.trim().split(" ")[0];
    const primerApellido = usuario.apellidos.trim().split(" ")[0];
    const iniciales =
      `${primerNombre.charAt(0)}${primerApellido.charAt(0)}`.toUpperCase();
    const claveTemporal = `${iniciales}.usuario123`;

    toast.warning(`¿Resetear contraseña de ${usuario.nombres}?`, {
      description: `La nueva clave temporal será: ${claveTemporal}`,
      duration: Infinity,
      action: {
        label: "Confirmar",
        onClick: async () => {
          try {
            setIsResetting(true);
            const res = await resetearPasswordUsuario(usuario.id);

            toast.success("Contraseña restablecida con éxito", {
              description: `Clave temporal: ${res.passwordTemporal}`,
              duration: 10000,
              action: {
                label: "Copiar",
                onClick: () => {
                  navigator.clipboard.writeText(res.passwordTemporal);
                  toast.info("Copiado al portapapeles");
                },
              },
            });
          } catch (err: unknown) {
            toast.error(
              extraerMensajeError(err, "Error al resetear la contraseña.")
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
    <div className="bg-bg-surface rounded-xl shadow-sm border border-text-muted/15 transition-all duration-300 flex flex-col justify-between overflow-hidden transform hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/10">
      {/* Cuerpo de la Card */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeRol(
              usuario.rol
            )}`}
          >
            {usuario.rol}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeEstado(
              usuario.estado
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
              className="w-14 h-14 rounded-full object-cover border border-text-muted/20 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-brand-primary/15 text-brand-primary font-bold flex items-center justify-center border border-brand-primary/25 text-base uppercase shrink-0">
              {usuario.nombres.charAt(0)}
              {usuario.apellidos.charAt(0)}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="font-bold text-text-base text-base truncate">
              {usuario.nombres} {usuario.apellidos}
            </h3>
            <p className="text-xs text-text-muted">
              ID: #{usuario.id} • {usuario.masculino ? "Masculino" : "Femenino"}
            </p>
          </div>
        </div>

        {/* Detalles de Contacto y Rol */}
        <div className="space-y-1.5 text-sm text-text-base border-t border-text-muted/10 pt-3">
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
      <div className="bg-bg-base/50 px-5 py-3 border-t border-text-muted/10 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon={KeyRound}
          onClick={handleResetPassword}
          isLoading={isResetting}
          className="text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          title="Resetear Contraseña"
        >
          Resetear Clave
        </Button>

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
