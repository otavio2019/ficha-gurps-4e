import { describe, expect, it } from "vitest";
import { calculatePointBudget, calculateSecondaryPointCost } from "../shared/characterPoints";

describe("orçamento de valores adicionais", () => {
  const secondary = { hpBonus: 0, fpBonus: 0, willBonus: 0, perBonus: 0, speedBonus: 0, moveBonus: 0, dodgeBonus: 0 };

  it("calcula cada modificador usando seu custo por nível", () => {
    expect(calculateSecondaryPointCost({ ...secondary, hpBonus: 2, fpBonus: 1, willBonus: 1, perBonus: 1, speedBonus: 1, moveBonus: 1, dodgeBonus: 1 })).toBe(42);
  });

  it("desconta valores adicionais no total de pontos gastos", () => {
    const budget = calculatePointBudget({ attributes: { st: 10, dx: 10, iq: 10, ht: 10 }, secondary: { ...secondary, hpBonus: 1, dodgeBonus: 1 }, advantages: [{ cost: 5 }], disadvantages: [{ cost: -5 }], skills: [{ points: 2 }], powerPoints: 3, allyPoints: 4 });
    expect(budget.secondaryPoints).toBe(17);
    expect(budget.totalSpent).toBe(26);
  });
});
