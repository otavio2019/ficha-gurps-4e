export const HOMEBREW_CATEGORIES = [
  "Regra", "Raça", "Vantagem", "Desvantagem", "Perícia", "Poder", "Magia", "Energia", "Técnica", "Equipamentos", "Arma", "Armadura", "NPC", "Nota",
] as const;

export type HomebrewCategory = (typeof HOMEBREW_CATEGORIES)[number];
export type HomebrewDetailValue = string | number;
export type HomebrewEntry = {
  id: string;
  category: HomebrewCategory;
  title: string;
  source: string;
  description?: string;
  content?: string;
  tags?: string;
  notes?: string;
  details?: Record<string, HomebrewDetailValue>;
};

export type HomebrewField = { key: string; label: string; kind: "text" | "number"; hint?: string };

export const HOMEBREW_FIELDS: Record<HomebrewCategory, HomebrewField[]> = {
  Arma: [
    { key: "damage", label: "Dano", kind: "text" }, { key: "reach", label: "Alcance", kind: "text" }, { key: "st", label: "ST mínima", kind: "number" },
    { key: "parry", label: "Aparar", kind: "text" }, { key: "weight", label: "Peso", kind: "number" }, { key: "cost", label: "Custo", kind: "number" },
  ],
  Armadura: [{ key: "dr", label: "DR", kind: "number" }, { key: "locations", label: "Locais cobertos", kind: "text" }, { key: "weight", label: "Peso", kind: "number" }, { key: "cost", label: "Custo", kind: "number" }],
  Vantagem: [{ key: "cost", label: "Custo em pontos", kind: "number" }, { key: "level", label: "Nível", kind: "number" }, { key: "prerequisites", label: "Pré-requisitos", kind: "text" }, { key: "effect", label: "Efeito", kind: "text" }],
  Desvantagem: [{ key: "cost", label: "Custo em pontos", kind: "number" }, { key: "level", label: "Nível", kind: "number" }, { key: "selfControl", label: "Autocontrole", kind: "text" }, { key: "effect", label: "Efeito", kind: "text" }],
  Perícia: [{ key: "attribute", label: "Atributo", kind: "text" }, { key: "difficulty", label: "Dificuldade", kind: "text" }, { key: "points", label: "Pontos", kind: "number" }, { key: "nh", label: "NH", kind: "number" }],
  Raça: [
    { key: "stBonus", label: "ST (ganho/perda)", kind: "number" }, { key: "dxBonus", label: "DX (ganho/perda)", kind: "number" },
    { key: "iqBonus", label: "IQ (ganho/perda)", kind: "number" }, { key: "htBonus", label: "HT (ganho/perda)", kind: "number" },
    { key: "willBonus", label: "Vontade (ganho/perda)", kind: "number" }, { key: "perBonus", label: "Percepção (ganho/perda)", kind: "number" },
    { key: "speedBonus", label: "Velocidade (ganho/perda)", kind: "number" }, { key: "moveBonus", label: "Movimento (ganho/perda)", kind: "number" },
    { key: "dodgeBonus", label: "Esquiva (ganho/perda)", kind: "number" },
    { key: "advantages", label: "Vantagens (Nome | custo; …)", kind: "text", hint: "Separe cada vantagem por ponto e vírgula." },
    { key: "disadvantages", label: "Desvantagens (Nome | custo; …)", kind: "text", hint: "Separe cada desvantagem por ponto e vírgula." },
    { key: "traits", label: "Características raciais", kind: "text", hint: "Traços descritivos, adaptações e notas" },
  ],
  Poder: [{ key: "pointCost", label: "Custo em pontos", kind: "number" }, { key: "fpCost", label: "Custo em FP", kind: "number" }, { key: "range", label: "Alcance", kind: "text" }, { key: "duration", label: "Duração", kind: "text" }, { key: "damage", label: "Dano", kind: "text" }, { key: "effect", label: "Efeitos", kind: "text" }],
  Magia: [{ key: "pointCost", label: "Custo em pontos", kind: "number" }, { key: "fpCost", label: "Custo em FP", kind: "number" }, { key: "range", label: "Alcance", kind: "text" }, { key: "duration", label: "Duração", kind: "text" }, { key: "damage", label: "Dano", kind: "text" }, { key: "effect", label: "Efeitos", kind: "text" }],
  Energia: [{ key: "maximum", label: "Máximo", kind: "number" }, { key: "current", label: "Valor inicial", kind: "number" }, { key: "icon", label: "Afinidade / ícone", kind: "text" }, { key: "recovery", label: "Recuperação", kind: "text" }],
  Técnica: [{ key: "skill", label: "Perícia-base", kind: "text" }, { key: "default", label: "Padrão", kind: "text" }, { key: "points", label: "Pontos", kind: "number" }, { key: "nh", label: "NH", kind: "number" }],
  Equipamentos: [{ key: "quantity", label: "Quantidade", kind: "number" }, { key: "weight", label: "Peso", kind: "number" }, { key: "cost", label: "Custo", kind: "number" }],
  NPC: [{ key: "role", label: "Papel na campanha", kind: "text" }, { key: "faction", label: "Facção", kind: "text" }, { key: "threat", label: "Ameaça", kind: "text" }],
  Regra: [],
  Nota: [],
};

const legacyCategoryMap: Record<string, HomebrewCategory> = {
  Habilidade: "Poder",
  Equipamento: "Equipamentos",
};

export function normalizeHomebrewEntry(entry: HomebrewEntry): HomebrewEntry {
  const requestedCategory = String(entry.category || "Regra");
  const category = (HOMEBREW_CATEGORIES as readonly string[]).includes(requestedCategory)
    ? requestedCategory as HomebrewCategory
    : legacyCategoryMap[requestedCategory] || "Regra";

  return {
    ...entry,
    category,
    source: entry.source || "Campanha",
    description: entry.description ?? entry.content ?? "",
    content: entry.content ?? entry.description ?? "",
    tags: entry.tags ?? "",
    notes: entry.notes ?? "",
    details: entry.details ?? {},
  };
}

export function filterHomebrewEntries(entries: HomebrewEntry[], search: string, category: "Todos" | HomebrewCategory): HomebrewEntry[] {
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  return entries.map(normalizeHomebrewEntry).filter((entry) => {
    const inCategory = category === "Todos" || entry.category === category;
    if (!inCategory) return false;
    if (!normalizedSearch) return true;
    const haystack = [entry.title, entry.description, entry.tags, entry.source, entry.notes, ...Object.values(entry.details || {})].join(" ").toLocaleLowerCase("pt-BR");
    return haystack.includes(normalizedSearch);
  });
}

export function canAddHomebrewToSheet(category: HomebrewCategory): boolean {
  return ["Arma", "Armadura", "Equipamentos", "Vantagem", "Desvantagem", "Perícia", "Poder", "Magia", "Energia", "Técnica"].includes(category);
}
