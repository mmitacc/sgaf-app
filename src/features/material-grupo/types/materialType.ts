export type TipoMaterial = "VIDEO" | "ARCHIVO" | "ENLACE";

export interface MaterialGrupo {
  id: number;
  titulo: string;
  descripcion?: string | null;
  tipo: TipoMaterial;
  url: string;
  id_grupo: number;
  created: string;
}
