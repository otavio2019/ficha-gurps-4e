import { describe, expect, it } from "vitest";
import { filterSkillCatalog, toSkillCatalogSearchText } from "../shared/gurpsSkillCatalog";
import { getSkillCatalogDescription } from "../shared/skillCatalogDescription";
import { appendCatalogSkill, createSkillFromCatalog } from "../shared/skillCatalogSelection";
import { listGurpsSkillCatalog } from "./db";
import { createAppRouter } from "./routers";
import { getGurpsSkillCatalogSeed } from "./skillCatalogSeed";

describe("catálogo de perícias", () => {
  it("mantém 263 identificadores, nomes em português e nomes originais únicos", () => {
    const catalog = getGurpsSkillCatalogSeed();
    expect(catalog).toHaveLength(263);
    expect(new Set(catalog.map(skill => skill.id)).size).toBe(catalog.length);
    expect(new Set(catalog.map(skill => skill.name)).size).toBe(catalog.length);
    expect(catalog.every(skill => skill.name && skill.originalName)).toBe(true);
    expect(catalog.every(skill => skill.summary && skill.summary.length > 20)).toBe(true);
    expect(catalog.find(skill => skill.id === "brawling")).toMatchObject({ name: "Briga", originalName: "Brawling" });
    expect(catalog.find(skill => skill.id === "stealth")).toMatchObject({ name: "Furtividade", originalName: "Stealth" });
    expect(catalog.find(skill => skill.id === "brawling")?.summary).toBe("Trocar socos e impedir adversários corpo a corpo, usando improvisação e controle de distância para dominar o confronto.");
    expect(catalog.find(skill => skill.id === "lockpicking-tl")?.summary).toBe("Desarma fechaduras tecnológicas e mecânicas, avaliando mecanismos e aplicando ferramentas para acesso discreto.");
    expect(catalog.find(skill => skill.id === "accounting")?.summary).toBe("Avaliar finanças, detectar fraudes e organizar registros econômicos complexos para tomada de decisões informadas.");
    expect(catalog.filter(skill => skill.id.includes("whip")).map(skill => ({ id: skill.id, name: skill.name, category: skill.category }))).toEqual([
      { id: "force-whip", name: "Chicote de Força", category: "Combate" },
      { id: "monowire-whip", name: "Chicote de Monofio", category: "Combate" },
      { id: "whip", name: "Chicote", category: "Combate" },
      { id: "whip-force", name: "Chicote (Força)", category: "Combate" },
      { id: "whip-monowire", name: "Chicote (Monofio)", category: "Combate" },
    ]);
    expect(getSkillCatalogDescription({ name: "Briga", category: "Combate", requiresSpecialization: false, usesTechLevel: false })).toContain("técnicas de combate");
  });

  it("normaliza a busca em português e inglês, limita o resultado e não muta os registros", () => {
    const records = [
      { id: "furtividade", name: "Furtividade", originalName: "Stealth", attribute: "DX", difficulty: "Média", category: "Geral" },
      ...Array.from({ length: 100 }, (_, index) => ({ id: `busca-${index}`, name: `Busca ${index}`, originalName: `Search ${index}`, attribute: "IQ", difficulty: "Fácil", category: "Geral" })),
    ];
    const original = structuredClone(records);

    expect(toSkillCatalogSearchText(records[0])).toContain("furtividade");
    expect(filterSkillCatalog(records, "FURTIVIDADE")).toEqual([records[0]]);
    expect(filterSkillCatalog(records, "stealth")).toEqual([records[0]]);
    expect(filterSkillCatalog(records)).toHaveLength(80);
    expect(records).toEqual(original);
  });

  it("consulta o repositório em modo somente leitura, com busca e limite de 80", async () => {
    const records = Array.from({ length: 100 }, (_, index) => ({
      id: `skill-${index}`, name: index === 42 ? "Furtividade" : `Perícia ${index}`, originalName: index === 42 ? "Stealth" : `Skill ${index}`,
      attribute: "DX", difficulty: "Média", category: "Geral", requiresSpecialization: false, usesTechLevel: false, summary: null, reference: "Teste", createdAt: new Date(), updatedAt: new Date(),
    }));
    const repository = { list: async () => records };

    await expect(listGurpsSkillCatalog("furtividade", repository)).resolves.toHaveLength(1);
    await expect(listGurpsSkillCatalog("stealth", repository)).resolves.toHaveLength(1);
    await expect(listGurpsSkillCatalog("", repository)).resolves.toHaveLength(80);
  });

  it("preenche a perícia escolhida em português para personagem e aliado com o atributo correto", () => {
    const brawling = { id: "brawling", name: "Briga", originalName: "Brawling", attribute: "DX", difficulty: "Fácil", category: "Combate", requiresSpecialization: false, usesTechLevel: false, summary: "Descrição de Briga vinda do catálogo.", reference: "Teste" };
    const accounting = { ...brawling, id: "accounting", name: "Contabilidade", originalName: "Accounting", attribute: "IQ", difficulty: "Difícil", category: "Geral" };

    expect(createSkillFromCatalog(brawling, { st: 12, dx: 12, iq: 11, ht: 11 }, "main")).toMatchObject({ id: "main", name: "Briga", relative: "DX+0", level: 12, points: 1, description: "Descrição de Briga vinda do catálogo." });
    expect(createSkillFromCatalog(accounting, { st: 10, dx: 10, iq: 10, ht: 10 }, "ally")).toMatchObject({ id: "ally", name: "Contabilidade", relative: "IQ+0", level: 10, points: 1 });
  });

  it("inclui a perícia traduzida no estado da ficha principal e do aliado sem alterar o registro anterior", () => {
    const selected = { id: "brawling", name: "Briga", originalName: "Brawling", attribute: "DX", difficulty: "Fácil", category: "Combate", requiresSpecialization: false, usesTechLevel: false, reference: "Teste" };
    const mainState = { skills: [] };
    const allyState = { id: "ally-1", skills: [] };
    const mainSkill = createSkillFromCatalog(selected, { st: 10, dx: 12, iq: 11, ht: 10 }, "main-skill");
    const allySkill = createSkillFromCatalog(selected, { st: 10, dx: 10, iq: 10, ht: 10 }, "ally-skill");

    expect(appendCatalogSkill(mainState, mainSkill)).toMatchObject({ skills: [expect.objectContaining({ id: "main-skill", name: "Briga", level: 12 })] });
    expect(appendCatalogSkill(allyState, allySkill)).toMatchObject({ id: "ally-1", skills: [expect.objectContaining({ id: "ally-skill", name: "Briga", level: 10 })] });
    expect(mainState.skills).toHaveLength(0);
    expect(allyState.skills).toHaveLength(0);
  });

  it("expõe a consulta pública pelo procedimento tRPC sem operações de escrita", async () => {
    const reads: string[] = [];
    const records = Array.from({ length: 100 }, (_, index) => ({
      id: `skill-${index}`, name: index === 42 ? "Furtividade" : `Perícia ${index}`, originalName: index === 42 ? "Stealth" : `Skill ${index}`,
      attribute: "DX", difficulty: "Média", category: "Geral", requiresSpecialization: false, usesTechLevel: false, summary: null, reference: "Teste", createdAt: new Date(), updatedAt: new Date(),
    }));
    const catalogReader = async (query: string) => {
      reads.push(query);
      return filterSkillCatalog(records, query);
    };
    const caller = createAppRouter(catalogReader).createCaller({} as never);

    await expect(caller.skills.listCatalog({ query: "furtividade" })).resolves.toMatchObject([{ name: "Furtividade" }]);
    await expect(caller.skills.listCatalog({ query: "stealth" })).resolves.toMatchObject([{ name: "Furtividade" }]);
    await expect(caller.skills.listCatalog({})).resolves.toHaveLength(80);
    expect(reads).toEqual(["furtividade", "stealth", ""]);
  });
});
