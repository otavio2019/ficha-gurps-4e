import { describe, expect, it } from "vitest";
import { calculateStrengthDamage } from "@shared/gurpsStrengthDamage";

describe("dano automático por ST", () => {
  it("retorna Golpe e Balanço de referências usuais da tabela", () => {
    expect(calculateStrengthDamage(10)).toMatchObject({ thrust: "1d-2", swing: "1d" });
    expect(calculateStrengthDamage(12)).toMatchObject({ thrust: "1d-1", swing: "1d+2" });
    expect(calculateStrengthDamage(20)).toMatchObject({ thrust: "2d-1", swing: "3d+2" });
    expect(calculateStrengthDamage(45)).toMatchObject({ thrust: "5d", swing: "7d+1" });
  });

  it("normaliza ST inválida e estende o padrão acima de ST 100", () => {
    expect(calculateStrengthDamage(0)).toMatchObject({ st: 1, thrust: "1d-6", swing: "1d-5" });
    expect(calculateStrengthDamage(105)).toMatchObject({ thrust: "11d+2", swing: "13d+2" });
  });
});
