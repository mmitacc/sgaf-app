import { Download, UserX } from "lucide-react";
import { useAdminFinanzas } from "../hooks/useAdminFinanzas";
import { FinanzasKpiCards } from "../components/FinanzasKpiCards";
import { EvolucionIngresosChart } from "../components/EvolucionIngresosChart";
import { ConceptosDonutChart } from "../components/ConceptosDonutChart";
import { CanalesPagoBarChart } from "../components/CanalesPagoBarChart";
import { PagosConsolidadosTable } from "../components/PagosConsolidadosTable";

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
      <div className="p-6 text-sm text-slate-500">
        Cargando reportes financieros...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Finanzas y Reportes
          </h1>
          <p className="text-sm text-slate-500">
            Control conglomerado de deudas, recaudación en caja/línea y
            morosidad por periodo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={periodoId ?? ""}
            onChange={(e) => setPeriodoId(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
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
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserX className="h-4 w-4" />
            {ejecutandoCorte
              ? "Procesando corte..."
              : `Suspender Morosos (${data.kpis.totalMorosos})`}
          </button>

          <button
            onClick={exportarCsv}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
