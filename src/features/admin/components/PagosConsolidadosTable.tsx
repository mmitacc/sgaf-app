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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Últimos Movimientos Confirmados
          </h3>
          <p className="text-xs text-slate-500">
            Auditoría rápida de ingresos recientes
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {pagos.length} registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <th className="pb-3 font-semibold">Estudiante</th>
              <th className="pb-3 font-semibold">Concepto</th>
              <th className="pb-3 font-semibold">Canal / Método</th>
              <th className="pb-3 font-semibold">Fecha</th>
              <th className="pb-3 text-right font-semibold">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagos.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-xs text-slate-400"
                >
                  No hay pagos registrados en este periodo.
                </td>
              </tr>
            ) : (
              pagos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="py-3 font-medium text-slate-800">
                    {p.estudiante}
                  </td>
                  <td className="py-3 text-slate-600">
                    <span className="block font-medium text-slate-700">
                      {p.concepto}
                    </span>
                    <span className="text-xs text-slate-400">
                      {p.descripcion}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.canal === "Pago en Línea"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {p.canal} · {p.tipoPago}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-slate-500">
                    {new Date(p.fecha).toLocaleDateString("es-PE")}
                  </td>
                  <td className="py-3 text-right font-semibold text-slate-900">
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
