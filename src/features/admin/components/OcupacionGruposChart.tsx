import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
          : "#2563EB",
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Ocupación de Secciones (Top 5)
        </h3>
        <p className="text-xs text-slate-500">
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
              stroke="#E2E8F0"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              unit="%"
              tick={{ fontSize: 12, fill: "#64748B" }}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              width={150}
              tick={{ fontSize: 11, fill: "#334155" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
              }}
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
