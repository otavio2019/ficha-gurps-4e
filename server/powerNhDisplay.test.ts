import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("NH de poderes nas superfícies de leitura", () => {
  it("usa a regra de cálculo vinculada no Combate e no link compartilhado", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const shared = readFileSync(resolve(process.cwd(), "client/src/pages/SharedCharacter.tsx"), "utf8");

    expect(home).toContain('const getPowerNh = (power: Power) => calculateAttackNh');
    expect(home).toContain('NH {getPowerNh(power)}');
    expect(shared).toContain('const getPowerNh = (power: NonNullable<SharedSheet["powers"]>[number])');
    expect(shared).toContain('NH {getPowerNh(power)}');
  });
});
