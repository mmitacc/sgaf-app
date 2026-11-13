import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";

export interface DatoConcepto {
  name: string;
  value: number;
}

const COLORES = ["#2563EB", "#10B981", "#F59E0B", "#6366F1", "#EC4899"];

export const ConceptosDonutChart = ({ data }: { data: DatoConcepto[] }) => {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: COLORES[index % COLORES.length],
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Ingresos por Concepto
        </h3>
        <p className="text-xs text-slate-500">
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
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
              }}
              formatter={(value) => [
                `S/ ${Number(value ?? 0).toFixed(2)}`,
                "Monto",
              ]}
            />
            <Legend position="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
