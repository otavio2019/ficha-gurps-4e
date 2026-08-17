import { trpc } from "@/lib/trpc";
import { liveSocket } from "@/lib/live";
import { hasSkillDescription } from "@shared/skillDescriptions";
import { Activity, Backpack, BookOpen, Cloud, Eye, HeartPulse, Loader2, Shield, Swords, Target, UsersRound, WandSparkles } from "lucide-react";
import { useEffect } from "react";
import { useRoute } from "wouter";

type SharedSheet = {
  identity: { name: string; player: string; campaign: string; world: string; concept: string; race: string; tl: string };
  attributes: { st: number; dx: number; iq: number; ht: number };
  secondary: { hpCurrent: number; hpBonus: number; fpCurrent: number; fpBonus: number; willBonus?: number; perBonus?: number; speedBonus?: number; dodgeBonus: number; moveBase: number; moveBonus: number };
  skills?: Array<{ id: string; name: string; attribute: string; difficulty: string; relative?: string; level: number; points: number; description?: string }>;
  attacks?: Array<{ id: string; name: string; level: number; damage: string; reach: string; parry: string }>;
  advantages?: Array<{ id: string; name: string; cost: number; notes?: string; source?: string }>;
  disadvantages?: Array<{ id: string; name: string; cost: number; notes?: string; source?: string }>;
  inventory?: Array<{ id: string; name: string; category: string; quantity: number; weight: number; carried: boolean; equipped: boolean }>;
  armor?: Array<{ id: string; location: string; dr: number; source: string }>;
  powers?: Array<{ id: string; name: string; source: string; type: string; level: number; fpCost: number; pointCost: number; range: string; damage: string; effect: string; combatReady: boolean }>;
  allies?: Array<{ id: string; name: string; relation: string; description: string; points: number; cost?: number; hpCurrent: number; hpMax: number; status: string; type?: string; race?: string; appearance?: string; personality?: string; history?: string; motivation?: string; notes?: string; powerPercent?: number; frequency?: number; isDependent?: boolean; attributes?: { st: number; dx: number; iq: number; ht: number }; fpCurrent?: number; fpMax?: number; advantages?: Array<{ id: string; name: string; cost: number; notes?: string; source?: string }>; disadvantages?: Array<{ id: string; name: string; cost: number; notes?: string; source?: string }>; skills?: Array<{ id: string; name: string; attribute: string; difficulty: string; relative?: string; level: number; points: number; description?: string }>; attacks?: Array<{ id: string; name: string; level: number; damage: string; reach: string; parry: string }>; inventory?: Array<{ id: string; name: string; category: string; quantity: number; weight: number; carried: boolean; equipped: boolean }>; conditions?: string[] }>;
  missions?: Array<{ id: string; title: string; difficulty: string; status: string; pointsReward: number; moneyReward: number; currency: string; notes: string }>;
  homebrew?: Array<{ id: string; category: string; title: string; content: string; source: string }>;
  conditions?: string[];
  log?: Array<{ id: string; time: string; text: string; kind: string }>;
};

function Empty({ children }: { children: string }) {
  return <p className="shared-empty">{children}</p>;
}

