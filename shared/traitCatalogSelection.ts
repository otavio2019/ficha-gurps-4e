import type { TraitCatalogRecord } from "./gurpsTraitCatalog";

export type CatalogTraitInstance = { id: string; name: string; cost: number; notes: string; source: string };

export function createTraitFromCatalog(entry: TraitCatalogRecord, id: string): CatalogTraitInstance {
  return { id, name: entry.name, cost: entry.cost, notes: entry.summary?.trim() || "", source: entry.reference };
}

export function appendCatalogTrait<T extends { advantages: CatalogTraitInstance[]; disadvantages: CatalogTraitInstance[] }>(target: T, kind: "advantages" | "disadvantages", trait: CatalogTraitInstance): T {
  return { ...target, [kind]: [...target[kind], trait] };
}
