import { describe, expect, it } from "vitest";
import { canAddHomebrewToSheet, filterHomebrewEntries, normalizeHomebrewEntry } from "@shared/homebrew";

describe("biblioteca Homebrew", () => {
  it("normaliza entradas legadas e preserva os campos enriquecidos", () => {
    const entry = normalizeHomebrewEntry({ id: "legacy", category: "Habilidade" as never, title: "Olho da Tempestade", content: "Poder de vento", source: "Aurora" });
    expect(entry.category).toBe("Poder");
    expect(entry.description).toBe("Poder de vento");
    expect(entry.tags).toBe("");
    expect(entry.details).toEqual({});
  });

  it("busca por nome, descrição, tags e respeita filtros de categoria", () => {
    const entries = [
      { id: "1", category: "Arma" as const, title: "Lança Solar", source: "Aurora", description: "Lâmina brilhante", tags: "raro, fogo" },
      { id: "2", category: "Regra" as const, title: "Descanso longo", source: "Aurora", description: "Recuperação entre expedições", tags: "sessão" },
    ];
    expect(filterHomebrewEntries(entries, "fogo", "Todos").map((entry) => entry.id)).toEqual(["1"]);
    expect(filterHomebrewEntries(entries, "recuperação", "Regra").map((entry) => entry.id)).toEqual(["2"]);
    expect(filterHomebrewEntries(entries, "lança", "Regra")).toHaveLength(0);
  });

  it("identifica as categorias que podem ser enviadas para a ficha", () => {
    expect(canAddHomebrewToSheet("Arma")).toBe(true);
    expect(canAddHomebrewToSheet("Vantagem")).toBe(true);
    expect(canAddHomebrewToSheet("Poder")).toBe(true);
    expect(canAddHomebrewToSheet("Energia")).toBe(true);
    expect(canAddHomebrewToSheet("Regra")).toBe(false);
    expect(canAddHomebrewToSheet("Raça")).toBe(false);
  });
});
