import { describe, expect, it } from "vitest";
import { calculateAllyCostByRule } from "../shared/allyRules";

describe("regras de custo de Ally", () => {
  it("calcula custo base multiplicado pela frequência de aparecimento", () => {
    expect(calculateAllyCostByRule(25, 12)).toBe(3);
    expect(calculateAllyCostByRule(100, 15)).toBe(20);
    expect(calculateAllyCostByRule(150, 6)).toBe(10);
  });
});