export default function SharedCharacter() {
  const [, params] = useRoute("/compartilhar/:token");
  const token = params?.token || "";
  const sharedQuery = trpc.shared.get.useQuery({ token }, { enabled: Boolean(token) });

  useEffect(() => {
    if (!token) return;
    liveSocket.connect();
    liveSocket.emit("watch-share", token);
    const receiveUpdate = (event: { shareToken?: string }) => {
      if (event.shareToken === token) sharedQuery.refetch();
    };
    liveSocket.on("character-updated", receiveUpdate);
    return () => {
      liveSocket.off("character-updated", receiveUpdate);
      liveSocket.disconnect();
    };
  }, [sharedQuery, token]);

  if (sharedQuery.isLoading) return <main className="shared-state"><Loader2 className="spin" size={28} /><p>Abrindo ficha compartilhada...</p></main>;
  if (sharedQuery.isError || !sharedQuery.data) return <main className="shared-state"><Shield size={34} /><h1>Ficha indisponível</h1><p>Este link pode ter sido removido ou não está mais ativo.</p></main>;

  const character = sharedQuery.data;
  const sheet = character.sheet as unknown as SharedSheet;
  const skills = sheet.skills || [];
  const attacks = sheet.attacks || [];
  const advantages = sheet.advantages || [];
  const disadvantages = sheet.disadvantages || [];
  const inventory = sheet.inventory || [];
  const armor = sheet.armor || [];
  const powers = sheet.powers || [];
  const allies = sheet.allies || [];
  const publicAllies = allies.map((ally) => ({
    ...ally,
    type: ally.type || "Individual",
    race: ally.race || "Humano",
    powerPercent: ally.powerPercent ?? 25,
    frequency: ally.frequency ?? 12,
    attributes: ally.attributes || { st: 10, dx: 10, iq: 10, ht: 10 },
    fpCurrent: ally.fpCurrent ?? 10,
    fpMax: ally.fpMax ?? 10,
  }));
  const missions = sheet.missions || [];
  const homebrew = sheet.homebrew || [];
  const conditions = sheet.conditions || [];
  const log = sheet.log || [];
  const hpMax = sheet.attributes.st + sheet.secondary.hpBonus;
  const fpMax = sheet.attributes.ht + sheet.secondary.fpBonus;
  const speed = (sheet.attributes.dx + sheet.attributes.ht) / 4 + (sheet.secondary.speedBonus || 0);
  const dodge = Math.max(1, Math.floor(speed) + 3 + sheet.secondary.dodgeBonus);
  const move = Math.max(1, sheet.secondary.moveBase + sheet.secondary.moveBonus);
  const will = sheet.attributes.iq + (sheet.secondary.willBonus || 0);
  const perception = sheet.attributes.iq + (sheet.secondary.perBonus || 0);
  const pointTotal = (sheet.attributes.st - 10) * 10 + (sheet.attributes.dx - 10) * 20 + (sheet.attributes.iq - 10) * 20 + (sheet.attributes.ht - 10) * 10 + advantages.reduce((sum, entry) => sum + entry.cost, 0) + disadvantages.reduce((sum, entry) => sum + entry.cost, 0) + skills.reduce((sum, entry) => sum + entry.points, 0) + powers.reduce((sum, entry) => sum + entry.pointCost, 0);

  return (
    <main className="shared-sheet">
      <header className="shared-sheet__header">
        <div><span><Cloud size={14} /> FICHA COMPARTILHADA</span><h1>{sheet.identity.name || character.name}</h1><p>{sheet.identity.concept || "Ficha de personagem GURPS 4e"}</p></div>
        <div className="shared-live"><Eye size={16} /><span>Ao vivo</span><small>atualizações instantâneas</small></div>
      </header>

      <section className="shared-sheet__hero">
        <img src={character.portraitUrl || "/manus-storage/codice-personagem-exemplo_5d5f7042.png"} alt={`Retrato de ${sheet.identity.name}`} />
        <div className="shared-hero__identity"><span>{sheet.identity.race || "Raça não informada"} · {sheet.identity.tl || "TL —"}</span><h2>{sheet.identity.campaign || "Campanha sem título"}</h2><p>{sheet.identity.world || "Mundo não informado"}</p><div className="shared-identity"><b>Jogador</b><span>{sheet.identity.player || "Não informado"}</span></div></div>
        <div className="shared-resources"><div><HeartPulse size={17} /><span>PV</span><b>{sheet.secondary.hpCurrent}/{hpMax}</b></div><div><Activity size={17} /><span>PF</span><b>{sheet.secondary.fpCurrent}/{fpMax}</b></div><div><Shield size={17} /><span>Esquiva</span><b>{dodge}</b></div><div><WandSparkles size={17} /><span>Pontos</span><b>{pointTotal}</b></div></div>
      </section>

      <section className="shared-grid">
        <article className="shared-card">
          <h3>BASE DO PERSONAGEM</h3>
          <div className="shared-attributes"><div><span>ST</span><b>{sheet.attributes.st}</b></div><div><span>DX</span><b>{sheet.attributes.dx}</b></div><div><span>IQ</span><b>{sheet.attributes.iq}</b></div><div><span>HT</span><b>{sheet.attributes.ht}</b></div><div><span>Vontade</span><b>{will}</b></div><div><span>Percepção</span><b>{perception}</b></div><div><span>Velocidade</span><b>{speed.toFixed(2)}</b></div><div><span>Movimento</span><b>{move}</b></div></div>
        </article>
        <article className="shared-card">
          <h3>ESTADO DA SESSÃO</h3>
          <div className="shared-chip-list">{conditions.length ? conditions.map((condition) => <span className="shared-chip" key={condition}>{condition}</span>) : <Empty>Sem condições ativas.</Empty>}</div>
          <div className="shared-mini-summary"><span><b>{advantages.length}</b> vantagens</span><span><b>{disadvantages.length}</b> desvantagens</span><span><b>{skills.length}</b> perícias</span><span><b>{allies.length}</b> aliados</span></div>
        </article>

        <article className="shared-card shared-card--wide">
          <h3><Swords size={15} /> COMBATE, ARMAS E PODERES</h3>
          <div className="shared-section-grid">
            <div><h4>Ataques</h4>{attacks.length ? <div className="shared-list">{attacks.map((attack) => <div key={attack.id}><b>{attack.name}</b><span>NH {attack.level}</span><small>{attack.damage || "Dano não informado"} · Alcance {attack.reach || "—"} · Aparar {attack.parry || "—"}</small></div>)}</div> : <Empty>Nenhum ataque cadastrado.</Empty>}</div>
            <div><h4>Proteção</h4>{armor.length ? <div className="shared-list">{armor.map((item) => <div key={item.id}><b>{item.location}</b><span>DR {item.dr}</span><small>{item.source || "Fonte não informada"}</small></div>)}</div> : <Empty>Nenhuma proteção cadastrada.</Empty>}</div>
            <div><h4>Poderes</h4>{powers.length ? <div className="shared-list">{powers.map((power) => <div key={power.id}><b>{power.name}</b><span>{power.type} · nível {power.level}</span><small>Fonte: {power.source || "não informada"} · Alcance: {power.range || "—"}</small><small>{power.damage ? `Dano: ${power.damage}` : `Efeito: ${power.effect || "não informado"}`} · {power.fpCost} PF · {power.pointCost} pts · {power.combatReady ? "pronto para combate" : "uso narrativo"}</small></div>)}</div> : <Empty>Nenhum poder cadastrado.</Empty>}</div>
          </div>
        </article>

        <article className="shared-card shared-card--wide">
          <h3><Target size={15} /> PERÍCIAS</h3>
          {skills.length ? <div className="shared-skill-list">{skills.map((skill) => <div key={skill.id}><b>{skill.name}</b><span>{skill.attribute} · {skill.difficulty}{skill.relative ? ` · ${skill.relative}` : ""}</span><strong>NH {skill.level}</strong><small>{skill.points} pts</small>{hasSkillDescription(skill.description) && <p>{skill.description}</p>}</div>)}</div> : <Empty>Nenhuma perícia cadastrada.</Empty>}
        </article>

        <article className="shared-card">
          <h3>VANTAGENS</h3>
          {advantages.length ? <div className="shared-list">{advantages.map((entry) => <div key={entry.id}><b>{entry.name}</b><span>{entry.cost} pts</span><small>Fonte: {entry.source || "não informada"} · {entry.notes || "sem observações"}</small></div>)}</div> : <Empty>Nenhuma vantagem cadastrada.</Empty>}
        </article>
        <article className="shared-card">
          <h3>DESVANTAGENS</h3>
          {disadvantages.length ? <div className="shared-list">{disadvantages.map((entry) => <div key={entry.id}><b>{entry.name}</b><span>{entry.cost} pts</span><small>Fonte: {entry.source || "não informada"} · {entry.notes || "sem observações"}</small></div>)}</div> : <Empty>Nenhuma desvantagem cadastrada.</Empty>}
        </article>

        <article className="shared-card shared-card--wide">
          <h3><Backpack size={15} /> EQUIPAMENTO</h3>
          {inventory.length ? <div className="shared-item-grid">{inventory.map((item) => <div key={item.id}><b>{item.name}</b><span>{item.category || "Item"}</span><small>{item.quantity}× · {item.weight} kg {item.carried ? "· carregado" : ""}{item.equipped ? " · equipado" : ""}</small></div>)}</div> : <Empty>Nenhum equipamento cadastrado.</Empty>}
        </article>

        <article className="shared-card shared-card--wide">
          <h3><UsersRound size={15} /> ALIADOS</h3>
          {publicAllies.length ? <div className="shared-ally-list">{publicAllies.map((ally) => {
            const allyAdvantages = ally.advantages || [];
            const allyDisadvantages = ally.disadvantages || [];
            const allySkills = ally.skills || [];
            const allyAttacks = ally.attacks || [];
            const allyInventory = ally.inventory || [];
            const allyConditions = ally.conditions || [];
            return <article className="shared-ally-card" key={ally.id}>
              <header><div><h4>{ally.name}</h4><span>{ally.relation || "Aliado"} · {ally.status} · {ally.type || "Individual"} · {ally.race || "Raça não informada"}</span></div><strong>PV {ally.hpCurrent}/{ally.hpMax} · PF {ally.fpCurrent ?? "—"}/{ally.fpMax ?? "—"}</strong></header>
              <p className="shared-ally-card__bio">{ally.description || "Sem descrição"}</p>
              <div className="shared-ally-card__summary"><span><b>{ally.points}</b> pts</span><span>custo <b>{ally.cost ?? "—"}</b></span><span>poder <b>{ally.powerPercent ?? "—"}%</b></span><span>frequência <b>{ally.frequency ?? "—"}</b></span><span>ST <b>{ally.attributes?.st ?? "—"}</b> · DX <b>{ally.attributes?.dx ?? "—"}</b> · IQ <b>{ally.attributes?.iq ?? "—"}</b> · HT <b>{ally.attributes?.ht ?? "—"}</b></span></div>
              <div className="shared-ally-card__details">
                <div><h5>Características</h5>{allyAdvantages.length || allyDisadvantages.length ? <div className="shared-compact-list">{allyAdvantages.map((item) => <span key={item.id}>+ {item.name} ({item.cost} pts){item.notes ? ` · ${item.notes}` : ""}</span>)}{allyDisadvantages.map((item) => <span key={item.id}>− {item.name} ({item.cost} pts){item.notes ? ` · ${item.notes}` : ""}</span>)}</div> : <small>Sem características cadastradas.</small>}</div>
                <div><h5>Perícias</h5>{allySkills.length ? <div className="shared-compact-list">{allySkills.map((item) => <span key={item.id}>{item.name} · {item.attribute} {item.relative || ""} · NH {item.level} · {item.points} pts{hasSkillDescription(item.description) ? ` · ${item.description}` : ""}</span>)}</div> : <small>Nenhuma perícia cadastrada.</small>}</div>
                <div><h5>Combate</h5>{allyAttacks.length ? <div className="shared-compact-list">{allyAttacks.map((item) => <span key={item.id}>{item.name} · NH {item.level} · {item.damage} · alcance {item.reach} · aparar {item.parry}</span>)}</div> : <small>Nenhum ataque cadastrado.</small>}</div>
                <div><h5>Inventário</h5>{allyInventory.length ? <div className="shared-compact-list">{allyInventory.map((item) => <span key={item.id}>{item.name} · {item.category} · {item.quantity}× · {item.weight} kg{item.carried ? " · carregado" : ""}{item.equipped ? " · equipado" : ""}</span>)}</div> : <small>Nenhum item cadastrado.</small>}</div>
                <div><h5>Condições</h5>{allyConditions.length ? <div className="shared-chip-list">{allyConditions.map((condition) => <span className="shared-chip" key={condition}>{condition}</span>)}</div> : <small>Sem condições ativas.</small>}</div>
                <div><h5>Notas de personagem</h5><small>Aparência: {ally.appearance || "não informada"} · Personalidade: {ally.personality || "não informada"} · Histórico: {ally.history || "não informado"} · Motivação: {ally.motivation || "não informada"} · Notas: {ally.notes || "nenhuma"}{ally.isDependent ? " · também é Dependente" : ""}</small></div>
              </div>
            </article>;
          })}</div> : <Empty>Nenhum aliado cadastrado.</Empty>}
        </article>

        <article className="shared-card">
          <h3>MISSÕES</h3>
          {missions.length ? <div className="shared-list">{missions.map((mission) => <div key={mission.id}><b>{mission.title}</b><span>{mission.status}</span><small>{mission.difficulty} · {mission.pointsReward} pts · {mission.moneyReward} {mission.currency}</small><small>{mission.notes || "Sem relatório adicional."}</small></div>)}</div> : <Empty>Nenhuma missão registrada.</Empty>}
        </article>
        <article className="shared-card">
          <h3>HOMEBREW</h3>
          {homebrew.length ? <div className="shared-list">{homebrew.map((entry) => <div key={entry.id}><b>{entry.title}</b><span>{entry.category}</span><small>{entry.content || "Sem descrição"}</small><small>Fonte: {entry.source || "não informada"}</small></div>)}</div> : <Empty>Nenhuma regra personalizada.</Empty>}
        </article>

        <article className="shared-card shared-card--wide">
          <h3><BookOpen size={15} /> DIÁRIO RECENTE</h3>
          {log.length ? <div className="shared-log-list">{log.slice().reverse().map((entry) => <div key={entry.id}><span>{entry.time} · {entry.kind}</span><p>{entry.text}</p></div>)}</div> : <Empty>Nenhum registro de sessão.</Empty>}
        </article>
      </section>

      <footer className="shared-sheet__footer"><Cloud size={15} /> Esta ficha é somente leitura. Alterações do mestre aparecem automaticamente aqui.</footer>
    </main>
  );
}
