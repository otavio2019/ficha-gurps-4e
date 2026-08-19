import { describe, expect, it } from "vitest";
import { normalizeInventoryCategory } from "../shared/inventory";

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
});
