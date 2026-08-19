import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("estilos de campos editáveis", () => {
  it("mantém texto branco sobre fundo grafite nos campos de escrita", () => {
    const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(stylesheet).toContain("Campos de escrita: preto grafite dos painéis");
    expect(stylesheet).toMatch(/input\[type="text"\][\s\S]*?textarea \{[\s\S]*?background: #111318 !important;[\s\S]*?color: #fff !important;/);
    expect(stylesheet).toContain("caret-color: #fff;");
  });

  it("mantém os valores dos atributos de Aliados dentro de cada célula", () => {
    const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(stylesheet).toMatch(/\.ally-attribute-grid label \{[\s\S]*?min-width: 0;[\s\S]*?overflow: hidden;/);
    expect(stylesheet).toMatch(/\.ally-attribute-grid input \{[\s\S]*?width: 100%;[\s\S]*?min-width: 0;[\s\S]*?box-sizing: border-box;[\s\S]*?text-align: center;/);
  });
});
