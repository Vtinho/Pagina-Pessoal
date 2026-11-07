import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * O tema claro é só um bloco de variáveis. Esquecer UMA delas não quebra
 * build nem teste de tipo: a página simplesmente herda a cor do tema escuro
 * e nasce um texto ilegível. Daí este arquivo.
 */

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function tokens(selector: string): string[] {
  const start = css.indexOf(selector);
  expect(start, `bloco ${selector} não existe em globals.css`).toBeGreaterThan(-1);

  const block = css.slice(css.indexOf("{", start), css.indexOf("}", start));
  return [...block.matchAll(/--c-[\w-]+/g)].map((m) => m[0]).sort();
}

describe("paleta", () => {
  const dark = tokens(":root,\n:root[data-theme=\"dark\"]");
  const light = tokens(':root[data-theme="light"]');

  it("o tema escuro define pelo menos as cores de página, texto e acento", () => {
    expect(dark).toContain("--c-page");
    expect(dark).toContain("--c-text");
    expect(dark).toContain("--c-accent");
  });

  it("o tema claro define exatamente as mesmas variáveis do escuro", () => {
    expect(light).toEqual(dark);
  });

  it("cada variável da paleta é consumida por um token do Tailwind", () => {
    for (const token of dark) {
      if (token === "--c-shadow") continue; // consumido como cor de sombra, nao como token
      expect(css, `${token} não aparece em nenhum @theme`).toContain(`var(${token})`);
    }
  });
});

describe("script de boot", () => {
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

  it("recebe o nonce da CSP", () => {
    expect(layout).toContain('requestHeaders.get("x-nonce")');
    expect(layout).toContain("nonce={nonce}");
  });

  it("cai no tema do sistema quando não há escolha salva", () => {
    expect(layout).toContain("prefers-color-scheme: light");
  });
});
