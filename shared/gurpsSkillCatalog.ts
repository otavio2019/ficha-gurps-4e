export type SkillCatalogRecord = {
  id: string;
  name: string;
  originalName: string;
  attribute: string;
  difficulty: string;
  category: string;
  requiresSpecialization: boolean;
  usesTechLevel: boolean;
  summary?: string;
  reference: string;
};

export const GURPS_SKILL_CATALOG_REFERENCE = "Catálogo-base GURPS 4ª edição";

export function toSkillCatalogSearchText(record: Pick<SkillCatalogRecord, "name" | "originalName" | "attribute" | "difficulty" | "category">) {
  return `${record.name} ${record.originalName} ${record.attribute} ${record.difficulty} ${record.category}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export function filterSkillCatalog<T extends Pick<SkillCatalogRecord, "name" | "originalName" | "attribute" | "difficulty" | "category">>(records: T[], query = "", limit = 80) {
  const search = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR");
  const filtered = search ? records.filter(record => toSkillCatalogSearchText(record).includes(search)) : records;
  return filtered.slice(0, limit);
}
