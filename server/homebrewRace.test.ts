import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getHomebrewRaceEffects, hasHomebrewRaceEffects } from "@shared/homebrewRace";

describe("raças Homebrew", () => {
  it("lê bônus de atributo e converte vantagens e desvantagens no formato da biblioteca", () => {
    const effects = getHomebrewRaceEffects({
      id: "elfo", category: "Raça", title: "Elfo das Cinzas", source: "Aurora", content: "",
      details: {
        stBonus: -1, dxBonus: 1, iqBonus: 1, htBonus: 0,
        advantages: "Visão Noturna | 10 | Enxerga no escuro; Longevidade | 2",
        disadvantages: "Dever com o bosque | 10 | Proteção ritual",
        traits: "Audição aguçada e resistência a sono mágico.",
      },
    });

    expect(effects.attributes).toEqual({ st: -1, dx: 1, iq: 1, ht: 0 });
    expect(effects.advantages).toEqual([
      { name: "Visão Noturna", cost: 10, notes: "Enxerga no escuro" },
      { name: "Longevidade", cost: 2, notes: "" },
    ]);
    expect(effects.disadvantages).toEqual([{ name: "Dever com o bosque", cost: -10, notes: "Proteção ritual" }]);
    expect(hasHomebrewRaceEffects(effects)).toBe(true);
  });

  it("aceita o campo legado de modificadores para raças já salvas", () => {
    const effects = getHomebrewRaceEffects({ id: "legado", category: "Raça", title: "Gigante", source: "Mesa", content: "", details: { modifiers: "ST +4, DX -1, HT +2" } });
    expect(effects.attributes).toEqual({ st: 4, dx: -1, iq: 0, ht: 2 });
  });

  it("mantém a raça anterior registrada para remoção reversível na ficha", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(source).toContain("previousRace: current.identity.race");
    expect(source).toContain("race: application.previousRace || \"Humano\"");
    expect(source).toContain("advantageIds: advantageTraits.map");
    expect(source).toContain("disadvantageIds: disadvantageTraits.map");
  });
});
