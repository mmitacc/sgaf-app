import { Download, UserX } from "lucide-react";
import { useAdminFinanzas } from "../hooks/useAdminFinanzas";
import { FinanzasKpiCards } from "../components/finanzas/FinanzasKpiCards";
import { EvolucionIngresosChart } from "../components/finanzas/EvolucionIngresosChart";
import { ConceptosDonutChart } from "../components/finanzas/ConceptosDonutChart";
import { CanalesPagoBarChart } from "../components/finanzas/CanalesPagoBarChart";
import { PagosConsolidadosTable } from "../components/finanzas/PagosConsolidadosTable";

export const AdminFinanzasPage = () => {
  const {
    data,
    periodoId,
    setPeriodoId,
    loading,
    exportarCsv,
    ejecutandoCorte,
    ejecutarCorteMorosos,
  } = useAdminFinanzas();

  if (loading || !data) {
    return (
      <div className="p-6 text-sm text-text-muted">
        Cargando reportes financieros...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-base">
            Finanzas y Reportes
          </h1>
          <p className="text-sm text-text-muted">
            Control conglomerado de deudas, recaudación en caja/línea y
            morosidad por periodo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={periodoId ?? ""}
            onChange={(e) => setPeriodoId(Number(e.target.value))}
            className="rounded-xl border border-text-muted/20 bg-bg-surface px-4 py-2 text-sm font-medium text-text-base outline-none transition-colors focus:border-brand-primary"
          >
            {data.periodos.map((p: { id: number; nombre: string }) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={ejecutarCorteMorosos}
            disabled={ejecutandoCorte || data.kpis.totalMorosos === 0}
            title={
              data.kpis.totalMorosos === 0
                ? "No hay estudiantes morosos pendientes de suspensión en este periodo"
                : `Suspender acceso a ${data.kpis.totalMorosos} estudiante(s) con deuda vencida`
            }
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
          >
            <UserX className="h-4 w-4" />
            {ejecutandoCorte
              ? "Procesando corte..."
              : `Suspender Morosos (${data.kpis.totalMorosos})`}
          </button>

          <button
            type="button"
            onClick={exportarCsv}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      <FinanzasKpiCards kpis={data.kpis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EvolucionIngresosChart data={data.charts.evolucionMensual} />
        </div>
        <ConceptosDonutChart data={data.charts.porConcepto} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CanalesPagoBarChart data={data.charts.porCanal} />
        <div className="lg:col-span-2">
          <PagosConsolidadosTable pagos={data.ultimosPagos} />
        </div>
      </div>
    </div>
  );
};
