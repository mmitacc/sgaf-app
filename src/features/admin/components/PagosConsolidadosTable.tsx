export interface MovimientoPago {
  id: number;
  fecha: string;
  estudiante: string;
  concepto: string;
  descripcion: string;
  tipoPago: string;
  canal: string;
  monto: number;
}

export const PagosConsolidadosTable = ({
  pagos,
}: {
  pagos: MovimientoPago[];
}) => {
  return (
    <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-6 shadow-sm transition-colors duration-200">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-text-base">
            Últimos Movimientos Confirmados
          </h3>
          <p className="text-xs text-text-muted">
            Auditoría rápida de ingresos recientes
          </p>
        </div>
        <span className="rounded-full bg-text-muted/10 px-3 py-1 text-xs font-medium text-text-muted">
          {pagos.length} registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-text-muted/15 text-xs uppercase text-text-muted">
              <th className="pb-3 font-semibold">Estudiante</th>
              <th className="pb-3 font-semibold">Concepto</th>
              <th className="pb-3 font-semibold">Canal / Método</th>
              <th className="pb-3 font-semibold">Fecha</th>
              <th className="pb-3 text-right font-semibold">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-text-muted/10">
            {pagos.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-xs text-text-muted"
                >
                  No hay pagos registrados en este periodo.
                </td>
              </tr>
            ) : (
              pagos.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-text-muted/5"
                >
                  <td className="py-3 font-medium text-text-base">
                    {p.estudiante}
                  </td>
                  <td className="py-3 text-text-muted">
                    <span className="block font-medium text-text-base">
                      {p.concepto}
                    </span>
                    <span className="text-xs text-text-muted">
                      {p.descripcion}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.canal === "Pago en Línea"
                          ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {p.canal} · {p.tipoPago}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-text-muted">
                    {new Date(p.fecha).toLocaleDateString("es-PE")}
                  </td>
                  <td className="py-3 text-right font-semibold text-text-base">
                    S/ {p.monto.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
