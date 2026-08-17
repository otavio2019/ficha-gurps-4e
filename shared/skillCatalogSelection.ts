export type CatalogSkillSelection = {
  id: string;
  name: string;
  attribute: string;
  difficulty: string;
  category: string;
  requiresSpecialization: boolean;
  usesTechLevel: boolean;
  summary?: string | null;
  reference: string;
};

export type SkillAttributes = { st: number; dx: number; iq: number; ht: number };
export type CatalogSkillInstance = { id: string; name: string; attribute: string; difficulty: string; relative: string; level: number; points: number; description?: string };

export function skillLevelFromCatalog(attribute: string, values: SkillAttributes, willBonus = 0, perBonus = 0) {
  if (attribute === "ST") return values.st;
  if (attribute === "DX") return values.dx;
  if (attribute === "HT") return values.ht;
  if (attribute === "Will") return values.iq + willBonus;
  if (attribute === "Per") return values.iq + perBonus;
  return values.iq;
}

export function createSkillFromCatalog(entry: CatalogSkillSelection, values: SkillAttributes, id: string, willBonus = 0, perBonus = 0): CatalogSkillInstance {
  return {
    id,
    name: entry.name,
    attribute: entry.attribute,
    difficulty: entry.difficulty,
    relative: `${entry.attribute}+0`,
    level: skillLevelFromCatalog(entry.attribute, values, willBonus, perBonus),
    points: 1,
    description: entry.summary || "",
  };
}

export function appendCatalogSkill<T extends { skills: CatalogSkillInstance[] }>(target: T, skill: CatalogSkillInstance): T {
  return { ...target, skills: [...target.skills, skill] };
}
