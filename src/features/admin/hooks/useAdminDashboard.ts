import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "@/services/axios";
import type { DashboardEjecutivoResponse } from "../types/adminType";

export const useAdminDashboard = () => {
  const [resumen, setResumen] = useState<DashboardEjecutivoResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res =
          await api.get<DashboardEjecutivoResponse>("/admin/dashboard");
        setResumen(res.data);
      } catch {
        toast.error("No se pudo cargar el panel ejecutivo");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return { resumen, loading };
};
