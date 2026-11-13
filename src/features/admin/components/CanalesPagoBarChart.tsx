import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";

export const CanalesPagoBarChart = ({
  data,
}: {
  data: { canal: string; monto: number }[];
}) => {
  const chartData = data.map((entry) => ({
    ...entry,
    fill: entry.canal === "En Línea" ? "#2563EB" : "#10B981",
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Recaudación por Canal
        </h3>
        <p className="text-xs text-slate-500">
          Pasarela digital vs. cobro en ventanilla
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="canal"
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
              }}
              formatter={(value) => [
                `S/ ${Number(value ?? 0).toFixed(2)}`,
                "Total",
              ]}
            />
            <Bar dataKey="monto" radius={[8, 8, 0, 0]} barSize={48}>
              <LabelList
                dataKey="monto"
                position="top"
                formatter={(val) =>
                  `S/ ${Number(val ?? 0).toLocaleString("es-PE")}`
                }
                style={{ fontSize: 11, fontWeight: 600, fill: "#475569" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
