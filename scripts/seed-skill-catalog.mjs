import { seedGurpsSkillCatalog, seedGurpsTraitCatalog } from "../server/db.ts";

const [skillTotal, traitTotal] = await Promise.all([seedGurpsSkillCatalog(), seedGurpsTraitCatalog()]);
console.log(`Catálogo de perícias disponível com ${skillTotal} registros.`);
console.log(`Catálogo de vantagens e desvantagens disponível com ${traitTotal} registros.`);
