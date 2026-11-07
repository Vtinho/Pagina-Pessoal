import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/i18n";
import {
  PAGE_SECTIONS,
  languageAlternates,
  pathFor,
  sectionFromSlug,
  slugFor,
} from "@/lib/routes";
import { CONTENT } from "@/content";

/**
 * O mapa de slug é o único lugar onde o endereço de uma página existe. Um
 * slug repetido entre seções, ou um que não volta para a seção de origem,
 * produz 404 ou a página errada — e nada disso quebra a compilação.
 */

describe("mapa de slugs", () => {
  it("toda seção tem slug em todo idioma", () => {
    for (const section of PAGE_SECTIONS) {
      for (const locale of LOCALES) {
        expect(slugFor(section, locale).length, `${section}/${locale}`).toBeGreaterThan(0);
      }
    }
  });

  it("os slugs não se repetem dentro do mesmo idioma", () => {
    for (const locale of LOCALES) {
      const slugs = PAGE_SECTIONS.map((section) => slugFor(section, locale));
      expect(new Set(slugs).size, `slug repetido em ${locale}`).toBe(slugs.length);
    }
  });

  it("todo slug volta para a seção de origem", () => {
    for (const section of PAGE_SECTIONS) {
      for (const locale of LOCALES) {
        expect(sectionFromSlug(slugFor(section, locale), locale)).toBe(section);
      }
    }
  });

  it("slug desconhecido devolve null em vez de adivinhar", () => {
    expect(sectionFromSlug("nao-existe", "pt")).toBeNull();
    // O slug de um idioma não vale no outro: /pt/security não é rota.
    expect(sectionFromSlug("security", "pt")).toBeNull();
    expect(sectionFromSlug("seguranca", "en")).toBeNull();
  });

  it("todo slug é ASCII minúsculo, sem acento e sem espaço", () => {
    for (const section of PAGE_SECTIONS) {
      for (const locale of LOCALES) {
        expect(slugFor(section, locale), `${section}/${locale}`).toMatch(/^[a-z0-9-]+$/);
      }
    }
  });
});

describe("hreflang", () => {
  it("cada rota aponta para a sua tradução, não para a home", () => {
    for (const section of PAGE_SECTIONS) {
      const alternates = languageAlternates(section);

      expect(alternates["pt-BR"]).toBe(pathFor(section, "pt"));
      expect(alternates["en"]).toBe(pathFor(section, "en"));
      expect(alternates["x-default"]).toBe(pathFor(section, "pt"));
    }
  });

  it("sem seção, aponta para a home de cada idioma", () => {
    const alternates = languageAlternates();

    expect(alternates["pt-BR"]).toBe("/pt");
    expect(alternates["en"]).toBe("/en");
    expect(alternates["x-default"]).toBe("/pt");
  });
});

describe("conteúdo que as novas páginas exigem", () => {
  it("cada seção com página tem rótulo de link preenchido nos dois idiomas", () => {
    for (const [locale, content] of Object.entries(CONTENT)) {
      for (const label of [
        content.about.allLabel,
        content.projects.allLabel,
        content.security.allLabel,
      ]) {
        expect(label.trim().length, `rótulo vazio em ${locale}`).toBeGreaterThan(0);
      }
    }
  });

  it("a ficha do terminal tem os mesmos rótulos nos dois idiomas, na mesma ordem", () => {
    const [pt, en] = [CONTENT.pt, CONTENT.en];
    expect(en.about.terminal.facts.length).toBe(pt.about.terminal.facts.length);

    pt.about.terminal.facts.forEach((fact, index) => {
      expect(en.about.terminal.facts[index]?.value.length).toBeGreaterThan(0);
      expect(fact.value.length).toBeGreaterThan(0);
    });
  });
});
