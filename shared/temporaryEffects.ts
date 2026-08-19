export const TEMPORARY_EFFECT_SEVERITIES = ["Leve", "Moderado", "Grave", "Crítico"] as const;

export type TemporaryEffectSeverity = (typeof TEMPORARY_EFFECT_SEVERITIES)[number];

export type TemporaryEffect = {
  id: string;
  name: string;
  severity: TemporaryEffectSeverity;
  remainingTurns: number;
  source: string;
  notes: string;
};

export const normalizeRemainingTurns = (value: number) => Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));

export const formatEffectDuration = (remainingTurns: number) => {
  const normalized = normalizeRemainingTurns(remainingTurns);
  return normalized === 0 ? "Até encerrar" : `${normalized} turno${normalized === 1 ? "" : "s"}`;
};

export const advanceTemporaryEffect = (effect: TemporaryEffect) => {
  const remainingTurns = normalizeRemainingTurns(effect.remainingTurns);
  if (remainingTurns === 0) return { effect: { ...effect, remainingTurns }, expired: false };
  if (remainingTurns === 1) return { effect: { ...effect, remainingTurns: 0 }, expired: true };
  return { effect: { ...effect, remainingTurns: remainingTurns - 1 }, expired: false };
};
