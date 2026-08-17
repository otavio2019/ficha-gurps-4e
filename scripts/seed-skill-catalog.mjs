import { seedGurpsSkillCatalog } from "../server/db.ts";

const total = await seedGurpsSkillCatalog();
console.log(`Catálogo de perícias disponível com ${total} registros.`);
