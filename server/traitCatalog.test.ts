import { describe, expect, it } from "vitest";
import { filterTraitCatalog, toTraitCatalogSearchText } from "../shared/gurpsTraitCatalog";
import { appendCatalogTrait, createTraitFromCatalog } from "../shared/traitCatalogSelection";
import { listGurpsTraitCatalog } from "./db";
import { createAppRouter } from "./routers";
import { getGurpsTraitCatalogSeed } from "./traitCatalogSeed";

describe("catálogo de vantagens e desvantagens", () => {
  const catalog = getGurpsTraitCatalogSeed();
  it("mantém identificadores únicos, traduções e custos coerentes", () => {
    expect(catalog).toHaveLength(60);
    expect(new Set(catalog.map(entry => entry.id)).size).toBe(catalog.length);
    expect(catalog.every(entry => entry.name && entry.originalName && entry.summary && entry.reference)).toBe(true);
    expect(catalog.find(entry => entry.originalName === "Combat Reflexes")).toMatchObject({ name: "Reflexos em Combate", cost: 15, kind: "advantage" });
    expect(catalog.find(entry => entry.originalName === "Duty")).toMatchObject({ name: "Dever", kind: "disadvantage", variableCost: true });
  });
  it("busca por português, inglês e tipo sem alterar os registros", () => {
    const original = structuredClone(catalog);
    expect(toTraitCatalogSearchText(catalog[0] as never)).toContain("direcao absoluta");
    expect(filterTraitCatalog(catalog as never, "reflexos")).toHaveLength(1);
    expect(filterTraitCatalog(catalog as never, "combat reflexes")).toHaveLength(1);
    expect(filterTraitCatalog(catalog as never, "", "disadvantage").every(entry => entry.kind === "disadvantage")).toBe(true);
    expect(catalog).toEqual(original);
  });
  it("preenche e inclui um traço sem mutar a ficha anterior", () => {
    const entry = catalog.find(item => item.originalName === "Combat Reflexes")!;
    const trait = createTraitFromCatalog(entry as never, "trait-1");
    const sheet = { advantages: [], disadvantages: [] };
    expect(trait).toMatchObject({ id: "trait-1", name: "Reflexos em Combate", cost: 15, source: "Basic Set p. 43" });
    expect(appendCatalogTrait(sheet, "advantages", trait)).toMatchObject({ advantages: [trait] });
    expect(sheet.advantages).toHaveLength(0);
  });
  it("reutiliza o preenchimento automático na mini-ficha de um aliado", () => {
    const entry = catalog.find(item => item.originalName === "Honesty")!;
    const trait = createTraitFromCatalog(entry as never, "ally-trait-1");
    const ally = { id: "ally-1", advantages: [], disadvantages: [] };

    const updatedAlly = appendCatalogTrait(ally, "disadvantages", trait);

    expect(updatedAlly.disadvantages).toEqual([trait]);
    expect(updatedAlly.disadvantages[0]).toMatchObject({ name: "Honestidade", cost: -10, source: "Basic Set p. 138" });
    expect(ally.disadvantages).toHaveLength(0);
  });
  it("consulta somente leitura e expõe o procedimento público", async () => {
    const repository = { list: async () => catalog.map(entry => ({ ...entry, createdAt: new Date(), updatedAt: new Date() })) };
    await expect(listGurpsTraitCatalog("honesty", "disadvantage", repository)).resolves.toMatchObject([{ name: "Honestidade" }]);
    const reader = async (query: string, kind: "advantage" | "disadvantage") => filterTraitCatalog(catalog as never, query, kind);
    const caller = createAppRouter(undefined, reader).createCaller({} as never);
    await expect(caller.traits.listCatalog({ query: "direção", kind: "advantage" })).resolves.toMatchObject([{ name: "Direção Absoluta" }]);
  });
});
