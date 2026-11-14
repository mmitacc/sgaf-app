import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";
import { RECHARTS_THEME } from "@/config/rechartsTheme";

export interface DatoConcepto {
  name: string;
  value: number;
}

const COLORES = ["#0EA5E9", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

export const ConceptosDonutChart = ({ data }: { data: DatoConcepto[] }) => {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORES[index % COLORES.length],
  }));

  return (
    <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-6 shadow-sm transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-base font-bold text-text-base">
          Ingresos por Concepto
        </h3>
        <p className="text-xs text-text-muted">
          Distribución entre matrícula y pensiones
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              stroke={RECHARTS_THEME.surfaceColor}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={RECHARTS_THEME.tooltipContentStyle}
              itemStyle={RECHARTS_THEME.tooltipItemStyle}
              labelStyle={RECHARTS_THEME.tooltipLabelStyle}
              formatter={(value) => [
                `S/ ${Number(value ?? 0).toFixed(2)}`,
                "Monto",
              ]}
            />
            <Legend
              wrapperStyle={RECHARTS_THEME.legendStyle}
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
