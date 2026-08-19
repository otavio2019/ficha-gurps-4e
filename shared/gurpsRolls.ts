export type CheckRoll = {
  kind: "test";
  dice: number[];
  total: number;
  target: number;
  margin: number;
  success: boolean;
};

export type DamageRoll = {
  kind: "damage";
  expression: string;
  dice: number[];
  modifier: number;
  total: number;
};

export type DamageExpression = { diceCount: number; sides: number; modifier: number };

export const rollDie = (sides = 6, random: () => number = Math.random) => Math.floor(random() * sides) + 1;

export const rollCheck3d6 = (target: number, random: () => number = Math.random): CheckRoll => {
  const dice = Array.from({ length: 3 }, () => rollDie(6, random));
  const total = dice.reduce((sum, die) => sum + die, 0);
  const margin = target - total;
  return { kind: "test", dice, total, target, margin, success: margin >= 0 };
};

export const parseDamageExpression = (expression: string): DamageExpression | null => {
  const match = expression.trim().match(/(\d+)\s*d(?:\s*(\d+))?\s*([+-]\s*\d+)?/i);
  if (!match) return null;
  const diceCount = Number(match[1]);
  const sides = Number(match[2] || 6);
  const modifier = Number((match[3] || "0").replace(/\s/g, ""));
  if (!Number.isInteger(diceCount) || !Number.isInteger(sides) || diceCount < 1 || sides < 2) return null;
  return { diceCount, sides, modifier: Number.isFinite(modifier) ? modifier : 0 };
};

export const rollDamage = (expression: string, random: () => number = Math.random): DamageRoll | null => {
  const parsed = parseDamageExpression(expression);
  if (!parsed) return null;
  const dice = Array.from({ length: parsed.diceCount }, () => rollDie(parsed.sides, random));
  const total = dice.reduce((sum, die) => sum + die, 0) + parsed.modifier;
  return { kind: "damage", expression, dice, modifier: parsed.modifier, total };
};
