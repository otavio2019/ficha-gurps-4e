export const allyPowerCosts = { 25: 1, 50: 2, 75: 3, 100: 5, 150: 10 } as const;

export type AllyPowerPercent = keyof typeof allyPowerCosts;
export type AllyFrequency = 6 | 9 | 12 | 15;

export const allyFrequencyMultipliers: Record<AllyFrequency, number> = { 6: 1, 9: 2, 12: 3, 15: 4 };

export function calculateAllyCostByRule(powerPercent: AllyPowerPercent, frequency: AllyFrequency) {
  return allyPowerCosts[powerPercent] * allyFrequencyMultipliers[frequency];
}
