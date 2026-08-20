export type StrengthDamage = { st: number; thrust: string; swing: string };

type StrengthDamageBand = { minimum: number; maximum: number; thrust: string; swing: string };

const STRENGTH_DAMAGE_BANDS: StrengthDamageBand[] = [
  { minimum: 1, maximum: 2, thrust: "1d-6", swing: "1d-5" }, { minimum: 3, maximum: 4, thrust: "1d-5", swing: "1d-4" },
  { minimum: 5, maximum: 6, thrust: "1d-4", swing: "1d-3" }, { minimum: 7, maximum: 8, thrust: "1d-3", swing: "1d-2" },
  { minimum: 9, maximum: 9, thrust: "1d-2", swing: "1d-1" }, { minimum: 10, maximum: 10, thrust: "1d-2", swing: "1d" },
  { minimum: 11, maximum: 11, thrust: "1d-1", swing: "1d+1" }, { minimum: 12, maximum: 12, thrust: "1d-1", swing: "1d+2" },
  { minimum: 13, maximum: 13, thrust: "1d", swing: "2d-1" }, { minimum: 14, maximum: 14, thrust: "1d", swing: "2d" },
  { minimum: 15, maximum: 15, thrust: "1d+1", swing: "2d+1" }, { minimum: 16, maximum: 16, thrust: "1d+1", swing: "2d+2" },
  { minimum: 17, maximum: 17, thrust: "1d+2", swing: "3d-1" }, { minimum: 18, maximum: 18, thrust: "1d+2", swing: "3d" },
  { minimum: 19, maximum: 19, thrust: "2d-1", swing: "3d+1" }, { minimum: 20, maximum: 20, thrust: "2d-1", swing: "3d+2" },
  { minimum: 21, maximum: 21, thrust: "2d", swing: "4d-1" }, { minimum: 22, maximum: 22, thrust: "2d", swing: "4d" },
  { minimum: 23, maximum: 23, thrust: "2d+1", swing: "4d+1" }, { minimum: 24, maximum: 24, thrust: "2d+1", swing: "4d+2" },
  { minimum: 25, maximum: 25, thrust: "2d+2", swing: "5d-1" }, { minimum: 26, maximum: 26, thrust: "2d+2", swing: "5d" },
  { minimum: 27, maximum: 28, thrust: "3d-1", swing: "5d+1" }, { minimum: 29, maximum: 30, thrust: "3d", swing: "5d+2" },
  { minimum: 31, maximum: 32, thrust: "3d+1", swing: "6d-1" }, { minimum: 33, maximum: 34, thrust: "3d+2", swing: "6d" },
  { minimum: 35, maximum: 36, thrust: "4d-1", swing: "6d+1" }, { minimum: 37, maximum: 38, thrust: "4d", swing: "6d+2" },
  { minimum: 39, maximum: 44, thrust: "4d+1", swing: "7d-1" }, { minimum: 45, maximum: 49, thrust: "5d", swing: "7d+1" },
  { minimum: 50, maximum: 54, thrust: "5d+2", swing: "8d-1" }, { minimum: 55, maximum: 59, thrust: "6d", swing: "8d+1" },
  { minimum: 60, maximum: 64, thrust: "7d-1", swing: "9d" }, { minimum: 65, maximum: 69, thrust: "7d+1", swing: "9d+2" },
  { minimum: 70, maximum: 74, thrust: "8d", swing: "10d" }, { minimum: 75, maximum: 79, thrust: "8d+2", swing: "10d+2" },
  { minimum: 80, maximum: 84, thrust: "9d", swing: "11d" }, { minimum: 85, maximum: 89, thrust: "9d+2", swing: "11d+2" },
  { minimum: 90, maximum: 94, thrust: "10d", swing: "12d" }, { minimum: 95, maximum: 99, thrust: "10d+2", swing: "12d+2" },
  { minimum: 100, maximum: 104, thrust: "11d", swing: "13d" },
];

function increaseByTwoAdds(expression: string, groups: number) {
  const match = expression.match(/^(\d+)d(?:([+-])(\d+))?$/);
  if (!match) return expression;
  const dice = Number(match[1]);
  const modifier = match[2] === "-" ? -Number(match[3]) : Number(match[3] || 0);
  const totalAdds = modifier + groups * 2;
  const nextDice = dice + Math.floor(totalAdds / 3);
  const nextModifier = totalAdds % 3;
  return `${nextDice}d${nextModifier === 0 ? "" : `+${nextModifier}`}`;
}

/** Aplica um bônus de dano a uma expressão de dados preservando sua forma válida para rolagens. */
export function applyDamageBonus(expression: string, bonus = 0): string {
  const match = String(expression || "").match(/^(\d+)d(?:([+-])(\d+))?$/);
  if (!match) return String(expression || "—");
  const dice = Number(match[1]);
  const baseModifier = match[2] === "-" ? -Number(match[3]) : Number(match[3] || 0);
  const modifier = baseModifier + Math.round(Number(bonus) || 0);
  return `${dice}d${modifier === 0 ? "" : modifier > 0 ? `+${modifier}` : modifier}`;
}

/** Retorna a tabela padrão de dano de ST de GURPS 4e, com extensão regular acima de ST 100. */
export function calculateStrengthDamage(st: number): StrengthDamage {
  const normalizedSt = Math.max(1, Math.round(Number(st) || 1));
  const band = STRENGTH_DAMAGE_BANDS.find((entry) => normalizedSt >= entry.minimum && normalizedSt <= entry.maximum);
  if (band) return { st: normalizedSt, thrust: band.thrust, swing: band.swing };
  const groupsAboveOneHundred = Math.floor((normalizedSt - 100) / 5);
  return {
    st: normalizedSt,
    thrust: increaseByTwoAdds("11d", groupsAboveOneHundred),
    swing: increaseByTwoAdds("13d", groupsAboveOneHundred),
  };
}
