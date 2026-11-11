import React, { useState } from "react";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components";
import { cambiarPasswordService } from "../services/perfil";
import { toast } from "sonner";

export function CambiarPasswordCard() {
  const [passForm, setPassForm] = useState({
    passwordActual: "",
    passwordNueva: "",
    confirmarPassword: "",
  });
  const [loadingPass, setLoadingPass] = useState(false);
  const [mostrarPasswords, setMostrarPasswords] = useState(false);

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passForm.passwordNueva !== passForm.confirmarPassword) {
      toast.info("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    try {
      setLoadingPass(true);
      await cambiarPasswordService({
        passwordActual: passForm.passwordActual,
        passwordNueva: passForm.passwordNueva,
      });
      toast.success("¡Contraseña actualizada correctamente!");
      setPassForm({
        passwordActual: "",
        passwordNueva: "",
        confirmarPassword: "",
      });
      setMostrarPasswords(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Error al cambiar la contraseña.",
      );
    } finally {
      setLoadingPass(false);
    }
  };

  const tipoInput = mostrarPasswords ? "text" : "password";

  return (
    <div className="bg-slate-50/80 dark:bg-slate-900/50 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 mt-6">
      {/* Encabezado con el botón de Mostrar / Ocultar */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-bold text-gray-800">
            Seguridad y Contraseña
          </h2>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon={mostrarPasswords ? EyeOff : Eye}
          onClick={() => setMostrarPasswords((prev) => !prev)}
        >
          {mostrarPasswords ? "Ocultar" : "Mostrar"}
        </Button>
      </div>

      <form
        onSubmit={handleCambiarPassword}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña Actual
          </label>
          <input
            type={tipoInput}
            required
            value={passForm.passwordActual}
            onChange={(e) =>
              setPassForm({ ...passForm, passwordActual: e.target.value })
            }
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva Contraseña
          </label>
          <input
            type={tipoInput}
            required
            minLength={6}
            value={passForm.passwordNueva}
            onChange={(e) =>
              setPassForm({ ...passForm, passwordNueva: e.target.value })
            }
            placeholder="Mínimo 6 caracteres"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Nueva Contraseña
          </label>
          <input
            type={tipoInput}
            required
            minLength={6}
            value={passForm.confirmarPassword}
            onChange={(e) =>
              setPassForm({ ...passForm, confirmarPassword: e.target.value })
            }
            placeholder="Repite la nueva contraseña"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          />
        </div>

        <div className="md:col-span-3 flex justify-end mt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Lock}
            isLoading={loadingPass}
          >
            Actualizar Contraseña
          </Button>
        </div>
      </form>
    </div>
  );
}
