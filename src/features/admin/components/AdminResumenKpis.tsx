import { Users, BookOpen, GraduationCap, Wallet } from "lucide-react";
import type { DashboardEjecutivoResponse } from "../types/adminType";

export const AdminResumenKpis = ({
  resumen,
}: {
  resumen: DashboardEjecutivoResponse;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-5 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Estudiantes
          </span>
          <div className="rounded-xl bg-sky-500/15 p-2 text-sky-600 dark:text-sky-400">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-text-base">
          {resumen.comunidad.estudiantes}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {resumen.academico.totalMatriculas} matrículas activas
        </p>
      </div>

      <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-5 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Plana Docente
          </span>
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600 dark:text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-text-base">
          {resumen.comunidad.profesores}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {resumen.comunidad.recepcionistas} en recepción/caja
        </p>
      </div>

      <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-5 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Grupos Abiertos
          </span>
          <div className="rounded-xl bg-indigo-500/15 p-2 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-text-base">
          {resumen.academico.totalGrupos}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Periodo: {resumen.periodo}
        </p>
      </div>

      <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-5 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between text-text-muted">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Recaudado Ciclo
          </span>
          <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600 dark:text-emerald-400">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold text-text-base">
          S/{" "}
          {resumen.finanzasResumen.recaudado.toLocaleString("es-PE", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          S/{" "}
          {resumen.finanzasResumen.pendiente.toLocaleString("es-PE", {
            minimumFractionDigits: 2,
          })}{" "}
          por cobrar
        </p>
      </div>
    </div>
  );
};
