import { normalizeHomebrewEntry, type HomebrewEntry } from "./homebrew";

export type RaceAttributeBonuses = { st: number; dx: number; iq: number; ht: number };
export type RaceSecondaryBonuses = { willBonus: number; perBonus: number; speedBonus: number; moveBonus: number; dodgeBonus: number };
export type RaceTraitEffect = { name: string; cost: number; notes: string };
export type RaceEffects = {
  attributes: RaceAttributeBonuses;
  secondary: RaceSecondaryBonuses;
  advantages: RaceTraitEffect[];
  disadvantages: RaceTraitEffect[];
  traits: string;
};

const number = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const blankAttributes = (): RaceAttributeBonuses => ({ st: 0, dx: 0, iq: 0, ht: 0 });
const blankSecondary = (): RaceSecondaryBonuses => ({ willBonus: 0, perBonus: 0, speedBonus: 0, moveBonus: 0, dodgeBonus: 0 });

function parseTraits(value: unknown, sign: 1 | -1): RaceTraitEffect[] {
  return String(value || "").split(/[\n;]/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const [rawName, rawCost, ...noteParts] = line.split("|").map((part) => part.trim());
    return { name: rawName, cost: sign * Math.abs(number(rawCost)), notes: noteParts.join(" | ") };
  }).filter((trait) => Boolean(trait.name));
}

function readLegacyBonuses(value: unknown): RaceAttributeBonuses {
  const text = String(value || "");
  return (["st", "dx", "iq", "ht"] as const).reduce((bonuses, attribute) => {
    const match = text.match(new RegExp(`${attribute}\\s*([+-]\\s*\\d+)`, "i"));
    bonuses[attribute] = match ? number(match[1].replace(/\s/g, "")) : 0;
    return bonuses;
  }, blankAttributes());
}

export function getHomebrewRaceEffects(rawEntry: HomebrewEntry): RaceEffects {
  const entry = normalizeHomebrewEntry(rawEntry);
  const details = entry.details || {};
  const legacy = readLegacyBonuses(details.modifiers);
  return {
    attributes: {
      st: number(details.stBonus) || legacy.st,
      dx: number(details.dxBonus) || legacy.dx,
      iq: number(details.iqBonus) || legacy.iq,
      ht: number(details.htBonus) || legacy.ht,
    },
    secondary: {
      willBonus: number(details.willBonus),
      perBonus: number(details.perBonus),
      speedBonus: number(details.speedBonus),
      moveBonus: number(details.moveBonus),
      dodgeBonus: number(details.dodgeBonus),
    },
    advantages: parseTraits(details.advantages, 1),
    disadvantages: parseTraits(details.disadvantages, -1),
    traits: String(details.traits || ""),
  };
}

export function hasHomebrewRaceEffects(effects: RaceEffects): boolean {
  return Object.values(effects.attributes).some(Boolean) || Object.values(effects.secondary).some(Boolean) || effects.advantages.length > 0 || effects.disadvantages.length > 0 || Boolean(effects.traits.trim());
}
