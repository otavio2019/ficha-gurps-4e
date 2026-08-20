import { describe, expect, it } from "vitest";
import { calculateBasicLiftKg, normalizeInventoryCategory, UNIVERSAL_WEIGHT_UNIT } from "../shared/inventory";

describe("categorias de inventário", () => {
  it("normaliza categorias legadas de itens", () => {
    expect(normalizeInventoryCategory("Arma")).toBe("Armas");
    expect(normalizeInventoryCategory("Utilidade")).toBe("Outros");
    expect(normalizeInventoryCategory("Itens chave")).toBe("Itens-chave");
  });

  it("atribui itens sem categoria a Outros", () => {
    expect(normalizeInventoryCategory()).toBe("Outros");
    expect(normalizeInventoryCategory("Desconhecida")).toBe("Outros");
  });

  it("usa quilogramas como unidade universal e converte a carga básica", () => {
    expect(UNIVERSAL_WEIGHT_UNIT).toBe("kg");
    expect(calculateBasicLiftKg(10)).toBeCloseTo(9.07, 2);
  });
});
