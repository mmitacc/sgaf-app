import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface DatoIngresoMensual {
  mes: string;
  recaudado: number;
  pendiente: number;
}

interface IngresosMensualesChartProps {
  data: DatoIngresoMensual[];
}

export const IngresosMensualesChart = ({
  data,
}: IngresosMensualesChartProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Evolución de Recaudación
        </h3>
        <p className="text-xs text-slate-500">
          Comparativa mensual de ingresos cobrados vs. pendientes
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRecaudado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="mes"
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
              formatter={(value) => [`S/ ${Number(value ?? 0).toFixed(2)}`, ""]}
            />
            <Area
              type="monotone"
              dataKey="recaudado"
              name="Recaudado"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorRecaudado)"
            />
            <Area
              type="monotone"
              dataKey="pendiente"
              name="Pendiente"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
