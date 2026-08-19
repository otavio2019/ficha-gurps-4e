import { describe, expect, it } from "vitest";
import { clampResource, describeResourceChange } from "../shared/gurpsResources";

describe("recursos rápidos de sessão", () => {
  it("mantém PV e PF dentro de zero e do máximo calculado", () => {
    expect(clampResource(-5, 12)).toBe(0);
    expect(clampResource(17, 12)).toBe(12);
    expect(clampResource(7.6, 12)).toBe(8);
  });

  it("descreve recuperação e perda para o histórico", () => {
    expect(describeResourceChange("PV", 12, 7)).toBe("Perdeu 5 PV (12 → 7).");
    expect(describeResourceChange("PF", 7, 11)).toBe("Recuperou 4 PF (7 → 11).");
  });
});
