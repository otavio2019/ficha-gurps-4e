import { trpc } from "@/lib/trpc";
import { liveSocket } from "@/lib/live";
import { Activity, Cloud, Eye, HeartPulse, Loader2, Shield, Swords, Target, UsersRound, WandSparkles } from "lucide-react";
import { useEffect } from "react";
import { useRoute } from "wouter";

type SharedSheet = {
  identity: { name: string; player: string; campaign: string; world: string; concept: string; race: string; tl: string };
  attributes: { st: number; dx: number; iq: number; ht: number };
  secondary: { hpCurrent: number; hpBonus: number; fpCurrent: number; fpBonus: number; dodgeBonus: number; moveBase: number; moveBonus: number };
  skills: Array<{ id: string; name: string; attribute: string; difficulty: string; level: number; points: number }>;
  attacks: Array<{ id: string; name: string; level: number; damage: string; reach: string; parry: string }>;
  advantages: Array<{ id: string; name: string; cost: number }>;
  disadvantages: Array<{ id: string; name: string; cost: number }>;
  allies?: Array<{ id: string; name: string; relation: string; description: string; points: number; hpCurrent: number; hpMax: number; status: string }>;
};

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
  const hpMax = sheet.attributes.st + sheet.secondary.hpBonus;
  const fpMax = sheet.attributes.ht + sheet.secondary.fpBonus;
  const speed = (sheet.attributes.dx + sheet.attributes.ht) / 4;
  const dodge = Math.max(1, Math.floor(speed) + 3 + sheet.secondary.dodgeBonus);
  const move = Math.max(1, sheet.secondary.moveBase + sheet.secondary.moveBonus);
  const pointTotal = (sheet.attributes.st - 10) * 10 + (sheet.attributes.dx - 10) * 20 + (sheet.attributes.iq - 10) * 20 + (sheet.attributes.ht - 10) * 10 + sheet.advantages.reduce((sum, entry) => sum + entry.cost, 0) + sheet.disadvantages.reduce((sum, entry) => sum + entry.cost, 0) + sheet.skills.reduce((sum, entry) => sum + entry.points, 0);

  const allies = sheet.allies || [];
  return <main className="shared-sheet"><header className="shared-sheet__header"><div><span><Cloud size={14} /> LINK DE CAMPANHA</span><h1>{sheet.identity.name || character.name}</h1><p>{sheet.identity.concept || "Ficha de personagem GURPS 4e"}</p></div><div className="shared-live"><Eye size={16} /><span>Visualização ao vivo</span><small>atualizações instantâneas</small></div></header><section className="shared-sheet__hero"><img src={character.portraitUrl || "/manus-storage/codice-personagem-exemplo_5d5f7042.png"} alt={`Retrato de ${sheet.identity.name}`} /><div><span>{sheet.identity.race} · {sheet.identity.tl}</span><h2>{sheet.identity.campaign || "Campanha sem título"}</h2><p>{sheet.identity.world || "Mundo não informado"}</p><div className="shared-identity"><b>Jogador</b><span>{sheet.identity.player || "Não informado"}</span></div></div><div className="shared-resources"><div><HeartPulse size={17} /><span>PV</span><b>{sheet.secondary.hpCurrent}/{hpMax}</b></div><div><Activity size={17} /><span>PF</span><b>{sheet.secondary.fpCurrent}/{fpMax}</b></div><div><Shield size={17} /><span>Esquiva</span><b>{dodge}</b></div><div><WandSparkles size={17} /><span>Pontos</span><b>{pointTotal}</b></div></div></section><section className="shared-grid"><article className="shared-card"><h3>ATRIBUTOS</h3><div className="shared-attributes"><div><span>ST</span><b>{sheet.attributes.st}</b></div><div><span>DX</span><b>{sheet.attributes.dx}</b></div><div><span>IQ</span><b>{sheet.attributes.iq}</b></div><div><span>HT</span><b>{sheet.attributes.ht}</b></div><div><span>Mov.</span><b>{move}</b></div><div><span>Vel.</span><b>{speed.toFixed(2)}</b></div></div></article><article className="shared-card"><h3><Swords size={15} /> ATAQUES</h3>{sheet.attacks.length ? <div className="shared-list">{sheet.attacks.map((attack) => <div key={attack.id}><b>{attack.name}</b><span>NH {attack.level}</span><span>{attack.damage}</span><small>Alcance {attack.reach} · Aparar {attack.parry}</small></div>)}</div> : <p className="shared-empty">Nenhum ataque cadastrado.</p>}</article><article className="shared-card shared-card--wide"><h3><Target size={15} /> PERÍCIAS</h3><div className="shared-skills"><div className="shared-skills__head"><span>Perícia</span><span>Atributo</span><span>Dif.</span><span>NH</span><span>Pontos</span></div>{sheet.skills.map((skill) => <div key={skill.id}><b>{skill.name}</b><span>{skill.attribute}</span><span>{skill.difficulty}</span><span>{skill.level}</span><span>{skill.points}</span></div>)}</div></article>{allies.length > 0 && <article className="shared-card shared-card--wide"><h3><UsersRound size={15} /> ALIADOS</h3><div className="shared-list">{allies.map((ally) => <div key={ally.id}><b>{ally.name}</b><span>{ally.relation}</span><span>PV {ally.hpCurrent}/{ally.hpMax}</span><small>{ally.status} · {ally.points} pts · {ally.description}</small></div>)}</div></article>}</section><footer className="shared-sheet__footer"><Cloud size={15} /> Esta ficha está conectada ao canal da sessão. Alterações do mestre aparecem instantaneamente.</footer></main>;
}
