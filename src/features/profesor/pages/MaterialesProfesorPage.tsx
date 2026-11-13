import { BookOpen, FolderKanban, Loader2, Plus } from "lucide-react";
import { useMaterialesProfesor } from "../hooks/useMaterialesProfesor";
import { TarjetaMaterialClase } from "@/features/material-grupo/components/TarjetaMaterialClase";
import { ModalPublicarMaterial } from "../components/ModalPublicarMaterial";

export function MaterialesProfesorPage() {
  const state = useMaterialesProfesor();
  const grupoActual = state.grupos.find((g) => g.id === state.grupoId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-text-muted/10 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">
            <FolderKanban className="h-4 w-4" />
            Recursos Académicos
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-base">
            Materiales y Grabaciones
          </h1>
          <p className="text-text-muted mt-1">
            Comparte enlaces de clases grabadas, diapositivas y lecturas por
            grupo.
          </p>
        </div>

        {state.grupoId && (
          <button
            type="button"
            onClick={() => state.setModalAbierto(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-primary text-white text-sm font-bold hover:opacity-90 shadow-lg shadow-blue-500/20 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            Publicar Material
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {state.grupos.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => state.setGrupoId(g.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap border cursor-pointer ${
              state.grupoId === g.id
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-bg-surface text-text-base border-text-muted/10"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {g.materia.nombre} (Grupo #{g.id})
          </button>
        ))}
      </div>

      {state.cargando ? (
        <div className="py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary mx-auto" />
        </div>
      ) : state.materiales.length === 0 ? (
        <div className="rounded-2xl bg-bg-surface border border-text-muted/10 py-16 text-center text-sm text-text-muted">
          Aún no has publicado materiales en este grupo.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.materiales.map((m) => (
            <TarjetaMaterialClase
              key={m.id}
              material={m}
              onEliminar={state.handleEliminar}
            />
          ))}
        </div>
      )}

      <ModalPublicarMaterial
        abierto={state.modalAbierto}
        materiaNombre={grupoActual?.materia.nombre}
        grupoId={grupoActual?.id}
        titulo={state.titulo}
        onChangeTitulo={state.setTitulo}
        descripcion={state.descripcion}
        onChangeDescripcion={state.setDescripcion}
        tipo={state.tipo}
        onChangeTipo={state.setTipo}
        url={state.url}
        onChangeUrl={state.setUrl}
        archivo={state.archivo}
        onChangeArchivo={state.setArchivo}
        guardando={state.guardando}
        onCerrar={() => state.setModalAbierto(false)}
        onSubmit={state.handlePublicar}
      />
    </div>
  );
}
