import { ClipboardCheck } from "lucide-react";
import { PanelAccesosRol } from "@/components/PanelAccesosRol";

export function RecepcionDashboardPage() {
  return <PanelAccesosRol rol="RECEPCIONISTA" iconoCabecera={ClipboardCheck} />;
}
export default RecepcionDashboardPage;
