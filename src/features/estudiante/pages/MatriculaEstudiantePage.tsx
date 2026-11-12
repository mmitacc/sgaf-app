import { useEffect, useState } from "react";
import {
  BookOpen,
  User,
  Calendar,
  MapPin,
  Award,
  Wallet,
  CheckCircle2,
  Loader2,
  Search,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { estudianteService } from "../services/estudianteService";
import type { GrupoEnriquecido } from "../types/matriculaType";
import { extraerMensajeError } from "@/services/errorHandle";

export function MatriculaEstudiantePage() {
  const [grupos, setGrupos] = useState<GrupoEnriquecido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Controla qué grupo se está procesando y cuáles ya fueron matriculados en esta sesión
  const [matriculandoId, setMatriculandoId] = useState<number | null>(null);
  const [gruposMatriculados, setGruposMatriculados] = useState<number[]>([]);

  useEffect(() => {
    const cargarOfertaAcademica = async () => {
      setCargando(true);
      try {
        const data = await estudianteService.obtenerGruposDisponibles();
        setGrupos(data);
      } catch (error) {
        toast.error(
          extraerMensajeError(
            error,
            "No se pudieron cargar los grupos disponibles.",
          ),
        );
      } finally {
        setCargando(false);
      }
    };

    cargarOfertaAcademica();
  }, []);

  const handleMatricular = async (grupo: GrupoEnriquecido) => {
    setMatriculandoId(grupo.id);
    try {
      await estudianteService.matricularseEnGrupo({
        id_grupo: grupo.id,
      });

      setGruposMatriculados((prev) => [...prev, grupo.id]);
      toast.success(
        `¡Matrícula exitosa en ${grupo.materia?.nombre || `Grupo #${grupo.id}`}!`,
      );
    } catch (error: any) {
      const dataBackend = error?.response?.data;

      // Si el backend devuelve el arreglo "errores" con las reglas de negocio
      if (dataBackend?.errores && Array.isArray(dataBackend.errores)) {
        toast.error(dataBackend.message || "Inscripción rechazada", {
          description: (
            <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
              {dataBackend.errores.map((regla: string, index: number) => (
                <li key={index}>{regla}</li>
              ))}
            </ul>
          ),
          duration: 7000,
        });
        return;
      }

      // Fallback si es otro tipo de error HTTP
      toast.error(
        extraerMensajeError(
          error,
          "No se pudo completar la matrícula en este grupo.",
        ),
      );
    } finally {
      setMatriculandoId(null);
    }
  };

  // Filtro por nombre de materia o profesor
  const gruposFiltrados = grupos.filter((g) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    const nombreMateria = g.materia?.nombre.toLowerCase() || "";
    const nombreProfesor = g.profesor
      ? `${g.profesor.nombres} ${g.profesor.apellidos}`.toLowerCase()
      : "";
    return (
      nombreMateria.includes(q) ||
      nombreProfesor.includes(q) ||
      `grupo ${g.id}`.includes(q)
    );
  });

  // Tomamos el periodo del primer grupo para mostrar el límite máximo de créditos
  const periodoReferencia = grupos[0]?.periodo;

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-text-muted/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <GraduationCap className="h-4 w-4" />
            Inscripción de Asignaturas
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
            Matrícula en Línea
          </h1>
          <p className="text-text-muted mt-1">
            Selecciona los grupos disponibles para armar tu carga académica del
            ciclo.
          </p>
        </div>

        {/* Info del Periodo y Tope de Créditos */}
        {periodoReferencia && (
          <div className="rounded-2xl bg-bg-surface px-5 py-3.5 border border-text-muted/10 shrink-0">
            <p className="text-xs font-bold uppercase text-brand-primary">
              {periodoReferencia.nombre}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              Límite permitido:{" "}
              <strong className="text-text-base">
                {periodoReferencia.max_creditos} créditos máx.
              </strong>
            </p>
          </div>
        )}
      </div>

      {/* Buscador */}
      <div className="max-w-md relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por asignatura o docente..."
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-bg-surface border border-text-muted/15 text-text-base focus:outline-none focus:border-brand-primary transition-colors"
        />
      </div>

      {/* Grid de Grupos Disponibles */}
      {cargando ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
          <p className="text-sm text-text-muted">
            Cargando oferta académica y docentes...
          </p>
        </div>
      ) : gruposFiltrados.length === 0 ? (
        <div className="rounded-2xl bg-bg-surface border border-text-muted/10 py-16 text-center space-y-2">
          <BookOpen className="h-10 w-10 text-text-muted/40 mx-auto" />
          <p className="font-bold text-text-base">No se encontraron grupos</p>
          <p className="text-xs text-text-muted">
            No hay asignaturas disponibles que coincidan con tu búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gruposFiltrados.map((grupo) => {
            const yaMatriculado = gruposMatriculados.includes(grupo.id);
            const procesando = matriculandoId === grupo.id;

            return (
              <div
                key={grupo.id}
                className="flex flex-col justify-between rounded-2xl bg-bg-surface p-6 border border-text-muted/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:border-brand-primary"
              >
                <div className="space-y-4">
                  {/* Cabecera de la card */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-brand-primary/15 text-brand-primary">
                      Grupo #{grupo.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-text-muted">
                      <Award className="h-3.5 w-3.5 text-brand-primary" />
                      {grupo.materia?.creditos ?? "-"} Créditos
                    </span>
                  </div>

                  {/* Nombre de la Materia */}
                  <div>
                    <h3 className="text-lg font-extrabold text-text-base leading-snug">
                      {grupo.materia?.nombre || `Materia #${grupo.id_materia}`}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {grupo.periodo?.nombre || `Periodo #${grupo.id_periodo}`}
                    </p>
                  </div>

                  {/* Detalles de Docente, Aula y Mensualidad */}
                  <div className="space-y-2 pt-3 border-t border-text-muted/10 text-xs">
                    <div className="flex items-center gap-2 text-text-base">
                      <User className="h-4 w-4 text-brand-primary shrink-0" />
                      <span className="truncate">
                        {grupo.profesor
                          ? `Prof. ${grupo.profesor.nombres} ${grupo.profesor.apellidos}`
                          : `Docente #${grupo.id_profesor}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-text-muted" />
                        Aula #{grupo.id_aula} • Cap. {grupo.capacidad}
                      </span>

                      {grupo.materia && (
                        <span className="inline-flex items-center gap-1 font-bold text-text-base">
                          <Wallet className="h-3.5 w-3.5 text-brand-primary" />
                          S/ {grupo.materia.mensualidad.toFixed(2)}/mes
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botón de Matrícula */}
                <div className="mt-6 pt-4 border-t border-text-muted/10">
                  {yaMatriculado ? (
                    <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Inscrito en este grupo
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={procesando}
                      onClick={() => handleMatricular(grupo)}
                      className="w-full py-2.5 px-4 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {procesando ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Matricularme"
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
