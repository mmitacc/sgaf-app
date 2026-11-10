import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Camera,
  Save,
  User as UserIcon,
  Phone,
  Mail,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Input, PageHeader } from "@/components";
import { useAuthStore } from "../stores/useAuthStore";
import { perfilService } from "../services/perfil";
import { extraerMensajeError } from "@/services/errorHandle";

export default function ProfilePage() {
  const usuario = useAuthStore((s) => s.usuario);
  const actualizarPerfil = useAuthStore((s) => s.actualizarPerfil);
  const navigate = useNavigate();

  const [nombres, setNombres] = useState(usuario?.nombres || "");
  const [apellidos, setApellidos] = useState(usuario?.apellidos || "");
  const [telefono, setTelefono] = useState(usuario?.telefono || "");

  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    usuario?.foto_url || null,
  );
  const [guardando, setGuardando] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica de tamaño (ej. máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen no debe superar los 2MB.");
      return;
    }

    setArchivoFoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuardando(true);

    try {
      const usuarioActualizado = await perfilService.actualizar(
        {
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          telefono: telefono.trim() || undefined,
        },
        archivoFoto,
      );

      // Pasa la respuesta directa del PUT para actualizar Zustand y localStorage al instante
      await actualizarPerfil(usuarioActualizado);
      toast.success("Perfil actualizado correctamente.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(extraerMensajeError(err, "No se pudo actualizar el perfil."));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mi Perfil"
        description="Administra tu información personal y fotografía de cuenta institucional."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tarjeta izquierda: Foto y Rol */}
        <div className="flex flex-col items-center rounded-xl border border-text-muted/10 bg-bg-surface p-6 text-center shadow-sm">
          <div className="relative mb-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Avatar"
                className="h-28 w-28 rounded-full border-4 border-brand-primary/20 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-secondary/10 text-brand-secondary">
                <UserIcon className="h-12 w-12" />
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-0 bottom-0 rounded-full bg-brand-primary p-2 text-white shadow-md hover:bg-brand-primary/90 transition-colors cursor-pointer"
              title="Cambiar fotografía"
            >
              <Camera className="h-4 w-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <h2 className="text-lg font-bold text-text-base">
            {usuario?.nombres} {usuario?.apellidos}
          </h2>
          <p className="text-sm text-text-muted">{usuario?.email}</p>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary">
            <Shield className="h-3.5 w-3.5" />
            {usuario?.rol}
          </div>
        </div>

        {/* Tarjeta derecha: Formulario de datos */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-text-muted/10 bg-bg-surface p-6 shadow-sm lg:col-span-2"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
            <Input
              label="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Correo Institucional"
              value={usuario?.email || ""}
              icon={Mail}
              disabled
            />
            <Input
              label="Teléfono"
              placeholder="+51999999999"
              icon={Phone}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="flex justify-end border-t border-text-muted/10 pt-4">
            <Button type="submit" icon={Save} isLoading={guardando}>
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
