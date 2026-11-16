import { DollarSign, TrendingUp, Clock, AlertTriangle } from "lucide-react";

interface FinanzasKpis {
  totalProyectado: number;
  totalRecaudado: number;
  saldoPendiente: number;
  totalMorosos: number;
  totalCuentas: number;
}

export const FinanzasKpiCards = ({ kpis }: { kpis: FinanzasKpis }) => {
  const porcentajeCobro =
    kpis.totalProyectado > 0
      ? Math.round((kpis.totalRecaudado / kpis.totalProyectado) * 100)
      : 0;

  const cards = [
    {
      label: "Total Recaudado",
      valor: `S/ ${kpis.totalRecaudado.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
      subtexto: `${porcentajeCobro}% de la meta del periodo`,
      icon: DollarSign,
      colorIcon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Proyectado del Periodo",
      valor: `S/ ${kpis.totalProyectado.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
      subtexto: `En ${kpis.totalCuentas} cuentas estudiantiles`,
      icon: TrendingUp,
      colorIcon: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    },
    {
      label: "Saldo Pendiente",
      valor: `S/ ${kpis.saldoPendiente.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
      subtexto: "Por cobrar en cuotas restantes",
      icon: Clock,
      colorIcon: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Cuentas en Mora",
      valor: kpis.totalMorosos.toString(),
      subtexto: "Estudiantes con deuda vencida",
      icon: AlertTriangle,
      colorIcon: "bg-red-500/15 text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl border border-text-muted/15 bg-bg-surface p-5 shadow-sm transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {card.label}
              </span>
              <div className={`rounded-xl p-2.5 ${card.colorIcon}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-text-base">
              {card.valor}
            </p>
            <p className="mt-1 text-xs text-text-muted">{card.subtexto}</p>
          </div>
        );
      })}
    </div>
  );
};
