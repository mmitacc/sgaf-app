import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { RECHARTS_THEME } from "@/config/rechartsTheme";

export interface DatoEvolucion {
  mes: string;
  recaudado: number;
}

export const EvolucionIngresosChart = ({ data }: { data: DatoEvolucion[] }) => {
  return (
    <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-6 shadow-sm transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-base font-bold text-text-base">
          Evolución Mensual de Ingresos
        </h3>
        <p className="text-xs text-text-muted">
          Pagos confirmados agrupados por mes
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="gradienteIngresos"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={RECHARTS_THEME.gridStroke}
            />
            <XAxis
              dataKey="mes"
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
              cursor={{
                stroke: RECHARTS_THEME.axisStroke,
                strokeDasharray: "3 3",
              }}
              contentStyle={RECHARTS_THEME.tooltipContentStyle}
              itemStyle={RECHARTS_THEME.tooltipItemStyle}
              labelStyle={RECHARTS_THEME.tooltipLabelStyle}
              formatter={(value) => [
                `S/ ${Number(value ?? 0).toFixed(2)}`,
                "Recaudado",
              ]}
            />
            <Area
              type="monotone"
              dataKey="recaudado"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fill="url(#gradienteIngresos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
