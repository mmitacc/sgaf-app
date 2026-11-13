import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { AdminResumenKpis } from "../components/AdminResumenKpis";
import { OcupacionGruposChart } from "../components/OcupacionGruposChart";

export function AdminEstadisticasPage() {
  const { resumen, loading } = useAdminDashboard();

  if (loading || !resumen) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Cargando estadísticas globales...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Estadísticas Globales
          </h1>
          <p className="text-sm text-slate-500">
            Indicadores de comunidad académica, carga docente y ocupación de
            aulas.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
          Periodo Activo: {resumen.periodo}
        </span>
      </div>

      <AdminResumenKpis resumen={resumen} />
      <OcupacionGruposChart data={resumen.academico.ocupacionGrupos} />
    </div>
  );
}
