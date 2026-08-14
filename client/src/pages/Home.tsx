/**
 * Códice de Campo: neoeditorial utilitário para jogo de mesa.
 * Este arquivo privilegia densidade legível, estados sempre visíveis e ações rápidas de sessão.
 */
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Backpack,
  BookOpen,
  CircleAlert,
  Crosshair,
  Copy,
  Dices,
  FileJson,
  FilePlus2,
  HeartPulse,
  History,
  Minus,
  PackagePlus,
  Plus,
  Printer,
  Save,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trash2,
  UserRound,
  UsersRound,
  WandSparkles,
  Weight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Trait = { id: string; name: string; cost: number; notes: string; source: string };
type Skill = { id: string; name: string; attribute: string; difficulty: string; relative: string; level: number; points: number };
type InventoryItem = { id: string; name: string; category: string; quantity: number; weight: number; carried: boolean; equipped: boolean };
type Attack = { id: string; name: string; level: number; damage: string; reach: string; parry: string };
type Armor = { id: string; location: string; dr: number; source: string };
type LogItem = { id: string; time: string; text: string; kind: "roll" | "health" | "note" };

type Sheet = {
  identity: { name: string; player: string; campaign: string; world: string; concept: string; race: string; tl: string };
  attributes: { st: number; dx: number; iq: number; ht: number };
  secondary: { hpCurrent: number; hpBonus: number; fpCurrent: number; fpBonus: number; willBonus: number; perBonus: number; speedBonus: number; moveBase: number; moveBonus: number; dodgeBonus: number };
  points: { initial: number; earned: number };
  advantages: Trait[];
  disadvantages: Trait[];
  skills: Skill[];
  inventory: InventoryItem[];
  attacks: Attack[];
  armor: Armor[];
  conditions: string[];
  log: LogItem[];
};

type CharacterRecord = { id: string; sheet: Sheet; createdAt: number; updatedAt: number };

const BANNER = "/manus-storage/codice-campo-banner_a9e63bb6.png";
const SIDEBAR = "/manus-storage/codice-campo-sidebar_18686b0f.png";
const PORTRAIT = "/manus-storage/codice-personagem-exemplo_5d5f7042.png";
const BODY_MAP = "/manus-storage/codice-corpo-defesas_9406c304.png";
const MARK = "/manus-storage/marca-codice-campo_b9cb5d94.png";
const LEGACY_STORAGE_KEY = "ficha-gurps-4e-codice-v1";
const LIBRARY_STORAGE_KEY = "ficha-gurps-4e-personagens-v2";
const ACTIVE_CHARACTER_KEY = "ficha-gurps-4e-personagem-ativo-v2";

const makeId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const now = () => new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
const number = (value: string) => (Number.isFinite(Number(value)) ? Number(value) : 0);
const format = (value: number, digits = 0) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);

const initialSheet: Sheet = {
  identity: {
    name: "Aurora Vale",
    player: "Jogador",
    campaign: "Cinzas de Aramore",
    world: "Terras de Veyra",
    concept: "Batedora e cartógrafa de fronteira",
    race: "Humana",
    tl: "TL 3",
  },
  attributes: { st: 12, dx: 12, iq: 11, ht: 11 },
  secondary: { hpCurrent: 12, hpBonus: 0, fpCurrent: 11, fpBonus: 0, willBonus: 1, perBonus: 1, speedBonus: 0, moveBase: 5, moveBonus: 0, dodgeBonus: 0 },
  points: { initial: 150, earned: 5 },
  advantages: [
    { id: "adv-1", name: "Reflexos em Combate", cost: 15, notes: "Mantém a calma quando a iniciativa importa.", source: "Basic Set" },
    { id: "adv-2", name: "Visão Aguçada", cost: 2, notes: "Bônus já aplicado à Percepção.", source: "Basic Set" },
  ],
  disadvantages: [
    { id: "dis-1", name: "Dever (Guilda dos Mapas)", cost: -10, notes: "Chamados oficiais têm prioridade.", source: "Basic Set" },
    { id: "dis-2", name: "Código de Honra", cost: -10, notes: "Nunca abandona um companheiro de expedição.", source: "Basic Set" },
    { id: "dis-3", name: "Quirk: anota rotas obsessivamente", cost: -1, notes: "Uma peculiaridade de personagem.", source: "—" },
  ],
  skills: [
    { id: "skill-1", name: "Espadas de Lâmina Larga", attribute: "DX", difficulty: "Média", relative: "DX+2", level: 14, points: 4 },
    { id: "skill-2", name: "Furtividade", attribute: "DX", difficulty: "Média", relative: "DX+1", level: 13, points: 2 },
    { id: "skill-3", name: "Sobrevivência (Montanhas)", attribute: "Per", difficulty: "Média", relative: "Per+1", level: 13, points: 2 },
    { id: "skill-4", name: "Cartografia", attribute: "IQ", difficulty: "Média", relative: "IQ+1", level: 12, points: 2 },
  ],
  inventory: [
    { id: "item-1", name: "Espada longa", category: "Arma", quantity: 1, weight: 3, carried: true, equipped: true },
    { id: "item-2", name: "Mochila de campanha", category: "Recipiente", quantity: 1, weight: 3, carried: true, equipped: false },
    { id: "item-3", name: "Corda (10 m)", category: "Utilidade", quantity: 1, weight: 2.5, carried: true, equipped: false },
    { id: "item-4", name: "Rações", category: "Suprimento", quantity: 3, weight: 0.5, carried: true, equipped: false },
  ],
  attacks: [
    { id: "atk-1", name: "Espada longa", level: 14, damage: "1d+2 corte", reach: "C, 1", parry: "10" },
    { id: "atk-2", name: "Ponta da espada", level: 14, damage: "1d+1 perfuração", reach: "1", parry: "10" },
  ],
  armor: [
    { id: "armor-1", location: "Tronco", dr: 2, source: "Gibão de couro" },
    { id: "armor-2", location: "Braços", dr: 2, source: "Gibão de couro" },
    { id: "armor-3", location: "Pernas", dr: 1, source: "Calças reforçadas" },
  ],
  conditions: [],
  log: [{ id: "log-1", time: "18:40", text: "Ficha iniciada no Códice de Campo.", kind: "note" }],
};

