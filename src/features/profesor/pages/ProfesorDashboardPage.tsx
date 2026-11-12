import { Award } from "lucide-react";
import { PanelAccesosRol } from "@/components/PanelAccesosRol";

export function ProfesorDashboardPage() {
  return (
    <PanelAccesosRol
      rol="PROFESOR"
      prefijoNombre="Prof. "
      iconoCabecera={Award}
    />
  );
}
export default ProfesorDashboardPage;
