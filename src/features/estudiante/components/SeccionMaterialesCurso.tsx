import { useEffect, useState } from "react";
import { FolderKanban } from "lucide-react";
import { materialService } from "@/features/material-grupo/services/materialService";
import type { MaterialGrupo } from "@/features/material-grupo/types/materialType";
import { TarjetaMaterialClase } from "@/features/material-grupo/components/TarjetaMaterialClase";

export function SeccionMaterialesCurso({ idGrupo }: { idGrupo: number }) {
  const [materiales, setMateriales] = useState<MaterialGrupo[]>([]);

  useEffect(() => {
    materialService
      .listarPorGrupo(idGrupo)
      .then(setMateriales)
      .catch(() => {});
  }, [idGrupo]);

  if (materiales.length === 0) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-text-muted/10">
      <h3 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-text-muted">
        <FolderKanban className="h-4 w-4 text-brand-primary" />
        Materiales y Grabaciones de Clase ({materiales.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {materiales.map((m) => (
          <TarjetaMaterialClase key={m.id} material={m} />
        ))}
      </div>
    </div>
  );
}
