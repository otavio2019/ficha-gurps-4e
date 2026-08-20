import { clampResource } from "./gurpsResources";

export const CUSTOM_ENERGY_ICONS = ["Arcana", "Psiônica", "Vital", "Divina", "Sombria", "Tecnológica"] as const;
export type CustomEnergyIcon = (typeof CUSTOM_ENERGY_ICONS)[number];

export type CustomEnergy = {
  id: string;
  name: string;
  current: number;
  maximum: number;
  icon: CustomEnergyIcon;
  description: string;
  source: string;
  homebrewId?: string;
};

export function normalizeCustomEnergy(energy: Partial<CustomEnergy> & Pick<CustomEnergy, "id">): CustomEnergy {
  const maximum = Math.max(1, Math.round(Number(energy.maximum) || 1));
  const requestedIcon = String(energy.icon || "Arcana") as CustomEnergyIcon;
  return {
    id: energy.id,
    name: String(energy.name || "Nova energia"),
    current: clampResource(Number(energy.current ?? maximum), maximum),
    maximum,
    icon: CUSTOM_ENERGY_ICONS.includes(requestedIcon) ? requestedIcon : "Arcana",
    description: String(energy.description || ""),
    source: String(energy.source || "Campanha"),
    homebrewId: energy.homebrewId,
  };
}

export function formatEnergyCost(name: string, cost: number): string {
  return `${Math.max(0, Math.round(cost))} ${name || "energia"}`;
}
