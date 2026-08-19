import { describe, expect, it } from "vitest";
import { advanceTemporaryEffect, formatEffectDuration, normalizeRemainingTurns, type TemporaryEffect } from "../shared/temporaryEffects";

const effect: TemporaryEffect = { id: "effect-1", name: "Atordoado", severity: "Moderado", remainingTurns: 2, source: "Ataque", notes: "" };

describe("temporary effects", () => {
  it("normaliza durações inválidas sem permitir valores negativos", () => {
    expect(normalizeRemainingTurns(-3)).toBe(0);
    expect(normalizeRemainingTurns(2.8)).toBe(2);
    expect(normalizeRemainingTurns(Number.NaN)).toBe(0);
  });

  it("formata duração permanente e duração por turnos", () => {
    expect(formatEffectDuration(0)).toBe("Até encerrar");
    expect(formatEffectDuration(1)).toBe("1 turno");
    expect(formatEffectDuration(3)).toBe("3 turnos");
  });

  it("avança o efeito e sinaliza quando seu último turno termina", () => {
    expect(advanceTemporaryEffect(effect)).toMatchObject({ effect: { remainingTurns: 1 }, expired: false });
    expect(advanceTemporaryEffect({ ...effect, remainingTurns: 1 })).toMatchObject({ effect: { remainingTurns: 0 }, expired: true });
    expect(advanceTemporaryEffect({ ...effect, remainingTurns: 0 })).toMatchObject({ effect: { remainingTurns: 0 }, expired: false });
  });
});
