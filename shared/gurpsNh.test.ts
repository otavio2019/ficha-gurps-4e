import { describe, expect, it } from "vitest";
import { calculateNh } from "./gurpsNh";

describe("calculateNh", () => {
  it("calcula níveis por atributo, dificuldade e pontos", () => {
    expect(calculateNh(12, "Média", 1, "DX+0")).toBe(11);
    expect(calculateNh(12, "Média", 4, "DX+0")).toBe(12);
    expect(calculateNh(12, "Difícil", 4, "DX+0")).toBe(11);
  });

  it("aplica o bônus extra ao NH final", () => {
    expect(calculateNh(12, "Média", 4, "DX+0", 2)).toBe(14);
    expect(calculateNh(11, "Fácil", 8, "IQ-1", -1)).toBe(12);
  });
});