const navItems = [
  { id: "visao-geral", label: "Visão geral", icon: BookOpen },
  { id: "combate", label: "Combate", icon: Swords },
  { id: "caracteristicas", label: "Características", icon: Sparkles },
  { id: "pericias", label: "Perícias", icon: Target },
  { id: "inventario", label: "Equipamento", icon: Backpack },
  { id: "diario", label: "Diário", icon: ScrollText },
];

function MetricCard({ label, value, detail, tone = "navy" }: { label: string; value: string | number; detail: string; tone?: "navy" | "red" | "moss" }) {
  return (
    <div className={`metric-card metric-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function SectionHeader({ kicker, title, description, icon: Icon, action }: { kicker: string; title: string; description: string; icon: typeof BookOpen; action?: React.ReactNode }) {
  return (
    <div className="section-header">
      <div className="section-header__tab"><img src={MARK} alt="" /><b>{kicker.slice(0, 2)}</b><span>{title.split(" ").map((word) => word[0]).join("").slice(0, 3)}</span></div>
      <div>
        <span className="eyebrow"><Icon size={12} /> {kicker}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {action && <div className="section-header__action">{action}</div>}
    </div>
  );
}

function CharacterLibrary({ characters, onCreate, onOpen, onDuplicate, onDelete }: { characters: CharacterRecord[]; onCreate: () => void; onOpen: (id: string) => void; onDuplicate: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <main className="library-shell">
      <section className="library-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 31, 46, .98), rgba(15, 31, 46, .81) 56%, rgba(15, 31, 46, .24)), url(${SIDEBAR})` }}>
        <div className="library-brand"><img src={MARK} alt="Marca do Códice de Campo" /><div><span>ARQUIVO DE CAMPANHA</span><strong>GURPS <em>4e</em></strong></div></div>
        <div className="library-hero__spine"><img src={MARK} alt="" /><span>ARQUIVO</span><b>04</b></div>
        <div className="library-hero__content"><span className="eyebrow eyebrow--light"><UsersRound size={13} /> PERSONAGENS LOCAIS</span><h1>Seu grupo,<br />em um só códice.</h1><p>Crie fichas separadas, retome a edição de qualquer aventureiro e mantenha cada campanha organizada neste navegador.</p><div className="library-hero__register"><span><img src={MARK} alt="" /> Registro local</span><span>Fichas {String(characters.length).padStart(2, "0")}</span><span>JSON pronto</span></div><button type="button" className="library-create library-create--hero" onClick={onCreate}><img src={MARK} alt="" /> Criar personagem</button></div>
        <div className="library-hero__count"><img src={MARK} alt="" /><span>Fichas ativas</span><strong>{characters.length}</strong><small>salvas neste dispositivo</small></div>
      </section>
      <section className="library-content">
        <div className="library-heading"><div><span className="eyebrow">ESTANTE DE CAMPO</span><h2>Personagens</h2><p>Selecione uma ficha para continuar a sessão ou comece uma nova página.</p></div><button type="button" className="library-create" onClick={onCreate}><img src={MARK} alt="" /> Nova ficha</button></div>
        <div className="character-shelf">
          {characters.map((character, index) => {
            const { sheet } = character;
            const hpMax = sheet.attributes.st + sheet.secondary.hpBonus;
            const fpMax = sheet.attributes.ht + sheet.secondary.fpBonus;
            const totalPoints = (sheet.attributes.st - 10) * 10 + (sheet.attributes.dx - 10) * 20 + (sheet.attributes.iq - 10) * 20 + (sheet.attributes.ht - 10) * 10 + sheet.advantages.reduce((sum, item) => sum + item.cost, 0) + sheet.disadvantages.reduce((sum, item) => sum + item.cost, 0) + sheet.skills.reduce((sum, item) => sum + item.points, 0);
            return <article className="character-card" key={character.id}>
              <div className="character-card__folio"><img src={MARK} alt="" /><span>FICHA</span><b>{String(index + 1).padStart(2, "0")}</b></div>
              <div className="character-card__portrait"><img src={PORTRAIT} alt="" /></div>
              <div className="character-card__content"><div className="character-card__meta"><span>{sheet.identity.race || "Sem raça"}</span><i>•</i><span>{sheet.identity.tl || "TL —"}</span></div><h3>{sheet.identity.name || "Sem nome"}</h3><p>{sheet.identity.concept || "Personagem sem conceito definido."}</p><div className="character-card__tags"><span>{sheet.identity.campaign || "Sem campanha"}</span><span>{sheet.skills.length} perícias</span></div><div className="character-card__attributes"><span>ST <b>{sheet.attributes.st}</b></span><span>DX <b>{sheet.attributes.dx}</b></span><span>IQ <b>{sheet.attributes.iq}</b></span><span>HT <b>{sheet.attributes.ht}</b></span></div><div className="character-card__metrics"><div><span>HP</span><b>{sheet.secondary.hpCurrent}/{hpMax}</b></div><div><span>FP</span><b>{sheet.secondary.fpCurrent}/{fpMax}</b></div><div><span>Pontos</span><b>{totalPoints}</b></div></div></div>
              <div className="character-card__actions"><button type="button" className="character-open" onClick={() => onOpen(character.id)}><img src={MARK} alt="" /> Abrir ficha <ArrowRight size={16} /></button><button type="button" aria-label={`Duplicar ${sheet.identity.name || "personagem"}`} onClick={() => onDuplicate(character.id)}><Copy size={16} /></button><button type="button" className="delete-character" aria-label={`Excluir ${sheet.identity.name || "personagem"}`} onClick={() => onDelete(character.id)} disabled={characters.length === 1}><Trash2 size={16} /></button></div>
            </article>;
          })}
          <button type="button" className="character-card character-card--new" onClick={onCreate}><span className="new-character__seal"><img src={MARK} alt="" /></span><strong>Iniciar outra ficha</strong><small>Uma página limpa para o próximo personagem.</small><span className="new-character__action"><img src={MARK} alt="" /> Criar personagem</span></button>
        </div>
        <div className="library-note"><BookOpen size={17} /><span><b>Arquivo local.</b> Suas fichas ficam separadas e salvas apenas neste navegador. Use JSON para manter cópias fora deste dispositivo.</span></div>
      </section>
    </main>
  );
}

