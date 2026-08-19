import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("estilos de campos editáveis", () => {
  it("mantém texto branco sobre fundo preto nos campos de escrita", () => {
    const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(stylesheet).toContain("Campos de escrita: fundo preto e tinta branca");
    expect(stylesheet).toMatch(/input\[type="text"\][\s\S]*?textarea \{[\s\S]*?background: #000 !important;[\s\S]*?color: #fff !important;/);
    expect(stylesheet).toContain("caret-color: #fff;");
  });
});
