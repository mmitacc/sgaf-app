import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { RECHARTS_THEME } from "@/config/rechartsTheme";

interface GrupoOcupacion {
  nombre: string;
  inscritos: number;
  capacidad: number;
  porcentaje: number;
}

export const OcupacionGruposChart = ({ data }: { data: GrupoOcupacion[] }) => {
  const chartData = data.map((item) => ({
    ...item,
    fill:
      item.porcentaje >= 90
        ? "#EF4444"
        : item.porcentaje >= 70
          ? "#F59E0B"
          : "#0EA5E9",
  }));

  return (
    <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-6 shadow-sm transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-base font-bold text-text-base">
          Ocupación de Secciones (Top 5)
        </h3>
        <p className="text-xs text-text-muted">
          Porcentaje de aforo cubierto por materia y aula
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke={RECHARTS_THEME.gridStroke}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              unit="%"
              tick={RECHARTS_THEME.tickStyle}
              axisLine={{ stroke: RECHARTS_THEME.axisStroke }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              width={150}
              tick={{ fill: "var(--color-text-main)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={RECHARTS_THEME.cursorStyle}
              contentStyle={RECHARTS_THEME.tooltipContentStyle}
              itemStyle={RECHARTS_THEME.tooltipItemStyle}
              labelStyle={RECHARTS_THEME.tooltipLabelStyle}
              formatter={(value) => [
                `${Number(value ?? 0)}% de capacidad`,
                "Ocupación",
              ]}
            />
            <Bar dataKey="porcentaje" radius={[0, 6, 6, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
