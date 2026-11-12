import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router";
import { Lock, Mail, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Logo } from "@/components";
import { useTheme } from "@/context/ThemeContext";
import { useAuthStore } from "../stores/useAuthStore";
import { loginAuthService } from "@/features/auth/services/auth";
import { extraerMensajeError } from "@/services/errorHandle";
import { RUTA_INICIAL_POR_ROL } from "@/config/roles.config";

export default function LoginPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Redirección si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const sesion = await loginAuthService({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      await login(sesion.access_token);

      const usuarioActual = useAuthStore.getState().usuario;
      toast.success(
        `¡Bienvenido de nuevo${usuarioActual ? `, ${usuarioActual.nombres}` : ""}!`,
      );
      navigate(RUTA_INICIAL_POR_ROL[usuarioActual!.rol], { replace: true });
    } catch (err) {
      const msg = extraerMensajeError(
        err,
        "Credenciales incorrectas. Verifica tus datos.",
      );
      setError(msg);
      toast.error(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-bg-base text-text-base transition-colors duration-200 lg:grid-cols-2">
      {/* LADO IZQUIERDO: Branding Tech University (Negro + Destellos Cyan y Magenta) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-12 text-white lg:flex">
        {/* Efectos de luz ambiental Cyan y Magenta */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-primary/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-brand-secondary/20 blur-3xl" />

        {/* Logo forzado en blanco para contraste sobre fondo negro */}
        <div className="relative z-10 [&_span]:text-white">
          <Logo className="h-10" />
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl leading-tight font-extrabold tracking-tight">
            Impulsa tu carrera tecnológica en un solo lugar.
          </h2>
          <p className="mt-4 text-zinc-400">
            Accede a tus rutas de aprendizaje, revisa tus evaluaciones y
            gestiona tus certificaciones académicas.
          </p>
        </div>

        <div className="relative z-10 flex gap-10 border-t border-white/10 pt-6 text-sm">
          <div>
            <p className="text-2xl font-extrabold text-brand-primary">+40</p>
            <p className="text-zinc-400">Cursos Especializados</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-brand-secondary">
              +1.200
            </p>
            <p className="text-zinc-400">Estudiantes Activos</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">35</p>
            <p className="text-zinc-400">Mentores Tech</p>
          </div>
        </div>
      </div>

      {/* LADO DERECHO: Formulario de Inicio de Sesión */}
      <div className="relative flex flex-col justify-center p-6 sm:p-12">
        {/* Botón flotante para alternar tema Claro/Oscuro */}
        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5 text-brand-primary" />
            )}
          </Button>
        </div>

        <div className="mx-auto w-full max-w-sm">
          {/* Logo visible solo en dispositivos móviles */}
          <div className="mb-8 lg:hidden">
            <Logo className="h-9" />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-text-base sm:text-3xl">
            Iniciar sesión
          </h1>
          <p className="mt-1.5 text-sm text-text-muted">
            Ingresa con tu correo institucional de Tech University.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              id="email"
              type="email"
              label="Correo institucional"
              placeholder="manu@prisma.edu"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm font-medium text-rose-500">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-text-muted select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-text-muted/30 accent-brand-primary"
                />
                Recordarme
              </label>
              <Link
                to="/recuperar-password"
                className="font-medium text-brand-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={enviando}>
              {enviando ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-muted">
            ¿Aún no tienes cuenta?{" "}
            <Link
              to="/registro"
              className="font-semibold text-brand-secondary hover:underline"
            >
              Regístrate como estudiante
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
