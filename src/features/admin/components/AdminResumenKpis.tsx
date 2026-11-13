import { Users, BookOpen, GraduationCap, Wallet } from "lucide-react";
import type { DashboardEjecutivoResponse } from "../types/adminType";

export const AdminResumenKpis = ({
  resumen,
}: {
  resumen: DashboardEjecutivoResponse;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase">Estudiantes</span>
          <GraduationCap className="h-5 w-5 text-blue-600" />
        </div>
        <p className="mt-3 text-2xl font-bold text-slate-900">
          {resumen.comunidad.estudiantes}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {resumen.academico.totalMatriculas} matrículas activas
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase">Plana Docente</span>
          <Users className="h-5 w-5 text-emerald-600" />
        </div>
        <p className="mt-3 text-2xl font-bold text-slate-900">
          {resumen.comunidad.profesores}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {resumen.comunidad.recepcionistas} en recepción/caja
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase">
            Grupos Abiertos
          </span>
          <BookOpen className="h-5 w-5 text-indigo-600" />
        </div>
        <p className="mt-3 text-2xl font-bold text-slate-900">
          {resumen.academico.totalGrupos}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Periodo: {resumen.periodo}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-semibold uppercase">
            Recaudado Ciclo
          </span>
          <Wallet className="h-5 w-5 text-emerald-600" />
        </div>
        <p className="mt-3 text-2xl font-bold text-slate-900">
          S/{" "}
          {resumen.finanzasResumen.recaudado.toLocaleString("es-PE", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="mt-1 text-xs text-amber-600">
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
