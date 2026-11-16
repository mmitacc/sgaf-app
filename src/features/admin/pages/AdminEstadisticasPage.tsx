import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { AdminResumenKpis } from "../components/estadisticas/AdminResumenKpis";
import { OcupacionGruposChart } from "../components/estadisticas/OcupacionGruposChart";

export function AdminEstadisticasPage() {
  const { resumen, loading, periodoId, setPeriodoId } = useAdminDashboard();

  if (loading || !resumen) {
    return (
      <div className="p-6 text-sm text-text-muted">
        Cargando estadísticas globales...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-base">
            Estadísticas Globales
          </h1>
          <p className="text-sm text-text-muted">
            Indicadores de comunidad académica, carga docente y ocupación de
            aulas.
          </p>
        </div>

        <select
          value={periodoId ?? ""}
          onChange={(e) => setPeriodoId(Number(e.target.value))}
          aria-label="Seleccionar periodo académico"
          className="cursor-pointer rounded-full border border-brand-primary/25 bg-brand-primary/15 px-4 py-1.5 text-xs font-semibold text-brand-primary outline-none transition hover:bg-brand-primary/20"
        >
          {resumen.periodos?.length ? (
            resumen.periodos.map((p) => (
              <option
                key={p.id}
                value={p.id}
                className="bg-bg-surface text-text-base"
              >
                Periodo: {p.nombre}
              </option>
            ))
          ) : (
            <option value="">Periodo Activo: {resumen.periodo}</option>
          )}
        </select>
      </div>

      <AdminResumenKpis resumen={resumen} />
      <OcupacionGruposChart data={resumen.academico.ocupacionGrupos} />
    </div>
  );
}
