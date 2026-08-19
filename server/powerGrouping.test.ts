import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("agrupamento de poderes por tipo", () => {
  it("renderiza seções independentes para cada tipo sem descartar os cartões editáveis", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");

    expect(source).toContain('className="power-type-groups"');
    expect(source).toContain('className={`power-type-group power-type-group--${type.toLowerCase()}`}');
    expect(source).toContain('filter((power) => power.type === type)');
    expect(source).toContain('onClick={() => usePower(power)}');
    expect(source).toContain('onClick={() => removePower(power.id, power.name)}');
  });
});
