import { GraduationCap } from "lucide-react";
import { PanelAccesosRol } from "@/components/PanelAccesosRol";

export function EstudianteDashboardPage() {
  return (
    <PanelAccesosRol rol="ESTUDIANTE" iconoCabecera={GraduationCap} />
  );
}
export default EstudianteDashboardPage;
