import { MapPin, User } from "lucide-react";
import type { MatriculaConDetalle } from "../types/matriculaType";

interface BannerCursoAulaProps {
  curso: MatriculaConDetalle;
}

export function BannerCursoAula({ curso }: BannerCursoAulaProps) {
  const { grupo } = curso;

  return (
    <div className="rounded-2xl bg-bg-surface p-6 border border-text-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-brand-primary/15 text-brand-primary">
            Grupo #{grupo.id}
          </span>
          <span className="text-xs font-medium text-text-muted">
            {grupo.periodo.nombre}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-text-base">
          {grupo.materia.nombre}
        </h2>
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted pt-1">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4 text-brand-primary" />
            Prof. {grupo.profesor.usuario.nombres}{" "}
            {grupo.profesor.usuario.apellidos}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-primary" />
            {grupo.aula.nombre}
          </span>
        </div>
      </div>

      <div className="text-left md:text-right shrink-0">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Actividades del curso
        </p>
        <p className="text-2xl font-extrabold text-text-base mt-0.5">
          {grupo.tareas.length}{" "}
          <span className="text-sm font-normal text-text-muted">asignadas</span>
        </p>
      </div>
    </div>
  );
}
