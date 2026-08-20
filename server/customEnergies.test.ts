import { describe, expect, it } from "vitest";
import { formatEnergyCost, normalizeCustomEnergy } from "@shared/customEnergies";

describe("energias personalizadas", () => {
  it("normaliza o valor atual, máximo, ícone e dados legados de uma energia", () => {
    expect(normalizeCustomEnergy({ id: "mana", name: "Mana", current: 14, maximum: 10, icon: "Psiônica" })).toMatchObject({
      name: "Mana", current: 10, maximum: 10, icon: "Psiônica", source: "Campanha",
    });
  });

  it("mantém a energia em intervalo válido e formata custos para ações", () => {
    expect(normalizeCustomEnergy({ id: "aura", current: -2, maximum: 5, icon: "desconhecido" as never })).toMatchObject({ current: 0, maximum: 5, icon: "Arcana" });
    expect(formatEnergyCost("Mana", 2.7)).toBe("3 Mana");
  });
});
