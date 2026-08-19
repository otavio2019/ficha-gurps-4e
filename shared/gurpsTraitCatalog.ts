export type TraitKind = "advantage" | "disadvantage";

export type TraitCatalogRecord = {
  id: string;
  name: string;
  originalName: string;
  kind: TraitKind;
  cost: number;
  costLabel: string;
  category: string;
  nature: string;
  availability: string;
  variableCost: boolean;
  requiresSelfControl: boolean;
  summary?: string | null;
  reference: string;
};

export const GURPS_TRAIT_CATALOG_REFERENCE = "Catálogo-base GURPS 4ª edição";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function toTraitCatalogSearchText(record: Pick<TraitCatalogRecord, "name" | "originalName" | "kind" | "category" | "nature" | "availability">) {
  return normalize(`${record.name} ${record.originalName} ${record.kind} ${record.category} ${record.nature} ${record.availability}`);
}

export function filterTraitCatalog<T extends Pick<TraitCatalogRecord, "name" | "originalName" | "kind" | "category" | "nature" | "availability">>(records: T[], query = "", kind?: TraitKind, limit = 80) {
  const search = normalize(query.trim());
  return records.filter(record => (!kind || record.kind === kind) && (!search || toTraitCatalogSearchText(record).includes(search))).slice(0, limit);
}