export default function Home() {
  const [characters, setCharacters] = useState<CharacterRecord[]>(() => {
    try {
      const storedLibrary = window.localStorage.getItem(LIBRARY_STORAGE_KEY);
      if (storedLibrary) {
        const parsed = JSON.parse(storedLibrary) as CharacterRecord[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
      const legacySheet = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      const sheet = legacySheet ? (JSON.parse(legacySheet) as Sheet) : initialSheet;
      return [{ id: makeId(), sheet, createdAt: Date.now(), updatedAt: Date.now() }];
    } catch {
      return [{ id: makeId(), sheet: initialSheet, createdAt: Date.now(), updatedAt: Date.now() }];
    }
  });
  const [activeCharacterId, setActiveCharacterId] = useState(() => window.localStorage.getItem(ACTIVE_CHARACTER_KEY) || "");
  const [view, setView] = useState<"library" | "sheet">("library");
  const [activeSection, setActiveSection] = useState("visao-geral");
  const [lastRoll, setLastRoll] = useState<{ label: string; dice: number[]; total: number; target: number } | null>(null);
  const activeCharacter = characters.find((character) => character.id === activeCharacterId) || characters[0];
  const sheet = activeCharacter.sheet;

  const setSheet = (nextSheet: Sheet | ((current: Sheet) => Sheet)) => {
    setCharacters((current) => current.map((character) => {
      if (character.id !== activeCharacter.id) return character;
      const updatedSheet = typeof nextSheet === "function" ? nextSheet(character.sheet) : nextSheet;
      return { ...character, sheet: updatedSheet, updatedAt: Date.now() };
    }));
  };

  useEffect(() => {
    window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(characters));
    window.localStorage.setItem(ACTIVE_CHARACTER_KEY, activeCharacter.id);
  }, [characters, activeCharacter.id]);

  const calculated = useMemo(() => {
    const hpMax = sheet.attributes.st + sheet.secondary.hpBonus;
    const fpMax = sheet.attributes.ht + sheet.secondary.fpBonus;
    const will = sheet.attributes.iq + sheet.secondary.willBonus;
    const perception = sheet.attributes.iq + sheet.secondary.perBonus;
    const speed = (sheet.attributes.dx + sheet.attributes.ht) / 4 + sheet.secondary.speedBonus;
    const basicLift = (sheet.attributes.st ** 2) / 5;
    const carriedWeight = sheet.inventory.reduce((sum, item) => sum + (item.carried ? item.quantity * item.weight : 0), 0);
    const encumbrance = carriedWeight <= basicLift ? 0 : carriedWeight <= basicLift * 2 ? 1 : carriedWeight <= basicLift * 3 ? 2 : carriedWeight <= basicLift * 6 ? 3 : carriedWeight <= basicLift * 10 ? 4 : 5;
    const encNames = ["Nenhuma", "Leve", "Média", "Pesada", "Muito pesada", "Excedida"];
    const dodge = Math.max(1, Math.floor(speed) + 3 + sheet.secondary.dodgeBonus - Math.min(encumbrance, 4));
    const move = Math.max(1, Math.floor(sheet.secondary.moveBase + sheet.secondary.moveBonus - Math.min(encumbrance, 4)));
    const attributePoints = (sheet.attributes.st - 10) * 10 + (sheet.attributes.dx - 10) * 20 + (sheet.attributes.iq - 10) * 20 + (sheet.attributes.ht - 10) * 10;
    const advantagePoints = sheet.advantages.reduce((sum, trait) => sum + trait.cost, 0);
    const disadvantagePoints = sheet.disadvantages.reduce((sum, trait) => sum + trait.cost, 0);
    const skillPoints = sheet.skills.reduce((sum, skill) => sum + skill.points, 0);
    const totalSpent = attributePoints + advantagePoints + disadvantagePoints + skillPoints;
    const available = sheet.points.initial + sheet.points.earned - totalSpent;
    return { hpMax, fpMax, will, perception, speed, basicLift, carriedWeight, encumbrance, encName: encNames[encumbrance], dodge, move, attributePoints, advantagePoints, disadvantagePoints, skillPoints, totalSpent, available };
  }, [sheet]);

  const addLog = (text: string, kind: LogItem["kind"] = "note") => {
    setSheet((current) => ({ ...current, log: [{ id: makeId(), time: now(), text, kind }, ...current.log].slice(0, 20) }));
  };

  const navigateTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateIdentity = (field: keyof Sheet["identity"], value: string) => {
    setSheet((current) => ({ ...current, identity: { ...current.identity, [field]: value } }));
  };

  const updateAttribute = (field: keyof Sheet["attributes"], value: number) => {
    setSheet((current) => ({ ...current, attributes: { ...current.attributes, [field]: value } }));
  };

  const updateSecondary = (field: keyof Sheet["secondary"], value: number) => {
    setSheet((current) => ({ ...current, secondary: { ...current.secondary, [field]: value } }));
  };

  const changeResource = (resource: "hpCurrent" | "fpCurrent", delta: number) => {
    const max = resource === "hpCurrent" ? calculated.hpMax : calculated.fpMax;
    const label = resource === "hpCurrent" ? "HP" : "FP";
    setSheet((current) => ({ ...current, secondary: { ...current.secondary, [resource]: Math.max(0, Math.min(max, current.secondary[resource] + delta)) } }));
    addLog(`${delta > 0 ? "Recuperou" : "Perdeu"} ${Math.abs(delta)} ${label}.`, "health");
  };

  const roll3d6 = (label: string, target: number) => {
    const dice = Array.from({ length: 3 }, () => Math.floor(Math.random() * 6) + 1);
    const total = dice.reduce((sum, die) => sum + die, 0);
    const margin = target - total;
    setLastRoll({ label, dice, total, target });
    addLog(`${label}: 3d6 → ${total} (${margin >= 0 ? `sucesso por ${margin}` : `falha por ${Math.abs(margin)}`}).`, "roll");
  };

  const updateTrait = (kind: "advantages" | "disadvantages", id: string, field: keyof Trait, value: string | number) => {
    setSheet((current) => ({ ...current, [kind]: current[kind].map((trait) => trait.id === id ? { ...trait, [field]: value } : trait) }));
  };

  const addTrait = (kind: "advantages" | "disadvantages") => {
    const newTrait: Trait = { id: makeId(), name: kind === "advantages" ? "Nova vantagem" : "Nova desvantagem", cost: kind === "advantages" ? 5 : -5, notes: "", source: "" };
    setSheet((current) => ({ ...current, [kind]: [...current[kind], newTrait] }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setSheet((current) => ({ ...current, skills: current.skills.map((skill) => skill.id === id ? { ...skill, [field]: value } : skill) }));
  };

  const updateItem = (id: string, field: keyof InventoryItem, value: string | number | boolean) => {
    setSheet((current) => ({ ...current, inventory: current.inventory.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  };

  const updateAttack = (id: string, field: keyof Attack, value: string | number) => {
    setSheet((current) => ({ ...current, attacks: current.attacks.map((attack) => attack.id === id ? { ...attack, [field]: value } : attack) }));
  };

  const updateArmor = (id: string, field: keyof Armor, value: string | number) => {
    setSheet((current) => ({ ...current, armor: current.armor.map((armor) => armor.id === id ? { ...armor, [field]: value } : armor) }));
  };

  const toggleCondition = (condition: string) => {
    setSheet((current) => ({ ...current, conditions: current.conditions.includes(condition) ? current.conditions.filter((item) => item !== condition) : [...current.conditions, condition] }));
  };

  const resetSheet = () => {
    setSheet(initialSheet);
    setLastRoll(null);
  };

  const safeFileName = (value: string) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase() || "personagem";

  const exportJson = () => {
    const exportedSheet = {
      schemaVersion: "1.0",
      application: "Ficha GURPS 4e — Códice de Campo",
      exportedAt: new Date().toISOString(),
      character: sheet,
      calculations: {
        hpMax: calculated.hpMax,
        fpMax: calculated.fpMax,
        will: calculated.will,
        perception: calculated.perception,
        speed: calculated.speed,
        move: calculated.move,
        dodge: calculated.dodge,
        basicLift: calculated.basicLift,
        carriedWeight: calculated.carriedWeight,
        encumbrance: calculated.encumbrance,
        pointsSpent: calculated.totalSpent,
        pointsAvailable: calculated.available,
      },
    };
    const blob = new Blob([JSON.stringify(exportedSheet, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ficha-gurps4e-${safeFileName(sheet.identity.name)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    addLog("Exportou a ficha em JSON.", "note");
  };

  const exportPdf = () => {
    addLog("Abriu a ficha para salvar em PDF.", "note");
    window.setTimeout(() => window.print(), 80);
  };

  const createCharacter = () => {
    const blankSheet = JSON.parse(JSON.stringify(initialSheet)) as Sheet;
    blankSheet.identity = { name: "Novo personagem", player: "", campaign: "", world: "", concept: "Defina a próxima aventura.", race: "Humano", tl: "TL 3" };
    blankSheet.attributes = { st: 10, dx: 10, iq: 10, ht: 10 };
    blankSheet.secondary = { hpCurrent: 10, hpBonus: 0, fpCurrent: 10, fpBonus: 0, willBonus: 0, perBonus: 0, speedBonus: 0, moveBase: 5, moveBonus: 0, dodgeBonus: 0 };
    blankSheet.points = { initial: 150, earned: 0 };
    blankSheet.advantages = [];
    blankSheet.disadvantages = [];
    blankSheet.skills = [];
    blankSheet.inventory = [];
    blankSheet.attacks = [];
    blankSheet.armor = [];
    blankSheet.conditions = [];
    blankSheet.log = [{ id: makeId(), time: now(), text: "Nova ficha criada no Arquivo de Campanha.", kind: "note" }];
    const character = { id: makeId(), sheet: blankSheet, createdAt: Date.now(), updatedAt: Date.now() };
    setCharacters((current) => [character, ...current]);
    setActiveCharacterId(character.id);
    setActiveSection("visao-geral");
    setLastRoll(null);
    setView("sheet");
  };

  const openCharacter = (id: string) => {
    setActiveCharacterId(id);
    setActiveSection("visao-geral");
    setLastRoll(null);
    setView("sheet");
    window.setTimeout(() => window.scrollTo({ top: 0 }), 0);
  };

  const duplicateCharacter = (id: string) => {
    const source = characters.find((character) => character.id === id);
    if (!source) return;
    const duplicateSheet = JSON.parse(JSON.stringify(source.sheet)) as Sheet;
    duplicateSheet.identity.name = `Cópia de ${source.sheet.identity.name || "personagem"}`;
    duplicateSheet.log = [{ id: makeId(), time: now(), text: `Ficha duplicada a partir de ${source.sheet.identity.name || "personagem"}.`, kind: "note" }];
    const duplicate = { id: makeId(), sheet: duplicateSheet, createdAt: Date.now(), updatedAt: Date.now() };
    setCharacters((current) => [duplicate, ...current]);
    setActiveCharacterId(duplicate.id);
    setView("sheet");
  };

  const deleteCharacter = (id: string) => {
    if (characters.length === 1) return;
    const character = characters.find((item) => item.id === id);
    if (!window.confirm(`Excluir permanentemente a ficha “${character?.sheet.identity.name || "Sem nome"}”?`)) return;
    const remaining = characters.filter((item) => item.id !== id);
    setCharacters(remaining);
    if (id === activeCharacter.id) setActiveCharacterId(remaining[0].id);
  };

  if (view === "library") return <CharacterLibrary characters={characters} onCreate={createCharacter} onOpen={openCharacter} onDuplicate={duplicateCharacter} onDelete={deleteCharacter} />;

  return (
    <div className="codex-shell">
      <aside className="codex-sidebar" style={{ backgroundImage: `linear-gradient(180deg, rgba(14, 29, 43, .93), rgba(19, 39, 44, .97)), url(${SIDEBAR})` }}>
        <div className="brand-lockup">
          <img src={MARK} alt="Marca geométrica do Códice de Campo" />
          <div><span>FICHA DIGITAL</span><strong>GURPS <em>4e</em></strong></div>
        </div>
        <div className="sidebar-character">
          <span className="eyebrow eyebrow--light">Personagem ativo</span>
          <h1>{sheet.identity.name || "Sem nome"}</h1>
          <p>{sheet.identity.concept || "Defina o conceito"}</p>
          <div className="sidebar-character__badges"><span>{sheet.identity.race}</span><span>{sheet.identity.tl}</span></div>
        </div>
        <button type="button" className="library-entry" onClick={() => setView("library")}><img src={MARK} alt="" /> <span>Arquivo de personagens</span><b>{characters.length}</b></button>
        <nav className="codex-nav" aria-label="Seções da ficha">
          {navItems.map(({ id, label, icon: Icon }, index) => (
            <button key={id} type="button" className={activeSection === id ? "is-active" : ""} onClick={() => navigateTo(id)}>
              <span className="codex-nav__index"><img src={MARK} alt="" />0{index + 1}</span><Icon size={17} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer"><span>Salvamento local</span><div><Save size={15} /> Atualizado agora</div></div>
      </aside>

      <main className="codex-main">
        <div className="mobile-brand"><img src={MARK} alt="" /><span>GURPS 4e</span><button type="button" onClick={() => setView("library")}><UsersRound size={16} /> Arquivo</button><button type="button" onClick={() => navigateTo("diario")}><Dices size={17} /> Rolar</button></div>
        <section className="banner" style={{ backgroundImage: `linear-gradient(90deg, rgba(248, 244, 235, .96) 0%, rgba(248, 244, 235, .82) 53%, rgba(248, 244, 235, .22) 100%), url(${BANNER})` }}>
          <div className="banner__topline"><span>FICHA DE AVENTUREIRO</span><span className="banner__sync"><Activity size={14} /> Estado de sessão</span></div>
          <div className="banner__content"><p className="eyebrow">{sheet.identity.campaign || "Campanha sem título"} <i>•</i> {sheet.identity.world || "Mundo sem título"}</p><h2>{sheet.identity.name || "Nome do personagem"}</h2><p>{sheet.identity.concept || "Descreva o papel deste personagem na mesa."}</p></div>
          <div className="banner__instruments">
            <div className="instrument-panel__head"><img src={MARK} alt="" /><span>Instrumentos de sessão</span></div>
            <div><HeartPulse size={14} /><span>HP</span><b>{sheet.secondary.hpCurrent}/{calculated.hpMax}</b></div>
            <div><Activity size={14} /><span>FP</span><b>{sheet.secondary.fpCurrent}/{calculated.fpMax}</b></div>
            <div><Shield size={14} /><span>Dodge</span><b>{calculated.dodge}</b></div>
            <div><Crosshair size={14} /><span>Move</span><b>{calculated.move}</b></div>
            <div className="instrument-panel__points"><WandSparkles size={14} /><span>Pontos</span><b className={calculated.available < 0 ? "is-negative" : ""}>{calculated.available}</b></div>
          </div>
        </section>

        <div className="codex-content">
          <section id="visao-geral" className="codex-section">
            <SectionHeader kicker="01 · NÚCLEO" title="Visão geral" description="Ajuste a identidade e os valores que sustentam o personagem." icon={UserRound} />
            <div className="overview-grid">
              <div className="paper-card identity-card">
                <div className="portrait-frame"><img src={PORTRAIT} alt="Retrato ilustrado de personagem exemplo" /><span>Retrato de referência</span></div>
                <div className="identity-form">
                  <label className="field field--wide"><span>Nome</span><input value={sheet.identity.name} onChange={(event) => updateIdentity("name", event.target.value)} /></label>
                  <label className="field"><span>Jogador</span><input value={sheet.identity.player} onChange={(event) => updateIdentity("player", event.target.value)} /></label>
                  <label className="field"><span>Raça / espécie</span><input value={sheet.identity.race} onChange={(event) => updateIdentity("race", event.target.value)} /></label>
                  <label className="field"><span>Campanha</span><input value={sheet.identity.campaign} onChange={(event) => updateIdentity("campaign", event.target.value)} /></label>
                  <label className="field"><span>Mundo</span><input value={sheet.identity.world} onChange={(event) => updateIdentity("world", event.target.value)} /></label>
                  <label className="field"><span>Nível tecnológico</span><input value={sheet.identity.tl} onChange={(event) => updateIdentity("tl", event.target.value)} /></label>
                  <label className="field field--wide"><span>Conceito</span><input value={sheet.identity.concept} onChange={(event) => updateIdentity("concept", event.target.value)} /></label>
                </div>
              </div>
              <div className="attribute-panel">
                <div className="attribute-panel__title"><span className="eyebrow">Atributos primários</span><p>Valor-base e custo automático.</p></div>
                <div className="attribute-grid">
                  {(["st", "dx", "iq", "ht"] as const).map((attribute) => {
                    const labels = { st: "ST", dx: "DX", iq: "IQ", ht: "HT" };
                    const costs = { st: 10, dx: 20, iq: 20, ht: 10 };
                    return <label key={attribute} className="attribute-tile"><span>{labels[attribute]}</span><input aria-label={labels[attribute]} type="number" min="1" value={sheet.attributes[attribute]} onChange={(event) => updateAttribute(attribute, number(event.target.value))} /><small>{sheet.attributes[attribute] - 10 >= 0 ? "+" : ""}{sheet.attributes[attribute] - 10} nível · {(sheet.attributes[attribute] - 10) * costs[attribute]} pts</small></label>;
                  })}
                </div>
                <div className="derived-list">
                  <div><span>ST para dano</span><b>Thrust / Swing</b><small>Use a tabela da campanha</small></div>
                  <div><span>Basic Lift</span><b>{format(calculated.basicLift, 1)} lb</b><small>{format(calculated.basicLift * 0.453592, 1)} kg de referência</small></div>
                </div>
              </div>
            </div>

            <div className="metrics-grid">
              <MetricCard label="HP" value={`${sheet.secondary.hpCurrent}/${calculated.hpMax}`} detail="Pontos de vida" tone="red" />
              <MetricCard label="FP" value={`${sheet.secondary.fpCurrent}/${calculated.fpMax}`} detail="Fadiga" tone="moss" />
              <MetricCard label="Will" value={calculated.will} detail={`IQ ${sheet.attributes.iq} + ${sheet.secondary.willBonus}`} />
              <MetricCard label="Per" value={calculated.perception} detail={`IQ ${sheet.attributes.iq} + ${sheet.secondary.perBonus}`} />
              <MetricCard label="Speed" value={format(calculated.speed, 2)} detail="Velocidade básica" />
              <MetricCard label="Move" value={calculated.move} detail={`Carga ${calculated.encName.toLowerCase()}`} />
              <MetricCard label="Dodge" value={calculated.dodge} detail="Defesa ativa" />
            </div>

            <div className="resource-grid">
              <div className="paper-card resource-card">
                <div><span className="eyebrow">RECURSO CRÍTICO</span><h3>Vida e fadiga</h3><p>Ajustes rápidos registrados no diário.</p></div>
                <div className="resource-controls">
                  <div className="resource-line"><HeartPulse size={20} /><span>HP</span><div className="resource-bar"><i style={{ width: `${Math.min(100, (sheet.secondary.hpCurrent / calculated.hpMax) * 100)}%` }} /></div><b>{sheet.secondary.hpCurrent}/{calculated.hpMax}</b><button type="button" onClick={() => changeResource("hpCurrent", -1)}><Minus size={14} /></button><button type="button" onClick={() => changeResource("hpCurrent", 1)}><Plus size={14} /></button></div>
                  <div className="resource-line"><Activity size={20} /><span>FP</span><div className="resource-bar resource-bar--moss"><i style={{ width: `${Math.min(100, (sheet.secondary.fpCurrent / calculated.fpMax) * 100)}%` }} /></div><b>{sheet.secondary.fpCurrent}/{calculated.fpMax}</b><button type="button" onClick={() => changeResource("fpCurrent", -1)}><Minus size={14} /></button><button type="button" onClick={() => changeResource("fpCurrent", 1)}><Plus size={14} /></button></div>
                </div>
              </div>
              <div className="paper-card modifier-card">
                <div><span className="eyebrow">AJUSTES DERIVADOS</span><h3>Modificadores rápidos</h3></div>
                <div className="modifier-fields">
                  <label><span>HP bônus</span><input type="number" value={sheet.secondary.hpBonus} onChange={(event) => updateSecondary("hpBonus", number(event.target.value))} /></label>
                  <label><span>FP bônus</span><input type="number" value={sheet.secondary.fpBonus} onChange={(event) => updateSecondary("fpBonus", number(event.target.value))} /></label>
                  <label><span>Will</span><input type="number" value={sheet.secondary.willBonus} onChange={(event) => updateSecondary("willBonus", number(event.target.value))} /></label>
                  <label><span>Per</span><input type="number" value={sheet.secondary.perBonus} onChange={(event) => updateSecondary("perBonus", number(event.target.value))} /></label>
                  <label><span>Move</span><input type="number" value={sheet.secondary.moveBonus} onChange={(event) => updateSecondary("moveBonus", number(event.target.value))} /></label>
                  <label><span>Dodge</span><input type="number" value={sheet.secondary.dodgeBonus} onChange={(event) => updateSecondary("dodgeBonus", number(event.target.value))} /></label>
                </div>
              </div>
            </div>
          </section>

          <section id="combate" className="codex-section">
            <SectionHeader kicker="02 · AÇÃO" title="Combate e proteção" description="Ataques, defesas ativas e a cobertura que acompanha a expedição." icon={Swords} action={<Button type="button" variant="outline" className="add-button" onClick={() => setSheet((current) => ({ ...current, attacks: [...current.attacks, { id: makeId(), name: "Novo ataque", level: sheet.attributes.dx, damage: "—", reach: "—", parry: "—" }] }))}><Plus size={15} /> Ataque</Button>} />
            <div className="combat-overview">
              <div className="combat-defenses">
                <div className="defense-banner"><Shield size={24} /><div><span>Defesas ativas</span><strong>Dodge {calculated.dodge}</strong></div><small>Speed ⌊{format(calculated.speed, 2)}⌋ + 3 {calculated.encumbrance ? `− carga ${calculated.encumbrance}` : ""}</small></div>
                <div className="attack-list">
                  {sheet.attacks.map((attack) => <div className="attack-row" key={attack.id}>
                    <div className="attack-row__name"><input value={attack.name} onChange={(event) => updateAttack(attack.id, "name", event.target.value)} /><span>NH <input type="number" value={attack.level} onChange={(event) => updateAttack(attack.id, "level", number(event.target.value))} /></span></div>
                    <label><span>Dano</span><input value={attack.damage} onChange={(event) => updateAttack(attack.id, "damage", event.target.value)} /></label>
                    <label><span>Reach</span><input value={attack.reach} onChange={(event) => updateAttack(attack.id, "reach", event.target.value)} /></label>
                    <label><span>Parry</span><input value={attack.parry} onChange={(event) => updateAttack(attack.id, "parry", event.target.value)} /></label>
                    <button type="button" className="sigil-action" aria-label={`Rolar ${attack.name}`} onClick={() => roll3d6(attack.name, attack.level)}><img src={MARK} alt="" /></button>
                  </div>)}
                </div>
              </div>
              <div className="protection-map">
                <div className="protection-map__title"><span className="eyebrow">PROTEÇÃO</span><h3>Resistência por local</h3></div>
                <img src={BODY_MAP} alt="Mapa corporal técnico com zonas de proteção" />
                <div className="armor-list">{sheet.armor.map((armor) => <div key={armor.id}><input value={armor.location} onChange={(event) => updateArmor(armor.id, "location", event.target.value)} /><span>DR</span><input type="number" value={armor.dr} onChange={(event) => updateArmor(armor.id, "dr", number(event.target.value))} /><input value={armor.source} aria-label={`Fonte de proteção em ${armor.location}`} onChange={(event) => updateArmor(armor.id, "source", event.target.value)} /></div>)}</div>
              </div>
            </div>
            <div className="conditions-panel"><div><span className="eyebrow">ESTADO DE CENA</span><p>Os efeitos são visíveis enquanto estiverem ativos.</p></div><div>{["Atordoado", "Ferido", "Derrubado", "Agarrado", "Exausto", "Envenenado"].map((condition) => <button key={condition} type="button" className={sheet.conditions.includes(condition) ? "condition is-on" : "condition"} onClick={() => toggleCondition(condition)}>{sheet.conditions.includes(condition) ? <Shield size={14} /> : <Plus size={14} />}{condition}</button>)}</div></div>
          </section>

          <section id="caracteristicas" className="codex-section">
            <SectionHeader kicker="03 · CONSTRUÇÃO" title="Características" description="Vantagens, desvantagens e custos mantêm o orçamento da ficha legível." icon={Sparkles} />
            <div className="traits-grid">
              {(["advantages", "disadvantages"] as const).map((kind) => <div className={`trait-card ${kind === "advantages" ? "trait-card--positive" : "trait-card--negative"}`} key={kind}>
                <div className="trait-card__head"><div><span className="eyebrow">{kind === "advantages" ? "A FAVOR" : "LIMITES"}</span><h3>{kind === "advantages" ? "Vantagens" : "Desvantagens & quirks"}</h3></div><button type="button" onClick={() => addTrait(kind)}><Plus size={16} /></button></div>
                <div className="trait-rows">{sheet[kind].map((trait) => <div key={trait.id} className="trait-row"><input value={trait.name} aria-label="Nome" onChange={(event) => updateTrait(kind, trait.id, "name", event.target.value)} /><textarea value={trait.notes} aria-label="Notas" placeholder="Notas de uso" onChange={(event) => updateTrait(kind, trait.id, "notes", event.target.value)} /><label><span>Pts</span><input type="number" value={trait.cost} onChange={(event) => updateTrait(kind, trait.id, "cost", number(event.target.value))} /></label><input className="trait-row__source" value={trait.source} aria-label="Fonte" placeholder="Fonte" onChange={(event) => updateTrait(kind, trait.id, "source", event.target.value)} /></div>)}</div>
                <div className="trait-card__total"><span>Total</span><strong>{kind === "advantages" ? `+${calculated.advantagePoints}` : calculated.disadvantagePoints} pts</strong></div>
              </div>)}
            </div>
          </section>

          <section id="pericias" className="codex-section">
            <SectionHeader kicker="04 · COMPETÊNCIA" title="Perícias" description="Nível efetivo, dificuldade e pontos em uma leitura compacta de mesa." icon={Target} action={<Button type="button" variant="outline" className="add-button" onClick={() => setSheet((current) => ({ ...current, skills: [...current.skills, { id: makeId(), name: "Nova perícia", attribute: "DX", difficulty: "Média", relative: "DX+0", level: sheet.attributes.dx, points: 1 }] }))}><Plus size={15} /> Perícia</Button>} />
            <div className="paper-card table-card"><div className="skill-table skill-table--head"><span>Perícia</span><span>Atributo</span><span>Dificuldade</span><span>Relativo</span><span>NH</span><span>Pontos</span><span /></div>{sheet.skills.map((skill) => <div className="skill-table" key={skill.id}><input value={skill.name} onChange={(event) => updateSkill(skill.id, "name", event.target.value)} /><input value={skill.attribute} onChange={(event) => updateSkill(skill.id, "attribute", event.target.value)} /><input value={skill.difficulty} onChange={(event) => updateSkill(skill.id, "difficulty", event.target.value)} /><input value={skill.relative} onChange={(event) => updateSkill(skill.id, "relative", event.target.value)} /><input type="number" value={skill.level} onChange={(event) => updateSkill(skill.id, "level", number(event.target.value))} /><input type="number" value={skill.points} onChange={(event) => updateSkill(skill.id, "points", number(event.target.value))} /><button type="button" className="sigil-action" aria-label={`Rolar ${skill.name}`} onClick={() => roll3d6(skill.name, skill.level)}><img src={MARK} alt="" /></button></div>)}<div className="skill-table__footer"><span>Investimento em perícias</span><strong>{calculated.skillPoints} pts</strong><small>Escolha um nível e role 3d6 diretamente da ficha.</small></div></div>
          </section>

          <section id="inventario" className="codex-section">
            <SectionHeader kicker="05 · CARGA" title="Equipamento" description="Controle o que está carregando e acompanhe o efeito sobre movimento e defesa." icon={Backpack} action={<Button type="button" variant="outline" className="add-button" onClick={() => setSheet((current) => ({ ...current, inventory: [...current.inventory, { id: makeId(), name: "Novo item", category: "Utilidade", quantity: 1, weight: 0, carried: true, equipped: false }] }))}><PackagePlus size={15} /> Item</Button>} />
            <div className="inventory-layout"><div className="paper-card inventory-table"><div className="item-grid item-grid--head"><span>Item</span><span>Categoria</span><span>Qtd.</span><span>Peso un.</span><span>Carregar</span><span>Equipar</span></div>{sheet.inventory.map((item) => <div className="item-grid" key={item.id}><input value={item.name} onChange={(event) => updateItem(item.id, "name", event.target.value)} /><input value={item.category} onChange={(event) => updateItem(item.id, "category", event.target.value)} /><input type="number" min="0" value={item.quantity} onChange={(event) => updateItem(item.id, "quantity", number(event.target.value))} /><label className="weight-input"><input type="number" min="0" step="0.1" value={item.weight} onChange={(event) => updateItem(item.id, "weight", number(event.target.value))} /><span>lb</span></label><label className="switch-label"><input type="checkbox" checked={item.carried} onChange={(event) => updateItem(item.id, "carried", event.target.checked)} /><i /></label><label className="switch-label"><input type="checkbox" checked={item.equipped} onChange={(event) => updateItem(item.id, "equipped", event.target.checked)} /><i /></label></div>)}</div>
              <div className={`load-card load-card--${calculated.encumbrance >= 3 ? "danger" : calculated.encumbrance >= 1 ? "watch" : "safe"}`}><Weight size={23} /><span className="eyebrow">CARGA ATUAL</span><strong>{format(calculated.carriedWeight, 1)} <small>lb</small></strong><p>Basic Lift: <b>{format(calculated.basicLift, 1)} lb</b></p><div className="load-scale">{[0, 1, 2, 3, 4].map((level) => <i key={level} className={calculated.encumbrance >= level ? "is-filled" : ""} />)}</div><div className="load-card__status"><span>{calculated.encName}</span><b>Move {calculated.move} · Dodge {calculated.dodge}</b></div><small>{calculated.encumbrance >= 5 ? "A carga excede o limite de referência." : "Movimento e Dodge já incluem a carga."}</small></div>
            </div>
          </section>

          <section id="diario" className="codex-section codex-section--last">
            <SectionHeader kicker="06 · SESSÃO" title="Diário e dados" description="Todo evento que muda a cena pode ficar registrado aqui." icon={History} />
            <div className="diary-grid"><div className="roll-station"><div className="roll-station__top"><img className="roll-station__sigil" src={MARK} alt="" /><div><span className="eyebrow eyebrow--light">ROLAGEM PADRÃO</span><h3>3d6 de mesa</h3></div></div><p>Selecione qualquer ataque ou perícia e use o selo de dados. Para um teste livre, role o atributo desejado.</p><div className="quick-rolls"><button type="button" onClick={() => roll3d6("Teste de ST", sheet.attributes.st)}>ST {sheet.attributes.st}</button><button type="button" onClick={() => roll3d6("Teste de DX", sheet.attributes.dx)}>DX {sheet.attributes.dx}</button><button type="button" onClick={() => roll3d6("Teste de IQ", sheet.attributes.iq)}>IQ {sheet.attributes.iq}</button><button type="button" onClick={() => roll3d6("Teste de HT", sheet.attributes.ht)}>HT {sheet.attributes.ht}</button></div>{lastRoll ? <div className="roll-result"><div className="dice-set">{lastRoll.dice.map((die, index) => <span key={`${die}-${index}`} data-value={die}>{die}</span>)}</div><div><span>{lastRoll.label}</span><strong>{lastRoll.total}</strong><small>{lastRoll.total <= lastRoll.target ? `Sucesso por ${lastRoll.target - lastRoll.total}` : `Falha por ${lastRoll.total - lastRoll.target}`}</small></div></div> : <div className="roll-result roll-result--idle"><Dices size={21} /><span>A próxima rolagem aparecerá aqui.</span></div>}</div>
              <div className="paper-card log-card"><div className="log-card__head"><div><span className="eyebrow">HISTÓRICO</span><h3>Registro da sessão</h3></div><button type="button" onClick={() => addLog("Nota manual adicionada à sessão.", "note")}><Plus size={15} /> Nota</button></div><div className="log-list">{sheet.log.map((entry) => <div className={`log-entry log-entry--${entry.kind}`} key={entry.id}><time>{entry.time}</time><i>{entry.kind === "roll" ? <Dices size={15} /> : entry.kind === "health" ? <HeartPulse size={15} /> : <ScrollText size={15} />}</i><p>{entry.text}</p></div>)}</div></div>
            </div>
            <div className="points-ledger"><div><span className="eyebrow">ORÇAMENTO</span><h3>Pontos de personagem</h3><p>A conta abaixo muda ao editar atributos, traços e perícias.</p></div><div className="ledger-values"><label><span>Iniciais</span><input type="number" value={sheet.points.initial} onChange={(event) => setSheet((current) => ({ ...current, points: { ...current.points, initial: number(event.target.value) } }))} /></label><label><span>Ganhos</span><input type="number" value={sheet.points.earned} onChange={(event) => setSheet((current) => ({ ...current, points: { ...current.points, earned: number(event.target.value) } }))} /></label><div><span>Gastos</span><strong>{calculated.totalSpent}</strong></div><div className={calculated.available < 0 ? "ledger-total is-negative" : "ledger-total"}><span>Disponíveis</span><strong>{calculated.available}</strong></div></div><div className="ledger-breakdown"><span>Atributos <b>{calculated.attributePoints}</b></span><span>Vantagens <b>{calculated.advantagePoints}</b></span><span>Desvantagens <b>{calculated.disadvantagePoints}</b></span><span>Perícias <b>{calculated.skillPoints}</b></span></div></div>
            {calculated.available < 0 && <div className="validation-warning"><CircleAlert size={18} /><span>Você ultrapassou o orçamento por {Math.abs(calculated.available)} pontos. Revise atributos, traços ou a recompensa da campanha.</span></div>}
            <div className="bottom-actions"><span><ArrowDownRight size={16} /> Esta ficha é salva apenas neste navegador.</span><div className="export-actions"><button type="button" onClick={exportJson}><FileJson size={16} /> Baixar JSON</button><button type="button" className="pdf-action" onClick={exportPdf}><Printer size={16} /> Salvar em PDF</button><button type="button" className="restore-action" onClick={resetSheet}><ArrowUpRight size={16} /> Restaurar exemplo</button></div></div>
          </section>
        </div>
      </main>

      <div className="vitals-ribbon" aria-label="Resumo persistente de recursos"><div><HeartPulse size={15} /><span>HP</span><b>{sheet.secondary.hpCurrent}/{calculated.hpMax}</b></div><div><Activity size={15} /><span>FP</span><b>{sheet.secondary.fpCurrent}/{calculated.fpMax}</b></div><div><Shield size={15} /><span>Dodge</span><b>{calculated.dodge}</b></div><div><Crosshair size={15} /><span>Move</span><b>{calculated.move}</b></div><div><WandSparkles size={15} /><span>Pts</span><b>{calculated.available}</b></div></div>
    </div>
  );
}
