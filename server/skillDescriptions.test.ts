import { describe, expect, it } from "vitest";
import { hasSkillDescription } from "../shared/skillDescriptions";

describe("descrições de perícias", () => {
  it("identifica descrições preenchidas e ignora valores vazios", () => {
    expect(hasSkillDescription("Rastreia sinais e pegadas na mata.")).toBe(true);
    expect(hasSkillDescription("   ")).toBe(false);
    expect(hasSkillDescription()).toBe(false);
  });
});
