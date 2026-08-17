export const SECONDARY_POINT_COSTS = {
  hpBonus: 2,
  fpBonus: 3,
  willBonus: 5,
  perBonus: 5,
  speedBonus: 5,
  moveBonus: 5,
  dodgeBonus: 15,
} as const;

export type PointBudgetInput = {
  attributes: { st: number; dx: number; iq: number; ht: number };
  secondary: { hpBonus: number; fpBonus: number; willBonus: number; perBonus: number; speedBonus: number; moveBonus: number; dodgeBonus: number };
  advantages: Array<{ cost: number }>;
  disadvantages: Array<{ cost: number }>;
  skills: Array<{ points: number }>;
  powerPoints: number;
  allyPoints: number;
};

export function calculateSecondaryPointCost(secondary: PointBudgetInput["secondary"]) {
  return (Object.keys(SECONDARY_POINT_COSTS) as Array<keyof typeof SECONDARY_POINT_COSTS>)
    .reduce((total, field) => total + secondary[field] * SECONDARY_POINT_COSTS[field], 0);
}

export function calculatePointBudget(input: PointBudgetInput) {
  const attributePoints = (input.attributes.st - 10) * 10 + (input.attributes.dx - 10) * 20 + (input.attributes.iq - 10) * 20 + (input.attributes.ht - 10) * 10;
  const secondaryPoints = calculateSecondaryPointCost(input.secondary);
  const advantagePoints = input.advantages.reduce((sum, trait) => sum + trait.cost, 0);
  const disadvantagePoints = input.disadvantages.reduce((sum, trait) => sum + trait.cost, 0);
  const skillPoints = input.skills.reduce((sum, skill) => sum + skill.points, 0);
  const totalSpent = attributePoints + secondaryPoints + advantagePoints + disadvantagePoints + skillPoints + input.powerPoints + input.allyPoints;
  return { attributePoints, secondaryPoints, advantagePoints, disadvantagePoints, skillPoints, powerPoints: input.powerPoints, allyPoints: input.allyPoints, totalSpent };
}
