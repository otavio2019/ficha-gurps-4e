export const INVENTORY_CATEGORIES = ["Armas", "Armaduras", "Consumíveis", "Ferramentas", "Itens-chave", "Outros"] as const;
export type InventoryCategory = (typeof INVENTORY_CATEGORIES)[number];

export const INVENTORY_HANDS = ["—", "Mão dominante", "Mão secundária", "Duas mãos", "Vestido", "Mochila"] as const;

const categoryAliases: Record<string, InventoryCategory> = {
  arma: "Armas", armas: "Armas",
  armadura: "Armaduras", armaduras: "Armaduras",
  consumivel: "Consumíveis", consumiveis: "Consumíveis", "consumível": "Consumíveis", "consumíveis": "Consumíveis",
  ferramenta: "Ferramentas", ferramentas: "Ferramentas",
  "item-chave": "Itens-chave", "itens-chave": "Itens-chave", "item chave": "Itens-chave", "itens chave": "Itens-chave",
  utilidade: "Outros", outro: "Outros", outros: "Outros",
};

export const normalizeInventoryCategory = (category?: string): InventoryCategory => categoryAliases[(category || "").trim().toLocaleLowerCase()] || "Outros";
