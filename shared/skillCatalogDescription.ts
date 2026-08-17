export type SkillDescriptionSource = {
  name: string;
  category: string;
  requiresSpecialization?: boolean;
  usesTechLevel?: boolean;
};

export function getSkillCatalogDescription(skill: SkillDescriptionSource) {
  if (skill.requiresSpecialization) {
    return `A perícia ${skill.name} permite aplicar conhecimento especializado na área escolhida para superar desafios relacionados durante a aventura.`;
  }

  if (skill.usesTechLevel || skill.category === "Tecnologia") {
    return `A perícia ${skill.name} permite operar, analisar ou resolver desafios tecnológicos compatíveis com o nível tecnológico da campanha.`;
  }

  if (skill.category === "Combate") {
    return `A perícia ${skill.name} permite usar técnicas de combate para atacar, defender-se ou controlar o confronto conforme a situação.`;
  }

  return `A perícia ${skill.name} permite aplicar técnicas e conhecimentos da área para superar desafios relevantes durante a aventura.`;
}
