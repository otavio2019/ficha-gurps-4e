import { describe, expect, it } from "vitest";
import { calculateAllyCostByRule } from "./allyRules";

describe("regras de custo de Ally", () => {
  it("calcula o custo base multiplicado pela frequência", () => {
    expect(calculateAllyCostByRule(25, 12)).toBe(3);
    expect(calculateAllyCostByRule(100, 15)).toBe(20);
    expect(calculateAllyCostByRule(150, 6)).toBe(10);
  });
});
