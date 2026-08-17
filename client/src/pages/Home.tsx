/**
 * Códice de Campo: neoeditorial utilitário para jogo de mesa.
 * Este arquivo privilegia densidade legível, estados sempre visíveis e ações rápidas de sessão.
 */
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { liveSocket } from "@/lib/live";
import { trpc } from "@/lib/trpc";
import { allyFrequencyMultipliers, allyPowerCosts, calculateAllyCostByRule } from "@shared/allyRules";
import { calculatePointBudget, SECONDARY_POINT_COSTS } from "@shared/characterPoints";
import { selectCloudBackedRecords } from "@shared/cloudSync";
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
  Cloud,
  Dices,
  Eye,
  FileJson,
  FilePlus2,
  HeartPulse,
  History,
  ImageUp,
  LogIn,
  LogOut,
  Minus,
  PackagePlus,
  Plus,
  Printer,
  Save,
  ScrollText,
  Share2,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trash2,
  UserCheck,
  UserPlus,
  UserRound,
  UsersRound,
  WandSparkles,
  Weight,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Trait = { id: string; name: string; cost: number; notes: string; source: string };
type Skill = { id: string; name: string; attribute: string; difficulty: string; relative: string; level: number; points: number };
type InventoryItem = { id: string; name: string; category: string; quantity: number; weight: number; carried: boolean; equipped: boolean };
type Attack = { id: string; name: string; level: number; damage: string; reach: string; parry: string };
type Armor = { id: string; location: string; dr: number; source: string };
type Power = { id: string; name: string; source: string; type: "Ofensivo" | "Defensivo" | "Utilidade" | "Controle"; level: number; fpCost: number; pointCost: number; range: string; damage: string; effect: string; combatReady: boolean };
type Mission = { id: string; title: string; difficulty: "Baixa" | "Média" | "Alta" | "Épica" | "Lendária"; status: "Planejada" | "Em andamento" | "Concluída" | "Fracassada"; pointsReward: number; moneyReward: number; currency: string; notes: string; applied: boolean };
type HomebrewEntry = { id: string; category: "Regra" | "Raça" | "Habilidade" | "Equipamento" | "Nota"; title: string; content: string; source: string };
type LogItem = { id: string; time: string; text: string; kind: "roll" | "health" | "note" };
type Ally = { id: string; name: string; relation: string; description: string; points: number; cost: number; hpCurrent: number; hpMax: number; status: string; type?: string; race?: string; appearance?: string; personality?: string; history?: string; motivation?: string; notes?: string; powerPercent?: 25 | 50 | 75 | 100 | 150; frequency?: 6 | 9 | 12 | 15; isDependent?: boolean; attributes?: { st: number; dx: number; iq: number; ht: number }; fpCurrent?: number; fpMax?: number; advantages?: Trait[]; disadvantages?: Trait[]; skills?: Skill[]; attacks?: Attack[]; inventory?: InventoryItem[]; conditions?: string[] };

const ALLY_STATUS_OPTIONS = ["Pronto", "Ferido", "Incapacitado", "Ausente", "Morto", "Desaparecido", "Ex-aliado"] as const;

function AllyStatusSelect({ value, onValueChange }: { value: string; onValueChange: (nextStatus: string) => void }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="ally-status-select" aria-label="Estado do aliado">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="ally-status-menu">
        {ALLY_STATUS_OPTIONS.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

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
  powers: Power[];
  allies: Ally[];
  missions: Mission[];
  homebrew: HomebrewEntry[];
  conditions: string[];
  log: LogItem[];
};

type CharacterRecord = { id: string; sheet: Sheet; portraitUrl?: string | null; createdAt: number; updatedAt: number };

const secondaryModifierFields: Array<{ field: keyof typeof SECONDARY_POINT_COSTS; label: string }> = [
  { field: "hpBonus", label: "HP bônus" }, { field: "fpBonus", label: "FP bônus" }, { field: "willBonus", label: "Will" },
  { field: "perBonus", label: "Per" }, { field: "speedBonus", label: "Speed" }, { field: "moveBonus", label: "Move" }, { field: "dodgeBonus", label: "Dodge" },
];

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
const bodyZones = [
  { location: "Cabeça", code: "CAB" }, { location: "Pescoço", code: "PES" }, { location: "Tronco", code: "TRC" },
  { location: "Braço direito", code: "BD" }, { location: "Braço esquerdo", code: "BE" }, { location: "Mão direita", code: "MD" }, { location: "Mão esquerda", code: "ME" },
  { location: "Perna direita", code: "PD" }, { location: "Perna esquerda", code: "PE" }, { location: "Pé direito", code: "PTD" }, { location: "Pé esquerdo", code: "PTE" },
];

const allyTabs = [
  { id: "visao", label: "Visão geral", icon: BookOpen }, { id: "atributos", label: "Atributos", icon: Activity }, { id: "caracteristicas", label: "Características", icon: Sparkles },
  { id: "pericias", label: "Perícias", icon: Target }, { id: "combate", label: "Combate", icon: Swords }, { id: "inventario", label: "Inventário", icon: Backpack },
] as const;
type AllyTab = (typeof allyTabs)[number]["id"];

const normalizeAlly = (ally: Ally) => ({
  ...ally,
  type: ally.type || "Individual", race: ally.race || "Humano", appearance: ally.appearance || "", personality: ally.personality || "", history: ally.history || "", motivation: ally.motivation || "", notes: ally.notes || "",
  powerPercent: (ally.powerPercent || 25) as 25 | 50 | 75 | 100 | 150, frequency: (ally.frequency || 12) as 6 | 9 | 12 | 15, isDependent: ally.isDependent || false,
  attributes: ally.attributes || { st: 10, dx: 10, iq: 10, ht: 10 }, fpCurrent: ally.fpCurrent ?? 10, fpMax: ally.fpMax ?? 10,
  advantages: ally.advantages || [], disadvantages: ally.disadvantages || [], skills: ally.skills || [], attacks: ally.attacks || [], inventory: ally.inventory || [], conditions: ally.conditions || [],
});

const calculateAllyCost = (ally: Ally) => {
  const full = normalizeAlly(ally);
  return calculateAllyCostByRule(full.powerPercent, full.frequency);
};

const compressPortrait = (file: File, maxEdge: number, quality: number) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error("A imagem selecionada é inválida."));
    image.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) { reject(new Error("Não foi possível preparar a imagem.")); return; }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
});

const preparePortraitUpload = async (file: File) => {
  const firstPass = await compressPortrait(file, 1600, .84);
  if (firstPass.length <= 6_300_000) return firstPass;
  const secondPass = await compressPortrait(file, 1120, .72);
  if (secondPass.length <= 6_300_000) return secondPass;
  throw new Error("A imagem continua grande demais após a compressão.");
};

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
  powers: [],
  allies: [],
  missions: [],
  homebrew: [],
  conditions: [],
  log: [{ id: "log-1", time: "18:40", text: "Ficha iniciada no Códice de Campo.", kind: "note" }],
};

