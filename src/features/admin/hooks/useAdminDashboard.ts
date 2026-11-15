import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/services/axios";
import type { DashboardEjecutivoResponse } from "../types/adminType";

export interface DashboardEjecutivoConPeriodos extends DashboardEjecutivoResponse {
  periodoSeleccionado?: number | null;
  periodos?: { id: number; nombre: string }[];
}

export const useAdminDashboard = () => {
  const [resumen, setResumen] = useState<DashboardEjecutivoConPeriodos | null>(
    null,
  );
  const [periodoId, setPeriodoId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const params = periodoId ? { idPeriodo: periodoId } : {};
      const res = await api.get<DashboardEjecutivoConPeriodos>(
        "/admin/dashboard",
        { params },
      );
      setResumen(res.data);
      if (!periodoId && res.data.periodoSeleccionado) {
        setPeriodoId(res.data.periodoSeleccionado);
      }
    } catch {
      toast.error("No se pudo cargar el panel ejecutivo");
    } finally {
      setLoading(false);
    }
  }, [periodoId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { resumen, loading, periodoId, setPeriodoId };
};
