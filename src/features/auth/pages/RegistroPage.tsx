import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { FormularioUsuario } from "@/features/usuario/components/FormularioUsuario";
import type { FormularioUsuarioValues } from "@/features/usuario/types/usuarioType";
import { registrarEstudiante } from "@/features/usuario/services/usuarioService";
import type { RegistroEstudiante } from "@/features/usuario/types/usuarioType";
import { toast } from "sonner";

export function RegistroPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegistroEstudiante = async (values: FormularioUsuarioValues) => {
    try {
      setLoading(true);
      setError(null);

      // Mapeo al tipo RegisgtroEstudiante de usuarioSchema.ts
      const payload: RegistroEstudiante = {
        nombres: values.nombres.trim(),
        apellidos: values.apellidos.trim(),
        telefono: values.telefono?.trim() || undefined,
        email: values.email.trim(),
        password: values.password,
        masculino: values.masculino,
        estado: "PENDIENTE",
        foto_url: values.foto_url?.trim() || undefined,
        apoderado: values.apoderado.trim(),
      };

      await registrarEstudiante(payload, values.fotoFile);

      toast.success(
        "¡Registro exitoso! Ahora puedes iniciar sesión en TechUniversity.",
      );
      navigate("/login");
    } catch (err: any) {
      const mensaje =
        err.response?.data?.message ||
        "Ocurrió un error al registrar la cuenta.";
      setError(Array.isArray(mensaje) ? mensaje.join(", ") : mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-8 px-4">
      {error && (
        <div className="max-w-2xl w-full mx-auto mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <FormularioUsuario
        modo="PUBLICO_ESTUDIANTE"
        titulo="Crear Cuenta de Estudiante"
        textoBoton="Registrarme"
        loading={loading}
        onSubmit={handleRegistroEstudiante}
      />

      <p className="text-center mt-5 text-sm text-gray-600">
        ¿Ya tienes una cuenta registrada?{" "}
        <Link
          to="/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
