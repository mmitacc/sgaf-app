import React, { useState, useEffect } from "react";
import type {
  UsuarioGenerico,
  FormularioUsuarioValues,
  EspecialidadOption,
} from "../types/usuarioType";
import { Button } from "@/components";
import { Save } from "lucide-react";

interface FormularioUsuarioProps {
  modo: "PUBLICO_ESTUDIANTE" | "ADMIN_USUARIO";
  esEdicion?: boolean;
  initialData?: Partial<UsuarioGenerico>;
  especialidades?: EspecialidadOption[];
  loading?: boolean;
  titulo?: string;
  textoBoton?: string;
  onSubmit: (values: FormularioUsuarioValues) => Promise<void>;
}

export const FormularioUsuario = ({
  modo,
  esEdicion = false,
  initialData,
  especialidades = [],
  loading = false,
  titulo,
  textoBoton,
  onSubmit,
}: FormularioUsuarioProps) => {
  const [form, setForm] = useState<FormularioUsuarioValues>({
    nombres: "",
    apellidos: "",
    telefono: "+51",
    email: "",
    password: "",
    rol: modo === "ADMIN_USUARIO" ? "PROFESOR" : "ESTUDIANTE",
    masculino: true,
    estado: "PENDIENTE",
    foto_url: "",
    fotoFile: null,
    fecha_contrato: "",
    id_especialidad: undefined,
    apoderado: "",
  });

  // Precargar datos si estamos en modo edición
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        nombres: initialData.nombres ?? "",
        apellidos: initialData.apellidos ?? "",
        telefono: initialData.telefono ?? "+51",
        email: initialData.email ?? "",
        password: "", // Siempre vacío por seguridad al editar
        rol: initialData.rol ?? "ESTUDIANTE",
        masculino: initialData.masculino ?? true,
        estado: initialData.estado ?? "ACTIVO",
        foto_url: initialData.foto_url ?? "",
        fecha_contrato: initialData.fecha_contrato
          ? initialData.fecha_contrato.split("T")[0] // Formatea ISO date a YYYY-MM-DD
          : "",
        id_especialidad: initialData.id_especialidad,
        apoderado: initialData.apoderado ?? "",
      }));
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "masculino"
          ? value === "true"
          : name === "id_especialidad"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, fotoFile: file }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const esModoPublico = modo === "PUBLICO_ESTUDIANTE";
  const mostrarApoderado =
    esModoPublico || (esEdicion && form.rol === "ESTUDIANTE");
  const mostrarProfesor = !esModoPublico && form.rol === "PROFESOR";

  const labelBoton =
    textoBoton || (esEdicion ? "Guardar Cambios" : "Registrar");

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow"
    >
      {titulo && <h2 className="text-2xl font-bold text-gray-800">{titulo}</h2>}

      {/* Datos Personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombres
          </label>
          <input
            type="text"
            name="nombres"
            required
            value={form.nombres}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apellidos
          </label>
          <input
            type="text"
            name="apellidos"
            required
            value={form.apellidos}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Género
          </label>
          <select
            name="masculino"
            value={String(form.masculino)}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
          >
            <option value="true">Masculino</option>
            <option value="false">Femenino</option>
          </select>
        </div>
      </div>

      {/* Credenciales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {esEdicion ? "Nueva Contraseña (opcional)" : "Contraseña"}
          </label>
          <input
            type="password"
            name="password"
            required={!esEdicion}
            minLength={6}
            placeholder={
              esEdicion ? "Dejar vacío para mantener actual" : "******"
            }
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Rol y Estado (Solo Admin) */}
      {!esModoPublico && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              disabled={esEdicion && form.rol === "ESTUDIANTE"}
              className="mt-1 w-full border rounded-md p-2"
            >
              {esEdicion && form.rol === "ESTUDIANTE" && (
                <option value="ESTUDIANTE">Estudiante</option>
              )}
              <option value="PROFESOR">Profesor</option>
              <option value="RECEPCIONISTA">Recepcionista</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="ACTIVO">Activo</option>
              <option value="SUSPENDIDO">Suspendido</option>
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>
        </div>
      )}

      {/* Apoderado (Si es registro público o si el Admin edita/crea un Estudiante) */}
      {mostrarApoderado && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Apoderado
          </label>
          <input
            type="text"
            name="apoderado"
            required
            value={form.apoderado}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>
      )}

      {/* Datos Profesor (Si Admin elige PROFESOR) */}
      {mostrarProfesor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-md">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Contrato
            </label>
            <input
              type="date"
              name="fecha_contrato"
              required
              value={form.fecha_contrato}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Especialidad
            </label>
            {especialidades.length > 0 ? (
              <select
                name="id_especialidad"
                required
                value={form.id_especialidad ?? ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              >
                <option value="">Seleccione especialidad...</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nombre}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                name="id_especialidad"
                required
                min={1}
                placeholder="ID Especialidad"
                value={form.id_especialidad ?? ""}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
            )}
          </div>
        </div>
      )}

      {/* Foto de Perfil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subir Foto (Opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            O URL de Foto
          </label>
          <input
            type="url"
            name="foto_url"
            value={form.foto_url}
            onChange={handleChange}
            placeholder="https://cloudinary.com..."
            className="mt-1 w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Vista previa de foto actual (útil en modo edición) */}
      {form.foto_url && !form.fotoFile && (
        <div className="flex items-center gap-3 pt-2">
          <img
            src={form.foto_url}
            alt="Vista previa"
            className="w-14 h-14 rounded-full object-cover border"
          />
          <span className="text-xs text-gray-500">Foto de perfil actual</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={Save}
        isLoading={loading}
        className="w-full"
      >
        {labelBoton}
      </Button>
    </form>
  );
};
