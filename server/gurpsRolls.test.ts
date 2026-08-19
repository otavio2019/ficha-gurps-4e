import { describe, expect, it } from "vitest";
import { parseDamageExpression, rollCheck3d6, rollDamage } from "../shared/gurpsRolls";

describe("motor de rolagens GURPS", () => {
  it("calcula o total, sucesso e margem de um teste 3d6", () => {
    const result = rollCheck3d6(14, () => 0.5);
    expect(result.dice).toEqual([4, 4, 4]);
    expect(result.total).toBe(12);
    expect(result.success).toBe(true);
    expect(result.margin).toBe(2);
  });

  it("identifica falha e margem negativa", () => {
    const result = rollCheck3d6(10, () => 0.99);
    expect(result.total).toBe(18);
    expect(result.success).toBe(false);
    expect(result.margin).toBe(-8);
  });

  it("interpreta expressões de dano GURPS com dado implícito e modificador", () => {
    expect(parseDamageExpression("1d+2 corte")).toEqual({ diceCount: 1, sides: 6, modifier: 2 });
    expect(parseDamageExpression("2d6-1 perfuração")).toEqual({ diceCount: 2, sides: 6, modifier: -1 });
    expect(parseDamageExpression("sem dano")).toBeNull();
  });

  it("rola dano e aplica o modificador", () => {
    const result = rollDamage("2d+1", () => 0.5);
    expect(result).toMatchObject({ kind: "damage", dice: [4, 4], modifier: 1, total: 9 });
  });
});
