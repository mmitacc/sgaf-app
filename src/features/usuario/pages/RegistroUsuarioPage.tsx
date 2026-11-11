import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { FormularioUsuario } from "../components/FormularioUsuario";
import type {
  FormularioUsuarioValues,
  EspecialidadOption,
  UsuarioGenerico,
  RegistroUsuario,
} from "../types/usuarioType";
import {
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorId,
} from "../services/usuarioService";
import api from "@/services/axios";
import { toast } from "sonner";
import { Button } from "@/components";
import { ArrowLeft } from "lucide-react";
import { extraerMensajeError } from "@/services/errorHandle";

export function RegistroUsuarioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuarioActual, setUsuarioActual] = useState<
    Partial<UsuarioGenerico> | undefined
  >(undefined);
  const [especialidades, setEspecialidades] = useState<EspecialidadOption[]>(
    [],
  );

  // 1. Cargar especialidades para el select cuando el rol sea PROFESOR
  useEffect(() => {
    const cargarEspecialidades = async () => {
      try {
        const res = await api.get<EspecialidadOption[]>("/especialidad");
        setEspecialidades(res.data);
      } catch (err) {
        const msg = extraerMensajeError(err, "Error al cargar especialidades.");
        setError(msg);
      }
    };
    cargarEspecialidades();
  }, []);

  // 2. Si estamos en modo edición, cargar los datos del usuario por ID
  useEffect(() => {
    if (!id) return;

    const cargarUsuario = async () => {
      try {
        setCargandoDatos(true);
        const data = await obtenerUsuarioPorId(Number(id));
        setUsuarioActual(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "No se pudo cargar la información del usuario.",
        );
      } finally {
        setCargandoDatos(false);
      }
    };

    cargarUsuario();
  }, [id]);

  // 3. Manejar el guardado (Crear o Actualizar)
  const handleGuardarUsuario = async (values: FormularioUsuarioValues) => {
    try {
      setLoading(true);
      setError(null);

      if (esEdicion && id) {
        await actualizarUsuario(
          Number(id),
          {
            nombres: values.nombres.trim(),
            apellidos: values.apellidos.trim(),
            telefono: values.telefono?.trim() || undefined,
            email: values.email.trim(),
            password: values.password || undefined, // El servicio lo omite si está vacío
            rol: values.rol,
            masculino: values.masculino,
            estado: values.estado,
            foto_url: values.foto_url?.trim() || undefined,
            fecha_contrato: values.fecha_contrato,
            id_especialidad: values.id_especialidad,
            apoderado: values.apoderado.trim(),
          },
          values.fotoFile,
        );
        toast.success("Usuario actualizado correctamente.");
      } else {
        const payload: RegistroUsuario = {
          nombres: values.nombres.trim(),
          apellidos: values.apellidos.trim(),
          telefono: values.telefono?.trim() || undefined,
          email: values.email.trim(),
          password: values.password,
          rol: values.rol,
          masculino: values.masculino,
          estado: values.estado,
          foto_url: values.foto_url?.trim() || undefined,
          fecha_contrato: values.fecha_contrato,
          id_especialidad: values.id_especialidad,
        };

        await crearUsuario(payload, values.fotoFile);
        toast.success("Usuario registrado correctamente.");
      }

      navigate("/usuario");
    } catch (err: any) {
      const mensaje =
        err.response?.data?.message ||
        "Ocurrió un error al guardar el usuario.";
      setError(Array.isArray(mensaje) ? mensaje.join(", ") : mensaje);
    } finally {
      setLoading(false);
    }
  };

  if (cargandoDatos) {
    return (
      <div className="p-8 text-center text-gray-600">
        Cargando datos del usuario...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto mb-4 flex justify-between items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate("/usuario")}
        >
          Volver a la lista de usuarios
        </Button>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <FormularioUsuario
        modo="ADMIN_USUARIO"
        esEdicion={esEdicion}
        initialData={usuarioActual}
        especialidades={especialidades}
        titulo={esEdicion ? "Editar Usuario" : "Registrar Nuevo Usuario"}
        textoBoton={esEdicion ? "Actualizar Usuario" : "Registrar Usuario"}
        loading={loading}
        onSubmit={handleGuardarUsuario}
      />
    </div>
  );
}
