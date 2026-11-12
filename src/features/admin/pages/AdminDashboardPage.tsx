import { ShieldCheck } from "lucide-react";
import { PanelAccesosRol } from "@/components/PanelAccesosRol";

export function AdminDashboardPage() {
  return <PanelAccesosRol rol="ADMINISTRADOR" iconoCabecera={ShieldCheck} />;
}
export default AdminDashboardPage;
