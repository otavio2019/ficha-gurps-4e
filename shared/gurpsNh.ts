export type NhDifficulty = "Fácil" | "Média" | "Difícil" | "Muito difícil" | string;

const progression: Record<string, number> = {
  Fácil: 0,
  Média: -1,
  Difícil: -2,
  "Muito difícil": -3,
};

function relativeModifier(relative: string): number {
  const match = relative.match(/[+-]\s*\d+/);
  return match ? Number(match[0].replace(/\s/g, "")) : 0;
}

export function calculateNh(attributeValue: number, difficulty: NhDifficulty, points: number, relative = "", bonus = 0): number {
  const safePoints = Math.max(0, points);
  const steps = safePoints > 0 ? Math.floor(Math.log2(Math.max(1, safePoints))) : -1;
  const levelFromPoints = steps < 0 ? -3 : progression[difficulty] + steps;
  return Math.round(attributeValue + relativeModifier(relative) + levelFromPoints + bonus);
}

export type NhAttackSkill = { attribute: string; difficulty: NhDifficulty; points: number; relative: string };

export function calculateAttackNh(manualLevel: number, bonus: number, skill: NhAttackSkill | undefined, attributes: Record<string, number>): number {
  if (!skill) return manualLevel + bonus;
  const attribute = Number(attributes[skill.attribute.toLowerCase()] ?? 10);
  return calculateNh(attribute, skill.difficulty, skill.points, skill.relative, bonus);
}
