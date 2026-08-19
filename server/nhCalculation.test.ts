import { describe, expect, it } from "vitest";
import { calculateAttackNh, calculateNh } from "@shared/gurpsNh";

describe("calculateNh", () => {
  it("calcula níveis por atributo, dificuldade e pontos", () => {
    expect(calculateNh(12, "Média", 1, "DX+0")).toBe(11);
    expect(calculateNh(12, "Média", 4, "DX+0")).toBe(13);
    expect(calculateNh(12, "Difícil", 4, "DX+0")).toBe(12);
  });

  it("aplica o bônus extra ao NH final", () => {
    expect(calculateNh(12, "Média", 4, "DX+0", 2)).toBe(15);
    expect(calculateNh(11, "Fácil", 8, "IQ-1", -1)).toBe(12);
  });

  it("calcula ataque vinculado e mantém fallback manual", () => {
    const skill = { attribute: "DX", difficulty: "Média", points: 4, relative: "DX+0" };
    expect(calculateAttackNh(10, 1, skill, { dx: 12 })).toBe(14);
    expect(calculateAttackNh(10, 1, undefined, { dx: 12 })).toBe(11);
  });

  it("mantém o NH de um poder vinculado consistente entre combate e compartilhamento", () => {
    const powerSkill = { attribute: "IQ", difficulty: "Difícil", points: 4, relative: "IQ+0" };
    expect(calculateAttackNh(9, 2, powerSkill, { iq: 12 })).toBe(14);
    expect(calculateAttackNh(9, 2, undefined, { iq: 12 })).toBe(11);
  });
});