const navItems = [
  { id: "visao-geral", label: "Visão geral", icon: BookOpen },
  { id: "combate", label: "Combate", icon: Swords },
  { id: "poderes", label: "Poderes", icon: WandSparkles },
  { id: "caracteristicas", label: "Características", icon: Sparkles },
  { id: "pericias", label: "Perícias", icon: Target },
  { id: "inventario", label: "Equipamento", icon: Backpack },
  { id: "aliados", label: "Aliados", icon: UsersRound },
  { id: "missoes", label: "Missões", icon: ScrollText },
  { id: "homebrew", label: "Homebrew", icon: Sparkles },
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

function CharacterLibrary({ characters, onCreate, onOpen, onDuplicate, onDelete, isAuthenticated, userName, onLogin, onLogout, sharedIds }: { characters: CharacterRecord[]; onCreate: () => void; onOpen: (id: string) => void; onDuplicate: (id: string) => void; onDelete: (id: string) => void; isAuthenticated: boolean; userName?: string | null; onLogin: () => void; onLogout: () => void; sharedIds: string[] }) {
  const sharedCharacters = characters.filter((character) => sharedIds.includes(character.id));
  return (
    <main className="library-shell">
      <section className="library-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(15, 31, 46, .98), rgba(15, 31, 46, .81) 56%, rgba(15, 31, 46, .24)), url(${SIDEBAR})` }}>
        <div className="library-brand"><img src={MARK} alt="Marca do Códice de Campo" /><div><span>ARQUIVO DE CAMPANHA</span><strong>GURPS <em>4e</em></strong></div></div>
        <div className="library-account">{isAuthenticated ? <><span><UserCheck size={14} /> CONTA CONECTADA</span><strong>{userName || "Aventureiro"}</strong><small>Fichas salvas e compartilháveis.</small><button type="button" onClick={onLogout}><LogOut size={13} /> Sair</button></> : <><span><UserRound size={14} /> ACESSO À CAMPANHA</span><strong>Entre para compartilhar</strong><small>Salve as fichas na nuvem e acompanhe a mesa ao vivo.</small><div><button type="button" onClick={onLogin}><LogIn size={13} /> Entrar</button><button type="button" className="account-create" onClick={onLogin}><UserPlus size={13} /> Criar conta</button></div></>}</div>
        <div className="library-hero__spine"><img src={MARK} alt="" /><span>ARQUIVO</span><b>04</b></div>
        <div className="library-hero__content"><span className="eyebrow eyebrow--light"><UsersRound size={13} /> {isAuthenticated ? "FICHAS SINCRONIZADAS" : "PERSONAGENS LOCAIS"}</span><h1>Seu grupo,<br />em um só códice.</h1><p>Crie fichas separadas, retome a edição de qualquer aventureiro e mantenha cada campanha organizada neste navegador.</p><div className="library-hero__register"><span><img src={MARK} alt="" /> {isAuthenticated ? "Nuvem ao vivo" : "Registro local"}</span><span>Fichas {String(characters.length).padStart(2, "0")}</span><span>JSON pronto</span></div><button type="button" className="library-create library-create--hero" onClick={onCreate}><img src={MARK} alt="" /> Criar personagem</button></div>
        <div className="library-hero__count"><img src={MARK} alt="" /><span>Fichas ativas</span><strong>{characters.length}</strong><small>{isAuthenticated ? "sincronizadas na nuvem" : "salvas neste dispositivo"}</small></div>
      </section>
      <section className="library-content">
        <div className="library-heading"><div><span className="eyebrow">ESTANTE DE CAMPO</span><h2>Personagens</h2><p>Selecione uma ficha para continuar a sessão ou comece uma nova página.</p></div><button type="button" className="library-create" onClick={onCreate}><img src={MARK} alt="" /> Nova ficha</button></div>
        <div className="library-ledger"><span><img src={MARK} alt="" /> ARQUIVO 01 · FICHAS</span><span>ESTADO · PRONTO PARA SESSÃO</span><span>SUPORTE · JSON / PDF</span><span>LINKS AO VIVO · {sharedIds.length}</span><span>ACESSO · {characters.length} REGISTRO{characters.length === 1 ? "" : "S"}</span></div>
        {isAuthenticated && <section className="library-share-board"><div><span className="eyebrow"><Cloud size={13} /> LINKS COMPARTILHADOS</span><h3>{sharedCharacters.length ? `${sharedCharacters.length} ficha${sharedCharacters.length === 1 ? "" : "s"} em sessão ao vivo` : "Nenhum link público ativo"}</h3><p>{sharedCharacters.length ? "Abra uma ficha para copiar, renovar ou acompanhar o link de campanha." : "Abra uma ficha e use Compartilhar ao vivo para convidar jogadores e espectadores."}</p></div>{sharedCharacters.length > 0 && <div className="library-share-board__list">{sharedCharacters.map((character) => <button key={character.id} type="button" onClick={() => onOpen(character.id)}><img src={character.portraitUrl || PORTRAIT} alt="" /><span><b>{character.sheet.identity.name || "Sem nome"}</b><small>{character.sheet.identity.campaign || "Campanha sem título"}</small></span><Eye size={15} /></button>)}</div>}</section>}
        <div className="character-shelf">
          {characters.map((character, index) => {
            const { sheet } = character;
            const hpMax = sheet.attributes.st + sheet.secondary.hpBonus;
            const fpMax = sheet.attributes.ht + sheet.secondary.fpBonus;
            const totalPoints = (sheet.attributes.st - 10) * 10 + (sheet.attributes.dx - 10) * 20 + (sheet.attributes.iq - 10) * 20 + (sheet.attributes.ht - 10) * 10 + sheet.advantages.reduce((sum, item) => sum + item.cost, 0) + sheet.disadvantages.reduce((sum, item) => sum + item.cost, 0) + sheet.skills.reduce((sum, item) => sum + item.points, 0);
            return <article className="character-card" key={character.id}>
              <div className="character-card__folio"><img src={MARK} alt="" /><span>FICHA</span><b>{String(index + 1).padStart(2, "0")}</b></div>
              <div className="character-card__portrait"><img src={character.portraitUrl || PORTRAIT} alt="" /></div>
              <div className="character-card__content"><div className="character-card__meta"><span>{sheet.identity.race || "Sem raça"}</span><i>•</i><span>{sheet.identity.tl || "TL —"}</span></div><h3>{sheet.identity.name || "Sem nome"}</h3><p>{sheet.identity.concept || "Personagem sem conceito definido."}</p><div className="character-card__tags"><span>{sheet.identity.campaign || "Sem campanha"}</span><span>{sheet.skills.length} perícias</span>{sharedIds.includes(character.id) && <span className="shared-tag"><Cloud size={11} /> Link ao vivo</span>}</div><div className="character-card__attributes"><span>ST <b>{sheet.attributes.st}</b></span><span>DX <b>{sheet.attributes.dx}</b></span><span>IQ <b>{sheet.attributes.iq}</b></span><span>HT <b>{sheet.attributes.ht}</b></span></div><div className="character-card__metrics"><div><span>HP</span><b>{sheet.secondary.hpCurrent}/{hpMax}</b></div><div><span>FP</span><b>{sheet.secondary.fpCurrent}/{fpMax}</b></div><div><span>Pontos</span><b>{totalPoints}</b></div></div></div>
              <div className="character-card__actions"><button type="button" className="character-open" onClick={() => onOpen(character.id)}><img src={MARK} alt="" /> Abrir ficha <ArrowRight size={16} /></button><button type="button" aria-label={`Duplicar ${sheet.identity.name || "personagem"}`} onClick={() => onDuplicate(character.id)}><Copy size={16} /></button><button type="button" className="delete-character" aria-label={`Excluir ${sheet.identity.name || "personagem"}`} onClick={() => onDelete(character.id)} disabled={characters.length === 1}><Trash2 size={16} /></button></div>
            </article>;
          })}
          <button type="button" className="character-card character-card--new" onClick={onCreate}><span className="new-character__seal"><img src={MARK} alt="" /></span><strong>Iniciar outra ficha</strong><small>Uma página limpa para o próximo personagem.</small><span className="new-character__action"><img src={MARK} alt="" /> Criar personagem</span></button>
        </div>
        <div className="library-note"><BookOpen size={17} /><span><b>{isAuthenticated ? "Nuvem compartilhada." : "Arquivo local."}</b> {isAuthenticated ? "Use o botão de compartilhamento dentro da ficha para gerar um link público atualizado durante a sessão." : "Suas fichas ficam separadas e salvas apenas neste navegador. Entre para sincronizar e compartilhar em tempo real."}</span></div>
      </section>
    </main>
  );
}

export default function Home() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
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
  const [selectedArmorLocation, setSelectedArmorLocation] = useState("Tronco");
  const [selectedAllyId, setSelectedAllyId] = useState<string | null>(null);
  const [activeAllyTab, setActiveAllyTab] = useState<AllyTab>("visao");
  const [remoteLoaded, setRemoteLoaded] = useState(false);
  const [cloudCharacterIds, setCloudCharacterIds] = useState<string[]>([]);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const saveDelay = useRef<number | null>(null);
  const applyingCloudUpdate = useRef(false);
  const charactersQuery = trpc.characters.list.useQuery(undefined, { enabled: isAuthenticated });
  const saveCharacter = trpc.characters.save.useMutation();
  const removeCharacter = trpc.characters.remove.useMutation();
  const createShare = trpc.characters.share.useMutation();
  const uploadPortrait = trpc.characters.uploadPortrait.useMutation();
  const sharesQuery = trpc.shares.list.useQuery(undefined, { enabled: isAuthenticated });
  const activeCharacter = characters.find((character) => character.id === activeCharacterId) || characters[0];
  const sheet = activeCharacter.sheet;
  const selectedAlly = (sheet.allies || []).find((ally) => ally.id === selectedAllyId) || (sheet.allies || [])[0];
  const activeAlly = selectedAlly ? normalizeAlly(selectedAlly) : null;

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

  useEffect(() => { setPortraitPreview(null); }, [activeCharacter.id]);

  useEffect(() => {
    if (!isAuthenticated || remoteLoaded || !charactersQuery.data) return;
    if (charactersQuery.data.length) {
      const remoteCharacters = charactersQuery.data.map((character) => ({
        id: character.id,
        sheet: character.sheet as unknown as Sheet,
        portraitUrl: character.portraitUrl,
        createdAt: character.createdAt.getTime(),
        updatedAt: character.updatedAt.getTime(),
      }));
      setCharacters(remoteCharacters);
      setActiveCharacterId(remoteCharacters[0].id);
      setCloudCharacterIds(remoteCharacters.map((character) => character.id));
    }
    setRemoteLoaded(true);
  }, [charactersQuery.data, isAuthenticated, remoteLoaded]);

  useEffect(() => {
    if (!isAuthenticated || !activeCharacter) return;
    liveSocket.connect();
    liveSocket.emit("watch-character", activeCharacter.id);
    const receiveUpdate = async (event: { characterId: string }) => {
      if (event.characterId !== activeCharacter.id) return;
      const refreshed = await charactersQuery.refetch();
      if (!refreshed.data) return;
      applyingCloudUpdate.current = true;
      setCharacters(refreshed.data.map((character) => ({
        id: character.id,
        sheet: character.sheet as unknown as Sheet,
        portraitUrl: character.portraitUrl,
        createdAt: character.createdAt.getTime(),
        updatedAt: character.updatedAt.getTime(),
      })));
    };
    liveSocket.on("character-updated", receiveUpdate);
    return () => {
      liveSocket.off("character-updated", receiveUpdate);
      liveSocket.disconnect();
    };
  }, [activeCharacter.id, charactersQuery.refetch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !remoteLoaded) return;
    if (applyingCloudUpdate.current) { applyingCloudUpdate.current = false; return; }
    const cloudCharacters = selectCloudBackedRecords(characters, cloudCharacterIds);
    if (!cloudCharacters.length) return;
    if (saveDelay.current) window.clearTimeout(saveDelay.current);
    saveDelay.current = window.setTimeout(() => {
      cloudCharacters.forEach((character) => {
        saveCharacter.mutate({ id: character.id, name: character.sheet.identity.name || "Sem nome", portraitUrl: character.portraitUrl ?? null, sheet: character.sheet as unknown as Record<string, unknown> });
      });
    }, 700);
    return () => { if (saveDelay.current) window.clearTimeout(saveDelay.current); };
  }, [characters, cloudCharacterIds, isAuthenticated, remoteLoaded]);

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
    const powerPoints = (sheet.powers || []).reduce((sum, power) => sum + power.pointCost, 0);
    const allyCost = (sheet.allies || []).reduce((sum, ally) => sum + calculateAllyCost(ally), 0);
    const pointBudget = calculatePointBudget({ attributes: sheet.attributes, secondary: sheet.secondary, advantages: sheet.advantages, disadvantages: sheet.disadvantages, skills: sheet.skills, powerPoints, allyPoints: allyCost });
    const { attributePoints, secondaryPoints, advantagePoints, disadvantagePoints, skillPoints, totalSpent } = pointBudget;
    const available = sheet.points.initial + sheet.points.earned - totalSpent;
    return { hpMax, fpMax, will, perception, speed, basicLift, carriedWeight, encumbrance, encName: encNames[encumbrance], dodge, move, attributePoints, secondaryPoints, advantagePoints, disadvantagePoints, skillPoints, powerPoints, allyCost, totalSpent, available };
  }, [sheet]);

  const addLog = (text: string, kind: LogItem["kind"] = "note") => {
    setSheet((current) => ({ ...current, log: [{ id: makeId(), time: now(), text, kind }, ...current.log].slice(0, 20) }));
  };

  const navigateTo = (id: string) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const removeTrait = (kind: "advantages" | "disadvantages", id: string, name: string) => {
    setSheet((current) => ({ ...current, [kind]: current[kind].filter((trait) => trait.id !== id) }));
    addLog(`Removeu ${kind === "advantages" ? "a vantagem" : "a desvantagem"} ${name || "sem nome"}.`, "note");
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setSheet((current) => ({ ...current, skills: current.skills.map((skill) => skill.id === id ? { ...skill, [field]: value } : skill) }));
  };

  const removeSkill = (id: string, name: string) => {
    setSheet((current) => ({ ...current, skills: current.skills.filter((skill) => skill.id !== id) }));
    addLog(`Removeu a perícia ${name || "sem nome"}.`, "note");
  };

  const updateItem = (id: string, field: keyof InventoryItem, value: string | number | boolean) => {
    setSheet((current) => ({ ...current, inventory: current.inventory.map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  };

  const updateAttack = (id: string, field: keyof Attack, value: string | number) => {
    setSheet((current) => ({ ...current, attacks: current.attacks.map((attack) => attack.id === id ? { ...attack, [field]: value } : attack) }));
  };

  const removeAttack = (id: string, name: string) => {
    setSheet((current) => ({ ...current, attacks: current.attacks.filter((attack) => attack.id !== id) }));
    addLog(`Removeu o ataque ${name || "sem nome"}.`, "note");
  };

  const removeItem = (id: string, name: string) => {
    setSheet((current) => ({ ...current, inventory: current.inventory.filter((item) => item.id !== id) }));
    addLog(`Removeu o item ${name || "sem nome"}.`, "note");
  };

  const updateArmor = (id: string, field: keyof Armor, value: string | number) => {
    setSheet((current) => ({ ...current, armor: current.armor.map((armor) => armor.id === id ? { ...armor, [field]: value } : armor) }));
  };

  const updatePower = (id: string, field: keyof Power, value: string | number | boolean) => {
    setSheet((current) => ({ ...current, powers: (current.powers || []).map((power) => power.id === id ? { ...power, [field]: value } : power) }));
  };

  const removePower = (id: string, name: string) => {
    setSheet((current) => ({ ...current, powers: (current.powers || []).filter((power) => power.id !== id) }));
    addLog(`Removeu o poder ${name || "sem nome"}.`, "note");
  };

  const addPower = () => {
    const power: Power = { id: makeId(), name: "Novo poder", source: "Sobrenatural", type: "Ofensivo", level: sheet.attributes.iq, fpCost: 1, pointCost: 5, range: "10 m", damage: "—", effect: "Descreva o efeito do poder.", combatReady: true };
    setSheet((current) => ({ ...current, powers: [...(current.powers || []), power] }));
    addLog("Adicionou um novo poder à ficha.", "note");
  };

  const usePower = (power: Power) => {
    if (!power.combatReady) { navigateTo("poderes"); return; }
    if (sheet.secondary.fpCurrent < power.fpCost) { addLog(`Não há FP suficiente para ativar ${power.name}.`, "note"); return; }
    setSheet((current) => ({ ...current, secondary: { ...current.secondary, fpCurrent: current.secondary.fpCurrent - power.fpCost } }));
    addLog(`Ativou ${power.name} e gastou ${power.fpCost} FP.`, "health");
    roll3d6(`Poder: ${power.name}`, power.level);
  };

  const updateMission = (id: string, field: keyof Mission, value: string | number | boolean) => {
    setSheet((current) => ({ ...current, missions: (current.missions || []).map((mission) => mission.id === id ? { ...mission, [field]: value } : mission) }));
  };

  const addMission = () => {
    const mission: Mission = { id: makeId(), title: "Nova missão", difficulty: "Média", status: "Planejada", pointsReward: 0, moneyReward: 0, currency: "mo", notes: "Registre objetivos, obstáculos e resultados da missão.", applied: false };
    setSheet((current) => ({ ...current, missions: [...(current.missions || []), mission] }));
  };

  const applyMissionRewards = (id: string) => {
    const mission = (sheet.missions || []).find((item) => item.id === id);
    if (!mission || mission.applied) return;
    setSheet((current) => ({ ...current, points: { ...current.points, earned: current.points.earned + mission.pointsReward }, missions: (current.missions || []).map((item) => item.id === id ? { ...item, applied: true, status: "Concluída" } : item) }));
    addLog(`Concluiu ${mission.title} e recebeu ${mission.pointsReward} pontos e ${mission.moneyReward} ${mission.currency}.`, "note");
  };

  const removeMission = (id: string, title: string) => {
    setSheet((current) => ({ ...current, missions: (current.missions || []).filter((mission) => mission.id !== id) }));
    addLog(`Removeu o relatório de missão ${title || "sem nome"}.`, "note");
  };

  const updateHomebrew = (id: string, field: keyof HomebrewEntry, value: string) => {
    setSheet((current) => ({ ...current, homebrew: (current.homebrew || []).map((entry) => entry.id === id ? { ...entry, [field]: value } : entry) }));
  };

  const addHomebrew = () => {
    const entry: HomebrewEntry = { id: makeId(), category: "Regra", title: "Novo conteúdo", content: "Descreva a regra, raça, habilidade ou item personalizado.", source: "Campanha" };
    setSheet((current) => ({ ...current, homebrew: [...(current.homebrew || []), entry] }));
  };

  const removeHomebrew = (id: string, title: string) => {
    setSheet((current) => ({ ...current, homebrew: (current.homebrew || []).filter((entry) => entry.id !== id) }));
    addLog(`Removeu o conteúdo Homebrew ${title || "sem nome"}.`, "note");
  };

  const updateAlly = (id: string, field: keyof Ally, value: string | number | boolean) => {
    setSheet((current) => ({ ...current, allies: (current.allies || []).map((ally) => ally.id === id ? { ...normalizeAlly(ally), [field]: value } : ally) }));
  };

  const updateAllyData = (id: string, update: Partial<Ally>) => {
    setSheet((current) => ({ ...current, allies: (current.allies || []).map((ally) => ally.id === id ? { ...normalizeAlly(ally), ...update } : ally) }));
  };

  const updateAllyAttribute = (id: string, field: keyof NonNullable<Ally["attributes"]>, value: number) => {
    setSheet((current) => ({ ...current, allies: (current.allies || []).map((ally) => {
      if (ally.id !== id) return ally;
      const full = normalizeAlly(ally);
      return { ...full, attributes: { ...full.attributes, [field]: value } };
    }) }));
  };

  const updateAllyList = (id: string, list: "advantages" | "disadvantages" | "skills" | "attacks" | "inventory", itemId: string, update: Record<string, string | number | boolean>) => {
    setSheet((current) => ({ ...current, allies: (current.allies || []).map((ally) => {
      if (ally.id !== id) return ally;
      const full = normalizeAlly(ally);
      return { ...full, [list]: full[list].map((item) => item.id === itemId ? { ...item, ...update } : item) };
    }) }));
  };

  const addAllyListItem = (id: string, list: "advantages" | "disadvantages" | "skills" | "attacks" | "inventory") => {
    const item = list === "advantages" ? { id: makeId(), name: "Nova vantagem", cost: 5, notes: "", source: "" } : list === "disadvantages" ? { id: makeId(), name: "Nova desvantagem", cost: -5, notes: "", source: "" } : list === "skills" ? { id: makeId(), name: "Nova perícia", attribute: "DX", difficulty: "Média", relative: "DX+0", level: 10, points: 1 } : list === "attacks" ? { id: makeId(), name: "Novo ataque", level: 10, damage: "—", reach: "—", parry: "—" } : { id: makeId(), name: "Novo item", category: "Utilidade", quantity: 1, weight: 0, carried: true, equipped: false };
    setSheet((current) => ({ ...current, allies: (current.allies || []).map((ally) => {
      if (ally.id !== id) return ally;
      const full = normalizeAlly(ally);
      return { ...full, [list]: [...full[list], item] };
    }) }));
  };

  const removeAllyListItem = (id: string, list: "advantages" | "disadvantages" | "skills" | "attacks" | "inventory", itemId: string, itemName: string) => {
    setSheet((current) => ({ ...current, allies: (current.allies || []).map((ally) => {
      if (ally.id !== id) return ally;
      const full = normalizeAlly(ally);
      return { ...full, [list]: full[list].filter((item) => item.id !== itemId) };
    }) }));
    const label = list === "advantages" ? "a vantagem" : list === "disadvantages" ? "a desvantagem" : list === "skills" ? "a perícia" : list === "attacks" ? "o ataque" : "o item";
    addLog(`Removeu ${label} ${itemName || "sem nome"} do aliado.`, "note");
  };

  const addAlly = () => {
    const ally: Ally = { id: makeId(), name: "Novo aliado", relation: "Aliado", description: "Descreva como este aliado ajuda na campanha.", points: 25, cost: 1, hpCurrent: 10, hpMax: 10, fpCurrent: 10, fpMax: 10, status: "Pronto", type: "Individual", race: "Humano", powerPercent: 25, frequency: 12, attributes: { st: 10, dx: 10, iq: 10, ht: 10 }, advantages: [], disadvantages: [], skills: [], attacks: [], inventory: [], conditions: [] };
    setSheet((current) => ({ ...current, allies: [...(current.allies || []), ally] }));
    setSelectedAllyId(ally.id);
    setActiveAllyTab("visao");
    addLog("Adicionou um novo aliado à ficha.", "note");
  };

  const removeAlly = (id: string, name: string) => {
    setSheet((current) => ({ ...current, allies: (current.allies || []).filter((ally) => ally.id !== id) }));
    if (selectedAllyId === id) setSelectedAllyId(null);
    addLog(`Removeu ${name || "um aliado"} da ficha.`, "note");
  };

  const changeAllyHp = (id: string, delta: number) => {
    setSheet((current) => ({ ...current, allies: (current.allies || []).map((ally) => ally.id === id ? { ...ally, hpCurrent: Math.max(0, Math.min(ally.hpMax, ally.hpCurrent + delta)) } : ally) }));
  };

  const selectArmorLocation = (location: string) => {
    setSelectedArmorLocation(location);
    if (sheet.armor.some((armor) => armor.location === location)) return;
    setSheet((current) => ({ ...current, armor: [...current.armor, { id: makeId(), location, dr: 0, source: "Sem proteção" }] }));
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

  const ensureCloudCharacter = async (character: CharacterRecord) => {
    if (!isAuthenticated) return null;
    if (cloudCharacterIds.includes(character.id)) return character;

    const cloudCharacter = { ...character, id: makeId(), createdAt: Date.now(), updatedAt: Date.now() };
    await saveCharacter.mutateAsync({
      id: cloudCharacter.id,
      name: cloudCharacter.sheet.identity.name || "Sem nome",
      portraitUrl: cloudCharacter.portraitUrl ?? null,
      sheet: cloudCharacter.sheet as unknown as Record<string, unknown>,
    });
    setCharacters((current) => current.map((item) => item.id === character.id ? cloudCharacter : item));
    setCloudCharacterIds((current) => current.includes(cloudCharacter.id) ? current : [...current, cloudCharacter.id]);
    if (activeCharacter.id === character.id) setActiveCharacterId(cloudCharacter.id);
    return cloudCharacter;
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
    blankSheet.powers = [];
    blankSheet.allies = [];
    blankSheet.missions = [];
    blankSheet.homebrew = [];
    blankSheet.conditions = [];
    blankSheet.log = [{ id: makeId(), time: now(), text: "Nova ficha criada no Arquivo de Campanha.", kind: "note" }];
    const character = { id: makeId(), sheet: blankSheet, createdAt: Date.now(), updatedAt: Date.now() };
    setCharacters((current) => [character, ...current]);
    setActiveCharacterId(character.id);
    setActiveSection("visao-geral");
    setLastRoll(null);
    setView("sheet");
    if (isAuthenticated) void ensureCloudCharacter(character).then((cloudCharacter) => {
      if (cloudCharacter) setActiveCharacterId(cloudCharacter.id);
    });
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
    if (isAuthenticated) void ensureCloudCharacter(duplicate).then((cloudCharacter) => {
      if (cloudCharacter) setActiveCharacterId(cloudCharacter.id);
    });
  };

  const deleteCharacter = (id: string) => {
    if (characters.length === 1) return;
    const character = characters.find((item) => item.id === id);
    if (!window.confirm(`Excluir permanentemente a ficha “${character?.sheet.identity.name || "Sem nome"}”?`)) return;
    const remaining = characters.filter((item) => item.id !== id);
    setCharacters(remaining);
    if (isAuthenticated && cloudCharacterIds.includes(id)) removeCharacter.mutate({ id });
    setCloudCharacterIds((current) => current.filter((cloudId) => cloudId !== id));
    if (id === activeCharacter.id) setActiveCharacterId(remaining[0].id);
  };

  const handlePortraitUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeCharacter) return;
    if (!isAuthenticated) { startLogin(); return; }
    if (!file.type.startsWith("image/")) { window.alert("Escolha um arquivo de imagem."); return; }
    if (file.size > 12_000_000) { window.alert("Escolha uma imagem de até 12 MB."); return; }
    void (async () => {
      try {
        const cloudCharacter = await ensureCloudCharacter(activeCharacter);
        if (!cloudCharacter) return;
        const dataUrl = await preparePortraitUpload(file);
        setPortraitPreview(dataUrl);
        await saveCharacter.mutateAsync({ id: cloudCharacter.id, name: cloudCharacter.sheet.identity.name || "Sem nome", portraitUrl: cloudCharacter.portraitUrl ?? null, sheet: cloudCharacter.sheet as unknown as Record<string, unknown> });
        const uploaded = await uploadPortrait.mutateAsync({ characterId: cloudCharacter.id, dataUrl });
        setCharacters((current) => current.map((character) => character.id === cloudCharacter.id ? { ...character, portraitUrl: uploaded.portraitUrl, updatedAt: Date.now() } : character));
        setPortraitPreview(null);
      } catch (error) {
        setPortraitPreview(null);
        const message = error instanceof Error ? error.message : "Não foi possível enviar o retrato.";
        window.alert(`${message} Tente novamente.`);
      }
    })();
    event.target.value = "";
  };

  const shareActiveCharacter = async () => {
    if (!isAuthenticated) { startLogin(); return; }
    try {
      const cloudCharacter = await ensureCloudCharacter(activeCharacter);
      if (!cloudCharacter) return;
      await saveCharacter.mutateAsync({ id: cloudCharacter.id, name: cloudCharacter.sheet.identity.name || "Sem nome", portraitUrl: cloudCharacter.portraitUrl ?? null, sheet: cloudCharacter.sheet as unknown as Record<string, unknown> });
      const share = await createShare.mutateAsync({ characterId: cloudCharacter.id });
      if (!share.token) throw new Error("Link indisponível");
      await sharesQuery.refetch();
      const url = `${window.location.origin}/compartilhar/${share.token}`;
      if (navigator.clipboard) await navigator.clipboard.writeText(url);
      else window.prompt("Copie o link da ficha:", url);
      setShareStatus("copied");
      window.setTimeout(() => setShareStatus("idle"), 2200);
    } catch {
      setShareStatus("error");
      window.setTimeout(() => setShareStatus("idle"), 2200);
    }
  };

  if (view === "library") return <CharacterLibrary characters={characters} onCreate={createCharacter} onOpen={openCharacter} onDuplicate={duplicateCharacter} onDelete={deleteCharacter} isAuthenticated={isAuthenticated} userName={user?.name} onLogin={startLogin} onLogout={logout} sharedIds={sharesQuery.data?.map((share) => share.characterId) || []} />;

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
              <span className="codex-nav__index"><img src={MARK} alt="" />{String(index + 1).padStart(2, "0")}</span><Icon size={17} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer"><span>{isAuthenticated ? "Sincronização ao vivo" : "Salvamento local"}</span><div>{isAuthenticated ? <Cloud size={15} /> : <Save size={15} />}{isAuthenticated ? " Nuvem conectada" : " Atualizado agora"}</div></div>
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
          <section id="visao-geral" className={`codex-section ${activeSection === "visao-geral" ? "is-active" : "is-hidden"}`}>
            <SectionHeader kicker="01 · NÚCLEO" title="Visão geral" description="Ajuste a identidade e os valores que sustentam o personagem." icon={UserRound} />
            <div className="overview-grid">
              <div className="paper-card identity-card">
                <div className="portrait-frame"><img src={portraitPreview || activeCharacter.portraitUrl || PORTRAIT} alt="Retrato do personagem" />{isAuthenticated ? <label className={`portrait-upload ${uploadPortrait.isPending ? "is-loading" : ""}`}><ImageUp size={14} /> {uploadPortrait.isPending ? "Enviando..." : "Trocar retrato"}<input className="portrait-file-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePortraitUpload} disabled={uploadPortrait.isPending} /></label> : <button type="button" className="portrait-upload" onClick={startLogin}><LogIn size={14} /> Entrar para enviar</button>}</div>
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
                  {secondaryModifierFields.map(({ field, label }) => <label key={field}><span>{label} · {SECONDARY_POINT_COSTS[field]} pts/nível</span><input type="number" value={sheet.secondary[field]} onChange={(event) => updateSecondary(field, number(event.target.value))} /></label>)}
                </div>
              </div>
            </div>
          </section>

          <section id="combate" className={`codex-section ${activeSection === "combate" ? "is-active" : "is-hidden"}`}>
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
                    <button type="button" className="sigil-action" aria-label={`Rolar ${attack.name}`} onClick={() => roll3d6(attack.name, attack.level)}><img src={MARK} alt="" /></button><button type="button" className="row-delete" aria-label={`Excluir ${attack.name}`} onClick={() => removeAttack(attack.id, attack.name)}><Trash2 size={14} /></button>
                  </div>)}
                </div>
              </div>
              <div className="protection-map">
                <div className="protection-map__title"><span className="eyebrow">PROTEÇÃO CORPORAL</span><h3>Resistência por local</h3><p>Selecione uma região do corpo para definir sua DR e a fonte de proteção.</p></div>
                <div className="body-protection-workbench"><div className="body-figure"><img src={BODY_MAP} alt="Corpo humano com regiões de proteção" /><span>MAPA DE DEFESA</span></div><div className="zone-register"><span className="eyebrow">REGIÕES DO CORPO</span><div className="body-zone-grid">{bodyZones.map((zone) => { const armor = sheet.armor.find((item) => item.location === zone.location); return <button key={zone.location} type="button" className={selectedArmorLocation === zone.location ? "body-zone is-selected" : "body-zone"} onClick={() => selectArmorLocation(zone.location)}><b>{zone.code}</b><span>{zone.location}</span><i>DR {armor?.dr ?? 0}</i></button>; })}</div></div></div>
                {(() => { const selectedArmor = sheet.armor.find((armor) => armor.location === selectedArmorLocation); return selectedArmor ? <div className="selected-protection"><span><Shield size={14} /> REGIÃO SELECIONADA</span><strong>{selectedArmor.location}</strong><label>DR<input type="number" min="0" value={selectedArmor.dr} onChange={(event) => updateArmor(selectedArmor.id, "dr", number(event.target.value))} /></label><label>Proteção<input value={selectedArmor.source} onChange={(event) => updateArmor(selectedArmor.id, "source", event.target.value)} /></label></div> : null; })()}
              </div>
            </div>
            <div className="combat-powers"><div><span className="eyebrow">PODERES DE COMBATE</span><h3>Habilidades prontas para a cena</h3><p>Ative um poder para gastar FP, registrar o uso e executar uma rolagem 3d6.</p></div>{(sheet.powers || []).filter((power) => power.combatReady).length ? <div className="combat-powers__list">{(sheet.powers || []).filter((power) => power.combatReady).map((power) => <button type="button" key={power.id} onClick={() => usePower(power)} disabled={sheet.secondary.fpCurrent < power.fpCost}><span><b>{power.name}</b><small>{power.type} · NH {power.level} · {power.fpCost} FP</small></span><i>{power.damage || power.effect || "Ativar"}</i><WandSparkles size={17} /></button>)}</div> : <button type="button" className="combat-powers__empty" onClick={() => navigateTo("poderes")}><WandSparkles size={17} /> Cadastre um poder para usá-lo no combate.</button>}</div>
            <div className="conditions-panel"><div><span className="eyebrow">ESTADO DE CENA</span><p>Os efeitos são visíveis enquanto estiverem ativos.</p></div><div>{["Atordoado", "Ferido", "Derrubado", "Agarrado", "Exausto", "Envenenado"].map((condition) => <button key={condition} type="button" className={sheet.conditions.includes(condition) ? "condition is-on" : "condition"} onClick={() => toggleCondition(condition)}>{sheet.conditions.includes(condition) ? <Shield size={14} /> : <Plus size={14} />}{condition}</button>)}</div></div>
          </section>

          <section id="poderes" className={`codex-section ${activeSection === "poderes" ? "is-active" : "is-hidden"}`}>
            <SectionHeader kicker="03 · PODER" title="Poderes" description="Habilidades sobrenaturais, psíquicas ou especiais conectadas aos recursos de combate." icon={WandSparkles} action={<Button type="button" variant="outline" className="add-button" onClick={addPower}><WandSparkles size={15} /> Adicionar poder</Button>} />
            <div className="powers-summary"><div><span className="eyebrow">FOCO DE PODER</span><strong>{(sheet.powers || []).length}</strong><small>habilidade{(sheet.powers || []).length === 1 ? "" : "s"} registrada{(sheet.powers || []).length === 1 ? "" : "s"}</small></div><div><span>Custo em pontos</span><b>{calculated.powerPoints} pts</b></div><div><span>Poderes de combate</span><b>{(sheet.powers || []).filter((power) => power.combatReady).length}</b></div><div><span>FP disponíveis</span><b>{sheet.secondary.fpCurrent}/{calculated.fpMax}</b></div></div>
            <div className="powers-list">{(sheet.powers || []).length ? (sheet.powers || []).map((power, index) => <article className="power-card" key={power.id}><div className="power-card__folio"><img src={MARK} alt="" /><span>PODER</span><b>{String(index + 1).padStart(2, "0")}</b></div><div className="power-card__main"><div className="power-card__head"><div><input value={power.name} aria-label="Nome do poder" onChange={(event) => updatePower(power.id, "name", event.target.value)} /><select value={power.type} aria-label="Tipo do poder" onChange={(event) => updatePower(power.id, "type", event.target.value)}><option>Ofensivo</option><option>Defensivo</option><option>Utilidade</option><option>Controle</option></select></div><label className="power-ready"><input type="checkbox" checked={power.combatReady} onChange={(event) => updatePower(power.id, "combatReady", event.target.checked)} /><span>Disponível no combate</span></label></div><div className="power-fields"><label><span>Fonte</span><input value={power.source} onChange={(event) => updatePower(power.id, "source", event.target.value)} /></label><label><span>NH</span><input type="number" value={power.level} onChange={(event) => updatePower(power.id, "level", number(event.target.value))} /></label><label><span>FP</span><input type="number" min="0" value={power.fpCost} onChange={(event) => updatePower(power.id, "fpCost", Math.max(0, number(event.target.value)))} /></label><label><span>Pontos</span><input type="number" min="0" value={power.pointCost} onChange={(event) => updatePower(power.id, "pointCost", Math.max(0, number(event.target.value)))} /></label><label><span>Alcance</span><input value={power.range} onChange={(event) => updatePower(power.id, "range", event.target.value)} /></label><label><span>Dano</span><input value={power.damage} onChange={(event) => updatePower(power.id, "damage", event.target.value)} /></label><label className="wide"><span>Efeito</span><textarea value={power.effect} onChange={(event) => updatePower(power.id, "effect", event.target.value)} /></label></div></div><div className="power-card__use"><span><WandSparkles size={16} /> AÇÃO DE SESSÃO</span><b>{power.fpCost} FP</b><button type="button" onClick={() => usePower(power)} disabled={!power.combatReady || sheet.secondary.fpCurrent < power.fpCost}><Dices size={15} /> Usar poder</button><button type="button" className="power-delete" aria-label={`Excluir ${power.name}`} onClick={() => removePower(power.id, power.name)}><Trash2 size={14} /> Excluir</button></div></article>) : <button type="button" className="powers-empty" onClick={addPower}><span><WandSparkles size={21} /></span><strong>Nenhum poder cadastrado</strong><small>Crie uma habilidade e deixe-a disponível para usá-la diretamente no combate.</small><b><Plus size={14} /> Adicionar primeiro poder</b></button>}</div>
          </section>

          <section id="caracteristicas" className={`codex-section ${activeSection === "caracteristicas" ? "is-active" : "is-hidden"}`}>
            <SectionHeader kicker="04 · CONSTRUÇÃO" title="Características" description="Vantagens, desvantagens e custos mantêm o orçamento da ficha legível." icon={Sparkles} />
            <div className="traits-grid">
              {(["advantages", "disadvantages"] as const).map((kind) => <div className={`trait-card ${kind === "advantages" ? "trait-card--positive" : "trait-card--negative"}`} key={kind}>
                <div className="trait-card__head"><div><span className="eyebrow">{kind === "advantages" ? "A FAVOR" : "LIMITES"}</span><h3>{kind === "advantages" ? "Vantagens" : "Desvantagens & quirks"}</h3></div><button type="button" onClick={() => addTrait(kind)}><Plus size={16} /></button></div>
                <div className="trait-rows">{sheet[kind].map((trait) => <div key={trait.id} className="trait-row"><input value={trait.name} aria-label="Nome" onChange={(event) => updateTrait(kind, trait.id, "name", event.target.value)} /><textarea value={trait.notes} aria-label="Notas" placeholder="Notas de uso" onChange={(event) => updateTrait(kind, trait.id, "notes", event.target.value)} /><label><span>Pts</span><input type="number" value={trait.cost} onChange={(event) => updateTrait(kind, trait.id, "cost", number(event.target.value))} /></label><input className="trait-row__source" value={trait.source} aria-label="Fonte" placeholder="Fonte" onChange={(event) => updateTrait(kind, trait.id, "source", event.target.value)} /><button type="button" className="row-delete trait-row__delete" aria-label={`Excluir ${trait.name}`} onClick={() => removeTrait(kind, trait.id, trait.name)}><Trash2 size={14} /></button></div>)}</div>
                <div className="trait-card__total"><span>Total</span><strong>{kind === "advantages" ? `+${calculated.advantagePoints}` : calculated.disadvantagePoints} pts</strong></div>
              </div>)}
            </div>
          </section>

          <section id="pericias" className={`codex-section ${activeSection === "pericias" ? "is-active" : "is-hidden"}`}>
            <SectionHeader kicker="05 · COMPETÊNCIA" title="Perícias" description="Nível efetivo, dificuldade e pontos em uma leitura compacta de mesa." icon={Target} action={<Button type="button" variant="outline" className="add-button" onClick={() => setSheet((current) => ({ ...current, skills: [...current.skills, { id: makeId(), name: "Nova perícia", attribute: "DX", difficulty: "Média", relative: "DX+0", level: sheet.attributes.dx, points: 1 }] }))}><Plus size={15} /> Perícia</Button>} />
            <div className="paper-card table-card"><div className="skill-table skill-table--head"><span>Perícia</span><span>Atributo</span><span>Dificuldade</span><span>Relativo</span><span>NH</span><span>Pontos</span><span /><span /></div>{sheet.skills.map((skill) => <div className="skill-table" key={skill.id}><input value={skill.name} onChange={(event) => updateSkill(skill.id, "name", event.target.value)} /><input value={skill.attribute} onChange={(event) => updateSkill(skill.id, "attribute", event.target.value)} /><input value={skill.difficulty} onChange={(event) => updateSkill(skill.id, "difficulty", event.target.value)} /><input value={skill.relative} onChange={(event) => updateSkill(skill.id, "relative", event.target.value)} /><input type="number" value={skill.level} onChange={(event) => updateSkill(skill.id, "level", number(event.target.value))} /><input type="number" value={skill.points} onChange={(event) => updateSkill(skill.id, "points", number(event.target.value))} /><button type="button" className="sigil-action" aria-label={`Rolar ${skill.name}`} onClick={() => roll3d6(skill.name, skill.level)}><img src={MARK} alt="" /></button><button type="button" className="row-delete" aria-label={`Excluir ${skill.name}`} onClick={() => removeSkill(skill.id, skill.name)}><Trash2 size={14} /></button></div>)}<div className="skill-table__footer"><span>Investimento em perícias</span><strong>{calculated.skillPoints} pts</strong><small>Escolha um nível e role 3d6 diretamente da ficha.</small></div></div>
          </section>

          <section id="inventario" className={`codex-section ${activeSection === "inventario" ? "is-active" : "is-hidden"}`}>
            <SectionHeader kicker="06 · CARGA" title="Equipamento" description="Controle o que está carregando e acompanhe o efeito sobre movimento e defesa." icon={Backpack} action={<Button type="button" variant="outline" className="add-button" onClick={() => setSheet((current) => ({ ...current, inventory: [...current.inventory, { id: makeId(), name: "Novo item", category: "Utilidade", quantity: 1, weight: 0, carried: true, equipped: false }] }))}><PackagePlus size={15} /> Item</Button>} />
            <div className="inventory-layout"><div className="paper-card inventory-table"><div className="item-grid item-grid--head"><span>Item</span><span>Categoria</span><span>Qtd.</span><span>Peso un.</span><span>Carregar</span><span>Equipar</span><span /></div>{sheet.inventory.map((item) => <div className="item-grid" key={item.id}><input value={item.name} onChange={(event) => updateItem(item.id, "name", event.target.value)} /><input value={item.category} onChange={(event) => updateItem(item.id, "category", event.target.value)} /><input type="number" min="0" value={item.quantity} onChange={(event) => updateItem(item.id, "quantity", number(event.target.value))} /><label className="weight-input"><input type="number" min="0" step="0.1" value={item.weight} onChange={(event) => updateItem(item.id, "weight", number(event.target.value))} /><span>lb</span></label><label className="switch-label"><input type="checkbox" checked={item.carried} onChange={(event) => updateItem(item.id, "carried", event.target.checked)} /><i /></label><label className="switch-label"><input type="checkbox" checked={item.equipped} onChange={(event) => updateItem(item.id, "equipped", event.target.checked)} /><i /></label><button type="button" className="row-delete" aria-label={`Excluir ${item.name}`} onClick={() => removeItem(item.id, item.name)}><Trash2 size={14} /></button></div>)}</div>
              <div className={`load-card load-card--${calculated.encumbrance >= 3 ? "danger" : calculated.encumbrance >= 1 ? "watch" : "safe"}`}><Weight size={23} /><span className="eyebrow">CARGA ATUAL</span><strong>{format(calculated.carriedWeight, 1)} <small>lb</small></strong><p>Basic Lift: <b>{format(calculated.basicLift, 1)} lb</b></p><div className="load-scale">{[0, 1, 2, 3, 4].map((level) => <i key={level} className={calculated.encumbrance >= level ? "is-filled" : ""} />)}</div><div className="load-card__status"><span>{calculated.encName}</span><b>Move {calculated.move} · Dodge {calculated.dodge}</b></div><small>{calculated.encumbrance >= 5 ? "A carga excede o limite de referência." : "Movimento e Dodge já incluem a carga."}</small></div>
            </div>
          </section>

          <section id="aliados" className={`codex-section ${activeSection === "aliados" ? "is-active" : "is-hidden"}`}>
            <SectionHeader kicker="07 · VÍNCULOS" title="Aliados" description="Acompanhe companheiros, familiares e seguidores que participam da campanha." icon={UsersRound} action={<Button type="button" variant="outline" className="add-button" onClick={addAlly}><UsersRound size={15} /> Adicionar aliado</Button>} />
            <div className="ally-studio">
              <aside className="ally-studio__roster"><div className="ally-roster__head"><span className="eyebrow">REDE DE APOIO</span><strong>{(sheet.allies || []).length}</strong><small>aliado{(sheet.allies || []).length === 1 ? "" : "s"} em campo</small></div><div className="ally-roster__list">{(sheet.allies || []).map((ally) => { const full = normalizeAlly(ally); return <button key={ally.id} type="button" className={activeAlly?.id === ally.id ? "is-active" : ""} onClick={() => { setSelectedAllyId(ally.id); setActiveAllyTab("visao"); }}><img src={MARK} alt="" /><span><b>{full.name}</b><small>{full.relation} · {full.status}</small></span><i>PV {full.hpCurrent}/{full.hpMax}</i></button>; })}</div><div className="ally-roster__summary"><span>Custo calculado</span><b>{calculated.allyCost} pts</b><small>Valor total: {(sheet.allies || []).reduce((sum, ally) => sum + ally.points, 0)} pts</small></div></aside>
              {activeAlly ? <div className="ally-studio__detail"><header className="ally-sheet__header"><div><span className="eyebrow">MINI-FICHA DE ALIADO</span><h3>{activeAlly.name}</h3><p>{activeAlly.relation} · {activeAlly.type} · {activeAlly.race}</p></div><div className="ally-sheet__status"><span>Estado</span><AllyStatusSelect value={activeAlly.status} onValueChange={(status) => updateAlly(activeAlly.id, "status", status)} /><button type="button" aria-label={`Remover ${activeAlly.name}`} onClick={() => removeAlly(activeAlly.id, activeAlly.name)}><Trash2 size={15} /></button></div></header><div className="ally-sheet__body"><nav className="ally-tabs" aria-label="Abas da ficha do aliado">{allyTabs.map(({ id, label, icon: Icon }, index) => <button key={id} type="button" className={activeAllyTab === id ? "is-active" : ""} onClick={() => setActiveAllyTab(id)}><span>0{index + 1}</span><Icon size={15} />{label}</button>)}</nav><div className="ally-tab-panel">
                {activeAllyTab === "visao" && <div className="ally-tab-grid ally-tab-grid--overview"><section className="ally-panel"><span className="eyebrow">IDENTIFICAÇÃO</span><div className="ally-field-grid"><label className="wide"><span>Nome</span><input value={activeAlly.name} onChange={(event) => updateAlly(activeAlly.id, "name", event.target.value)} /></label><label><span>Relação</span><input value={activeAlly.relation} onChange={(event) => updateAlly(activeAlly.id, "relation", event.target.value)} /></label><label><span>Tipo</span><input value={activeAlly.type} onChange={(event) => updateAlly(activeAlly.id, "type", event.target.value)} /></label><label><span>Raça / espécie</span><input value={activeAlly.race} onChange={(event) => updateAlly(activeAlly.id, "race", event.target.value)} /></label><label><span>Aparência</span><input value={activeAlly.appearance} onChange={(event) => updateAlly(activeAlly.id, "appearance", event.target.value)} /></label><label className="wide"><span>Descrição</span><textarea value={activeAlly.description} onChange={(event) => updateAlly(activeAlly.id, "description", event.target.value)} /></label><label><span>Personalidade</span><textarea value={activeAlly.personality} onChange={(event) => updateAlly(activeAlly.id, "personality", event.target.value)} /></label><label><span>Motivação</span><textarea value={activeAlly.motivation} onChange={(event) => updateAlly(activeAlly.id, "motivation", event.target.value)} /></label><label className="wide"><span>Histórico</span><textarea value={activeAlly.history} onChange={(event) => updateAlly(activeAlly.id, "history", event.target.value)} /></label></div></section><section className="ally-panel ally-rules"><span className="eyebrow">VANTAGEM ALLY</span><div className="ally-rules__cost"><span>Custo atual</span><strong>{calculateAllyCost(activeAlly)} <small>pts</small></strong><small>{activeAlly.powerPercent}% do personagem · aparece em {activeAlly.frequency} ou menos</small></div><label><span>Poder do Ally</span><select value={activeAlly.powerPercent} onChange={(event) => updateAllyData(activeAlly.id, { powerPercent: number(event.target.value) as 25 | 50 | 75 | 100 | 150 })}>{[25, 50, 75, 100, 150].map((power) => <option key={power} value={power}>{power}% · {allyPowerCosts[power as 25 | 50 | 75 | 100 | 150]} pts-base</option>)}</select></label><label><span>Frequência de aparecimento</span><select value={activeAlly.frequency} onChange={(event) => updateAllyData(activeAlly.id, { frequency: number(event.target.value) as 6 | 9 | 12 | 15 })}>{[6, 9, 12, 15].map((frequency) => <option key={frequency} value={frequency}>{frequency} ou menos · ×{allyFrequencyMultipliers[frequency as 6 | 9 | 12 | 15]}</option>)}</select></label><label className="ally-checkbox"><input type="checkbox" checked={activeAlly.isDependent} onChange={(event) => updateAlly(activeAlly.id, "isDependent", event.target.checked)} /><span>Também é um Dependent</span></label><label><span>Pontos atuais</span><input type="number" min="0" value={activeAlly.points} onChange={(event) => updateAlly(activeAlly.id, "points", number(event.target.value))} /></label><label><span>Observações</span><textarea value={activeAlly.notes} onChange={(event) => updateAlly(activeAlly.id, "notes", event.target.value)} /></label></section></div>}
                {activeAllyTab === "atributos" && <div className="ally-tab-grid ally-tab-grid--attributes"><section className="ally-panel"><span className="eyebrow">ATRIBUTOS PRIMÁRIOS</span><div className="ally-attribute-grid">{(["st", "dx", "iq", "ht"] as const).map((attribute) => <label key={attribute}><span>{attribute.toUpperCase()}</span><input type="number" min="1" value={activeAlly.attributes[attribute]} onChange={(event) => updateAllyAttribute(activeAlly.id, attribute, number(event.target.value))} /></label>)}</div></section><section className="ally-panel"><span className="eyebrow">RECURSOS E DERIVADOS</span><div className="ally-field-grid"><label><span>PV atual</span><input type="number" min="0" value={activeAlly.hpCurrent} onChange={(event) => updateAlly(activeAlly.id, "hpCurrent", Math.max(0, Math.min(activeAlly.hpMax, number(event.target.value))))} /></label><label><span>PV máximo</span><input type="number" min="1" value={activeAlly.hpMax} onChange={(event) => updateAlly(activeAlly.id, "hpMax", Math.max(1, number(event.target.value)))} /></label><label><span>PF atual</span><input type="number" min="0" value={activeAlly.fpCurrent} onChange={(event) => updateAlly(activeAlly.id, "fpCurrent", Math.max(0, Math.min(activeAlly.fpMax, number(event.target.value))))} /></label><label><span>PF máximo</span><input type="number" min="1" value={activeAlly.fpMax} onChange={(event) => updateAlly(activeAlly.id, "fpMax", Math.max(1, number(event.target.value)))} /></label></div><div className="ally-derived"><span>Will <b>{activeAlly.attributes.iq}</b></span><span>Per <b>{activeAlly.attributes.iq}</b></span><span>Vel. <b>{((activeAlly.attributes.dx + activeAlly.attributes.ht) / 4).toFixed(2)}</b></span><span>Move <b>{Math.floor((activeAlly.attributes.dx + activeAlly.attributes.ht) / 4)}</b></span><span>Dodge <b>{Math.floor((activeAlly.attributes.dx + activeAlly.attributes.ht) / 4) + 3}</b></span></div></section></div>}
                {activeAllyTab === "caracteristicas" && <div className="ally-tab-grid"><section className="ally-panel"><div className="ally-panel__head"><span className="eyebrow">VANTAGENS</span><button type="button" onClick={() => addAllyListItem(activeAlly.id, "advantages")}><Plus size={14} /> Adicionar</button></div><div className="ally-mini-list">{activeAlly.advantages.map((trait) => <div key={trait.id}><input value={trait.name} onChange={(event) => updateAllyList(activeAlly.id, "advantages", trait.id, { name: event.target.value })} /><input type="number" value={trait.cost} onChange={(event) => updateAllyList(activeAlly.id, "advantages", trait.id, { cost: number(event.target.value) })} /><button type="button" className="ally-list-delete" aria-label={`Excluir vantagem ${trait.name}`} onClick={() => removeAllyListItem(activeAlly.id, "advantages", trait.id, trait.name)}><Trash2 size={13} /></button><textarea value={trait.notes} onChange={(event) => updateAllyList(activeAlly.id, "advantages", trait.id, { notes: event.target.value })} /></div>)}</div></section><section className="ally-panel"><div className="ally-panel__head"><span className="eyebrow">DESVANTAGENS</span><button type="button" onClick={() => addAllyListItem(activeAlly.id, "disadvantages")}><Plus size={14} /> Adicionar</button></div><div className="ally-mini-list">{activeAlly.disadvantages.map((trait) => <div key={trait.id}><input value={trait.name} onChange={(event) => updateAllyList(activeAlly.id, "disadvantages", trait.id, { name: event.target.value })} /><input type="number" value={trait.cost} onChange={(event) => updateAllyList(activeAlly.id, "disadvantages", trait.id, { cost: number(event.target.value) })} /><button type="button" className="ally-list-delete" aria-label={`Excluir desvantagem ${trait.name}`} onClick={() => removeAllyListItem(activeAlly.id, "disadvantages", trait.id, trait.name)}><Trash2 size={13} /></button><textarea value={trait.notes} onChange={(event) => updateAllyList(activeAlly.id, "disadvantages", trait.id, { notes: event.target.value })} /></div>)}</div></section></div>}
                {activeAllyTab === "pericias" && <section className="ally-panel"><div className="ally-panel__head"><span className="eyebrow">PERÍCIAS</span><button type="button" onClick={() => addAllyListItem(activeAlly.id, "skills")}><Plus size={14} /> Perícia</button></div><div className="ally-skill-table"><div><span>Perícia</span><span>Atrib.</span><span>Dif.</span><span>NH</span><span>Pts</span><span className="visually-hidden">Excluir</span></div>{activeAlly.skills.map((skill) => <div key={skill.id}><input value={skill.name} onChange={(event) => updateAllyList(activeAlly.id, "skills", skill.id, { name: event.target.value })} /><input value={skill.attribute} onChange={(event) => updateAllyList(activeAlly.id, "skills", skill.id, { attribute: event.target.value })} /><input value={skill.difficulty} onChange={(event) => updateAllyList(activeAlly.id, "skills", skill.id, { difficulty: event.target.value })} /><input type="number" value={skill.level} onChange={(event) => updateAllyList(activeAlly.id, "skills", skill.id, { level: number(event.target.value) })} /><input type="number" value={skill.points} onChange={(event) => updateAllyList(activeAlly.id, "skills", skill.id, { points: number(event.target.value) })} /><button type="button" className="ally-list-delete" aria-label={`Excluir perícia ${skill.name}`} onClick={() => removeAllyListItem(activeAlly.id, "skills", skill.id, skill.name)}><Trash2 size={13} /></button></div>)}</div></section>}
                {activeAllyTab === "combate" && <div className="ally-tab-grid"><section className="ally-panel"><div className="ally-panel__head"><span className="eyebrow">ATAQUES</span><button type="button" onClick={() => addAllyListItem(activeAlly.id, "attacks")}><Plus size={14} /> Ataque</button></div><div className="ally-attack-list">{activeAlly.attacks.map((attack) => <div key={attack.id}><input value={attack.name} onChange={(event) => updateAllyList(activeAlly.id, "attacks", attack.id, { name: event.target.value })} /><input type="number" value={attack.level} onChange={(event) => updateAllyList(activeAlly.id, "attacks", attack.id, { level: number(event.target.value) })} /><input value={attack.damage} onChange={(event) => updateAllyList(activeAlly.id, "attacks", attack.id, { damage: event.target.value })} /><input value={attack.reach} onChange={(event) => updateAllyList(activeAlly.id, "attacks", attack.id, { reach: event.target.value })} /><button type="button" className="ally-list-delete" aria-label={`Excluir ataque ${attack.name}`} onClick={() => removeAllyListItem(activeAlly.id, "attacks", attack.id, attack.name)}><Trash2 size={13} /></button></div>)}</div></section><section className="ally-panel"><span className="eyebrow">CONDIÇÕES DE CENA</span><div className="ally-condition-grid">{["Atordoado", "Ferido", "Derrubado", "Agarrado", "Exausto", "Envenenado"].map((condition) => <button key={condition} type="button" className={activeAlly.conditions.includes(condition) ? "is-on" : ""} onClick={() => updateAllyData(activeAlly.id, { conditions: activeAlly.conditions.includes(condition) ? activeAlly.conditions.filter((item) => item !== condition) : [...activeAlly.conditions, condition] })}>{condition}</button>)}</div><div className="ally-session-vitals"><span>PV <b>{activeAlly.hpCurrent}/{activeAlly.hpMax}</b></span><button type="button" onClick={() => changeAllyHp(activeAlly.id, -1)}><Minus size={14} /> Dano</button><button type="button" onClick={() => changeAllyHp(activeAlly.id, 1)}><Plus size={14} /> Curar</button></div></section></div>}
                {activeAllyTab === "inventario" && <section className="ally-panel"><div className="ally-panel__head"><span className="eyebrow">INVENTÁRIO</span><button type="button" onClick={() => addAllyListItem(activeAlly.id, "inventory")}><Plus size={14} /> Item</button></div><div className="ally-inventory-table"><div><span>Item</span><span>Categoria</span><span>Qtd.</span><span>Peso</span><span>Uso</span></div>{activeAlly.inventory.map((item) => <div key={item.id}><input value={item.name} onChange={(event) => updateAllyList(activeAlly.id, "inventory", item.id, { name: event.target.value })} /><input value={item.category} onChange={(event) => updateAllyList(activeAlly.id, "inventory", item.id, { category: event.target.value })} /><input type="number" value={item.quantity} onChange={(event) => updateAllyList(activeAlly.id, "inventory", item.id, { quantity: number(event.target.value) })} /><input type="number" value={item.weight} onChange={(event) => updateAllyList(activeAlly.id, "inventory", item.id, { weight: number(event.target.value) })} /><label><input type="checkbox" checked={item.equipped} onChange={(event) => updateAllyList(activeAlly.id, "inventory", item.id, { equipped: event.target.checked })} /> Equipado</label></div>)}</div></section>}
              </div></div></div> : <button type="button" className="allies-empty" onClick={addAlly}><span><UsersRound size={20} /></span><strong>Nenhum aliado cadastrado</strong><small>Adicione um companheiro, familiar ou seguidor para abrir sua mini-ficha por abas.</small><b><Plus size={14} /> Adicionar primeiro aliado</b></button>}
            </div>
          </section>

          <section id="missoes" className={`codex-section ${activeSection === "missoes" ? "is-active" : "is-hidden"}`}>
            <SectionHeader kicker="08 · MISSÕES" title="Relatórios de missão" description="Registre dificuldade, recompensas e desfecho para refletir o progresso real da campanha." icon={ScrollText} action={<Button type="button" variant="outline" className="add-button" onClick={addMission}><Plus size={15} /> Nova missão</Button>} />
            <div className="missions-summary"><div><span className="eyebrow">ARQUIVO DE MISSÕES</span><strong>{(sheet.missions || []).length}</strong><small>registro{(sheet.missions || []).length === 1 ? "" : "s"} na campanha</small></div><div><span>Concluídas</span><b>{(sheet.missions || []).filter((mission) => mission.status === "Concluída").length}</b></div><div><span>Pontos aplicados</span><b>{(sheet.missions || []).filter((mission) => mission.applied).reduce((sum, mission) => sum + mission.pointsReward, 0)}</b></div></div>
            <div className="missions-list">{(sheet.missions || []).length ? (sheet.missions || []).map((mission, index) => <article className="mission-card" key={mission.id}><div className="mission-card__folio"><img src={MARK} alt="" /><span>MISSÃO</span><b>{String(index + 1).padStart(2, "0")}</b></div><div className="mission-card__main"><div className="mission-card__head"><input value={mission.title} aria-label="Título da missão" onChange={(event) => updateMission(mission.id, "title", event.target.value)} /><button type="button" className="row-delete" aria-label={`Excluir ${mission.title}`} onClick={() => removeMission(mission.id, mission.title)}><Trash2 size={14} /></button></div><div className="mission-fields"><label><span>Dificuldade</span><select value={mission.difficulty} onChange={(event) => updateMission(mission.id, "difficulty", event.target.value)}><option>Baixa</option><option>Média</option><option>Alta</option><option>Épica</option><option>Lendária</option></select></label><label><span>Estado</span><select value={mission.status} onChange={(event) => updateMission(mission.id, "status", event.target.value)}><option>Planejada</option><option>Em andamento</option><option>Concluída</option><option>Fracassada</option></select></label><label><span>Pontos ganhos</span><input type="number" min="0" value={mission.pointsReward} onChange={(event) => updateMission(mission.id, "pointsReward", Math.max(0, number(event.target.value)))} /></label><label><span>Dinheiro ganho</span><input type="number" min="0" value={mission.moneyReward} onChange={(event) => updateMission(mission.id, "moneyReward", Math.max(0, number(event.target.value)))} /></label><label><span>Moeda</span><input value={mission.currency} onChange={(event) => updateMission(mission.id, "currency", event.target.value)} /></label><label className="wide"><span>Relatório</span><textarea value={mission.notes} onChange={(event) => updateMission(mission.id, "notes", event.target.value)} /></label></div></div><div className="mission-rewards"><span>{mission.applied ? "RECOMPENSAS APLICADAS" : "RECOMPENSAS"}</span><strong>{mission.pointsReward} <small>pts</small></strong><b>{mission.moneyReward} {mission.currency}</b><button type="button" onClick={() => applyMissionRewards(mission.id)} disabled={mission.applied}>{mission.applied ? "Aplicado" : "Concluir e aplicar"}</button></div></article>) : <button type="button" className="missions-empty" onClick={addMission}><span><ScrollText size={21} /></span><strong>Nenhuma missão registrada</strong><small>Crie um relatório para registrar a dificuldade, as recompensas e o resultado de uma aventura.</small><b><Plus size={14} /> Registrar primeira missão</b></button>}</div>
          </section>

          <section id="homebrew" className={`codex-section ${activeSection === "homebrew" ? "is-active" : "is-hidden"}`}>
            <SectionHeader kicker="09 · HOMEbrew" title="Arquivo Homebrew" description="Mantenha regras, raças, habilidades e equipamentos personalizados junto da campanha." icon={Sparkles} action={<Button type="button" variant="outline" className="add-button" onClick={addHomebrew}><Plus size={15} /> Novo conteúdo</Button>} />
            <div className="homebrew-board"><aside><span className="eyebrow">CÓDICE DA MESA</span><h3>Conteúdo personalizado</h3><p>Use este arquivo para guardar tudo o que sua campanha altera, cria ou interpreta de forma própria.</p><div><span>Entradas</span><b>{(sheet.homebrew || []).length}</b></div><div><span>Regras</span><b>{(sheet.homebrew || []).filter((entry) => entry.category === "Regra").length}</b></div></aside><div className="homebrew-list">{(sheet.homebrew || []).length ? (sheet.homebrew || []).map((entry, index) => <article key={entry.id} className="homebrew-card"><div className="homebrew-card__index">{String(index + 1).padStart(2, "0")}</div><div><div className="homebrew-card__head"><input value={entry.title} aria-label="Título do conteúdo Homebrew" onChange={(event) => updateHomebrew(entry.id, "title", event.target.value)} /><select value={entry.category} onChange={(event) => updateHomebrew(entry.id, "category", event.target.value)}><option>Regra</option><option>Raça</option><option>Habilidade</option><option>Equipamento</option><option>Nota</option></select><button type="button" className="row-delete" aria-label={`Excluir ${entry.title}`} onClick={() => removeHomebrew(entry.id, entry.title)}><Trash2 size={14} /></button></div><label><span>Fonte</span><input value={entry.source} onChange={(event) => updateHomebrew(entry.id, "source", event.target.value)} /></label><label><span>Descrição</span><textarea value={entry.content} onChange={(event) => updateHomebrew(entry.id, "content", event.target.value)} /></label></div></article>) : <button type="button" className="homebrew-empty" onClick={addHomebrew}><span><Sparkles size={21} /></span><strong>Seu arquivo Homebrew está vazio</strong><small>Adicione uma regra da mesa, raça, habilidade ou item personalizado.</small><b><Plus size={14} /> Criar primeira entrada</b></button>}</div></div>
          </section>

          <section id="diario" className={`codex-section codex-section--last ${activeSection === "diario" ? "is-active" : "is-hidden"}`}>
            <SectionHeader kicker="10 · SESSÃO" title="Diário e dados" description="Todo evento que muda a cena pode ficar registrado aqui." icon={History} />
            <div className="diary-grid"><div className="roll-station"><div className="roll-station__top"><img className="roll-station__sigil" src={MARK} alt="" /><div><span className="eyebrow eyebrow--light">ROLAGEM PADRÃO</span><h3>3d6 de mesa</h3></div></div><p>Selecione qualquer ataque ou perícia e use o selo de dados. Para um teste livre, role o atributo desejado.</p><div className="quick-rolls"><button type="button" onClick={() => roll3d6("Teste de ST", sheet.attributes.st)}>ST {sheet.attributes.st}</button><button type="button" onClick={() => roll3d6("Teste de DX", sheet.attributes.dx)}>DX {sheet.attributes.dx}</button><button type="button" onClick={() => roll3d6("Teste de IQ", sheet.attributes.iq)}>IQ {sheet.attributes.iq}</button><button type="button" onClick={() => roll3d6("Teste de HT", sheet.attributes.ht)}>HT {sheet.attributes.ht}</button></div>{lastRoll ? <div className="roll-result"><div className="dice-set">{lastRoll.dice.map((die, index) => <span key={`${die}-${index}`} data-value={die}>{die}</span>)}</div><div><span>{lastRoll.label}</span><strong>{lastRoll.total}</strong><small>{lastRoll.total <= lastRoll.target ? `Sucesso por ${lastRoll.target - lastRoll.total}` : `Falha por ${lastRoll.total - lastRoll.target}`}</small></div></div> : <div className="roll-result roll-result--idle"><Dices size={21} /><span>A próxima rolagem aparecerá aqui.</span></div>}</div>
              <div className="paper-card log-card"><div className="log-card__head"><div><span className="eyebrow">HISTÓRICO</span><h3>Registro da sessão</h3></div><button type="button" onClick={() => addLog("Nota manual adicionada à sessão.", "note")}><Plus size={15} /> Nota</button></div><div className="log-list">{sheet.log.map((entry) => <div className={`log-entry log-entry--${entry.kind}`} key={entry.id}><time>{entry.time}</time><i>{entry.kind === "roll" ? <Dices size={15} /> : entry.kind === "health" ? <HeartPulse size={15} /> : <ScrollText size={15} />}</i><p>{entry.text}</p></div>)}</div></div>
            </div>
            <div className="points-ledger"><div><span className="eyebrow">ORÇAMENTO</span><h3>Pontos de personagem</h3><p>A conta abaixo muda ao editar atributos, valores adicionais, traços, perícias, poderes e aliados.</p></div><div className="ledger-values"><label><span>Iniciais</span><input type="number" value={sheet.points.initial} onChange={(event) => setSheet((current) => ({ ...current, points: { ...current.points, initial: number(event.target.value) } }))} /></label><label><span>Ganhos</span><input type="number" value={sheet.points.earned} onChange={(event) => setSheet((current) => ({ ...current, points: { ...current.points, earned: number(event.target.value) } }))} /></label><div><span>Gastos</span><strong>{calculated.totalSpent}</strong></div><div className={calculated.available < 0 ? "ledger-total is-negative" : "ledger-total"}><span>Disponíveis</span><strong>{calculated.available}</strong></div></div><div className="ledger-breakdown"><span>Atributos <b>{calculated.attributePoints}</b></span><span>Valores adicionais <b>{calculated.secondaryPoints}</b></span><span>Vantagens <b>{calculated.advantagePoints}</b></span><span>Desvantagens <b>{calculated.disadvantagePoints}</b></span><span>Perícias <b>{calculated.skillPoints}</b></span><span>Poderes <b>{calculated.powerPoints}</b></span><span>Aliados <b>{calculated.allyCost}</b></span></div></div>
            {calculated.available < 0 && <div className="validation-warning"><CircleAlert size={18} /><span>Você ultrapassou o orçamento por {Math.abs(calculated.available)} pontos. Revise atributos, traços ou a recompensa da campanha.</span></div>}
            <div className="bottom-actions"><span><ArrowDownRight size={16} /> {isAuthenticated ? "Alterações salvas e atualizadas no link compartilhado." : "Entre para salvar na nuvem e compartilhar em tempo real."}</span><div className="export-actions"><button type="button" className="share-action" onClick={shareActiveCharacter} disabled={authLoading || createShare.isPending}>{isAuthenticated ? <Share2 size={16} /> : <LogIn size={16} />}{shareStatus === "copied" ? "Link copiado" : shareStatus === "error" ? "Tente novamente" : isAuthenticated ? "Compartilhar ao vivo" : "Entrar e compartilhar"}</button><button type="button" onClick={exportJson}><FileJson size={16} /> Baixar JSON</button><button type="button" className="pdf-action" onClick={exportPdf}><Printer size={16} /> Salvar em PDF</button><button type="button" className="restore-action" onClick={resetSheet}><ArrowUpRight size={16} /> Restaurar exemplo</button></div></div>
          </section>
        </div>
      </main>

      <div className="vitals-ribbon" aria-label="Resumo persistente de recursos"><div><HeartPulse size={15} /><span>HP</span><b>{sheet.secondary.hpCurrent}/{calculated.hpMax}</b></div><div><Activity size={15} /><span>FP</span><b>{sheet.secondary.fpCurrent}/{calculated.fpMax}</b></div><div><Shield size={15} /><span>Dodge</span><b>{calculated.dodge}</b></div><div><Crosshair size={15} /><span>Move</span><b>{calculated.move}</b></div><div><WandSparkles size={15} /><span>Pts</span><b>{calculated.available}</b></div></div>
    </div>
  );
}
