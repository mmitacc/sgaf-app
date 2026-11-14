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
import { RECHARTS_THEME } from "@/config/rechartsTheme";

export const CanalesPagoBarChart = ({
  data,
}: {
  data: { canal: string; monto: number }[];
}) => {
  const chartData = data.map((entry) => ({
    ...entry,
    fill: entry.canal === "En Línea" ? "#0EA5E9" : "#10B981",
  }));

  return (
    <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-6 shadow-sm transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-base font-bold text-text-base">
          Recaudación por Canal
        </h3>
        <p className="text-xs text-text-muted">
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
              stroke={RECHARTS_THEME.gridStroke}
            />
            <XAxis
              dataKey="canal"
              tick={RECHARTS_THEME.tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={RECHARTS_THEME.tickStyle}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={RECHARTS_THEME.cursorStyle}
              contentStyle={RECHARTS_THEME.tooltipContentStyle}
              itemStyle={RECHARTS_THEME.tooltipItemStyle}
              labelStyle={RECHARTS_THEME.tooltipLabelStyle}
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
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  fill: "var(--color-text-main)",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
