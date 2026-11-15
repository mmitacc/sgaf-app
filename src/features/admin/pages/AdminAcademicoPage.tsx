import { useState } from "react";
import { BookOpen, Calendar, Layers, Plus } from "lucide-react";
import {
  useAdminAcademico,
  type TabAcademico,
} from "../hooks/useAdminAcademico";
import { GruposTab } from "../components/academico/GruposTab";
import { PeriodosTab } from "../components/academico/PeriodosTab";
import { CatalogosTab } from "../components/academico/CatalogosTab";
import { ModalGrupo } from "../components/academico/ModalGrupo";
import { ModalPeriodo } from "../components/academico/ModalPeriodo";
import { academicoService } from "../services/academicoService";
import type { Grupo, Periodo } from "../types/academicoType";

export function AdminAcademicoPage() {
  const {
    tabActiva,
    setTabActiva,
    loading,
    gruposFiltrados,
    periodos,
    materias,
    aulas,
    profesores,
    filtroPeriodo,
    setFiltroPeriodo,
    busqueda,
    setBusqueda,
    cargarTodo,
    confirmarEliminacion,
  } = useAdminAcademico();

  const [modalGrupoAbierto, setModalGrupoAbierto] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<Grupo | null>(null);
  const [modalPeriodoAbierto, setModalPeriodoAbierto] = useState(false);
  const [periodoEditando, setPeriodoEditando] = useState<Periodo | null>(null);

  const tabs: { id: TabAcademico; label: string; icon: typeof BookOpen }[] = [
    { id: "GRUPOS", label: "Grupos y Horarios", icon: BookOpen },
    { id: "PERIODOS", label: "Periodos Académicos", icon: Calendar },
    { id: "CATALOGOS", label: "Materias y Aulas", icon: Layers },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-base">
            Gestión Académica
          </h1>
          <p className="text-sm text-text-muted">
            Administra grupos, horarios, periodos, materias y aulas de la
            institución.
          </p>
        </div>

        {tabActiva === "GRUPOS" && (
          <button
            type="button"
            onClick={() => {
              setGrupoEditando(null);
              setModalGrupoAbierto(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Nuevo Grupo
          </button>
        )}

        {tabActiva === "PERIODOS" && (
          <button
            type="button"
            onClick={() => {
              setPeriodoEditando(null);
              setModalPeriodoAbierto(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Nuevo Periodo
          </button>
        )}
      </div>

      {/* Pestañas */}
      <div className="flex flex-wrap gap-2 border-b border-text-muted/15 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const activa = tabActiva === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTabActiva(tab.id)}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                activa
                  ? "bg-brand-primary text-white"
                  : "bg-bg-surface text-text-muted hover:text-text-base border border-text-muted/15"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-text-muted/15 bg-bg-surface p-12 text-center text-sm text-text-muted">
          Cargando estructura académica...
        </div>
      ) : (
        <>
          {tabActiva === "GRUPOS" && (
            <GruposTab
              grupos={gruposFiltrados}
              periodos={periodos}
              filtroPeriodo={filtroPeriodo}
              setFiltroPeriodo={setFiltroPeriodo}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              onEditar={(g) => {
                setGrupoEditando(g);
                setModalGrupoAbierto(true);
              }}
              onEliminar={(g) =>
                confirmarEliminacion(`el grupo #${g.id}`, () =>
                  academicoService.eliminarGrupo(g.id),
                )
              }
            />
          )}

          {tabActiva === "PERIODOS" && (
            <PeriodosTab
              periodos={periodos}
              onEditar={(p) => {
                setPeriodoEditando(p);
                setModalPeriodoAbierto(true);
              }}
              onEliminar={(p) =>
                confirmarEliminacion(`el periodo ${p.nombre}`, () =>
                  academicoService.eliminarPeriodo(p.id),
                )
              }
            />
          )}

          {tabActiva === "CATALOGOS" && (
            <CatalogosTab
              materias={materias}
              aulas={aulas}
              onRecargar={cargarTodo}
              onConfirmarEliminar={confirmarEliminacion}
            />
          )}
        </>
      )}

      <ModalGrupo
        abierto={modalGrupoAbierto}
        grupo={grupoEditando}
        periodos={periodos}
        materias={materias}
        aulas={aulas}
        profesores={profesores}
        onClose={() => setModalGrupoAbierto(false)}
        onGuardado={cargarTodo}
      />

      <ModalPeriodo
        abierto={modalPeriodoAbierto}
        periodo={periodoEditando}
        onClose={() => setModalPeriodoAbierto(false)}
        onGuardado={cargarTodo}
      />
    </div>
  );
}
