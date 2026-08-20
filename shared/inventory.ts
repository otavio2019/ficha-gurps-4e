export const INVENTORY_CATEGORIES = ["Armas", "Armaduras", "Consumíveis", "Ferramentas", "Itens-chave", "Outros"] as const;
export type InventoryCategory = (typeof INVENTORY_CATEGORIES)[number];

export const INVENTORY_HANDS = ["—", "Mão dominante", "Mão secundária", "Duas mãos", "Vestido", "Mochila"] as const;
export const UNIVERSAL_WEIGHT_UNIT = "kg" as const;
export const POUNDS_TO_KILOGRAMS = 0.45359237;

/** A carga da ficha é sempre registrada em quilogramas; a referência de ST de GURPS é convertida na exibição. */
export const calculateBasicLiftKg = (strength: number) => Math.max(0, (Math.max(1, Number(strength) || 1) ** 2 / 5) * POUNDS_TO_KILOGRAMS);

const categoryAliases: Record<string, InventoryCategory> = {
  arma: "Armas", armas: "Armas",
  armadura: "Armaduras", armaduras: "Armaduras",
  consumivel: "Consumíveis", consumiveis: "Consumíveis", "consumível": "Consumíveis", "consumíveis": "Consumíveis",
  ferramenta: "Ferramentas", ferramentas: "Ferramentas",
  "item-chave": "Itens-chave", "itens-chave": "Itens-chave", "item chave": "Itens-chave", "itens chave": "Itens-chave",
  utilidade: "Outros", outro: "Outros", outros: "Outros",
};

export const normalizeInventoryCategory = (category?: string): InventoryCategory => categoryAliases[(category || "").trim().toLocaleLowerCase()] || "Outros";
