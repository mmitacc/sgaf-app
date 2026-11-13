import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import api from "@/services/axios";
import type { ResumenFinancieroResponse } from "../types/adminType";

export const useAdminFinanzas = () => {
  const [data, setData] = useState<ResumenFinancieroResponse | null>(null);
  const [periodoId, setPeriodoId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [ejecutandoCorte, setEjecutandoCorte] = useState(false);

  const confirmarEjecucionCorte = async () => {
    try {
      setEjecutandoCorte(true);
      const res = await api.post<{
        success: boolean;
        message: string;
        estudiantesSuspendidos: number;
      }>("/deuda/corte-mensual");

      toast.success(
        `${res.data.message} (${res.data.estudiantesSuspendidos} estudiantes suspendidos)`,
      );
      await cargarReporte();
    } catch {
      toast.error("No se pudo ejecutar el corte mensual de morosos");
    } finally {
      setEjecutandoCorte(false);
    }
  };

  const ejecutarCorteMorosos = () => {
    toast.warning("¿Ejecutar corte mensual de morosos?", {
      description:
        "Los estudiantes con deudas vencidas pasarán a estado SUSPENDIDO y perderán acceso al portal.",
      duration: 8000,
      action: {
        label: "Sí, suspender",
        onClick: () => {
          void confirmarEjecucionCorte();
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    });
  };

  const cargarReporte = useCallback(async () => {
    try {
      setLoading(true);
      const params = periodoId ? { idPeriodo: periodoId } : {};
      const res = await api.get<ResumenFinancieroResponse>(
        "/admin/finanzas/resumen",
        { params },
      );
      setData(res.data);
      if (!periodoId && res.data.periodoSeleccionado) {
        setPeriodoId(res.data.periodoSeleccionado);
      }
    } catch {
      toast.error("No se pudo cargar el reporte financiero");
    } finally {
      setLoading(false);
    }
  }, [periodoId]);

  useEffect(() => {
    cargarReporte();
  }, [cargarReporte]);

  const exportarCsv = () => {
    if (!data?.ultimosPagos?.length) {
      toast.info("No hay movimientos para exportar");
      return;
    }
    const headers = [
      "ID,Fecha,Estudiante,Concepto,Descripcion,Metodo,Canal,Monto",
    ];
    const rows = data.ultimosPagos.map(
      (p) =>
        `${p.id},"${new Date(p.fecha).toLocaleDateString("es-PE")}","${p.estudiante}",${p.concepto},"${p.descripcion}",${p.tipoPago},"${p.canal}",${p.monto}`,
    );
    const blob = new Blob([headers.concat(rows).join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte-finanzas-periodo-${periodoId ?? "actual"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Reporte CSV descargado");
  };

  return {
    data,
    periodoId,
    setPeriodoId,
    loading,
    exportarCsv,
    ejecutandoCorte,
    ejecutarCorteMorosos,
  };
};
