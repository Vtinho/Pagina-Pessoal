import { describe, expect, it } from "vitest";
import { pt } from "@/content/site.pt";
import { en } from "@/content/site.en";
import { CONTENT } from "@/content";
import { LOCALES } from "@/lib/i18n";

/**
 * ===========================================================================
 * PARIDADE ENTRE OS IDIOMAS
 * ===========================================================================
 *
 * O TypeScript já garante MUITO: como os dois arquivos são anotados com
 * `SiteContent`, faltar um campo é erro de compilação. Este arquivo cobre o
 * que o compilador NÃO consegue ver, porque acontece dentro de arrays:
 *
 *   - um idioma com 2 projetos e o outro com 3;
 *   - o mesmo projeto com `id` diferente entre os arquivos;
 *   - um nível de skill mudado só no português;
 *   - uma tradução esquecida (texto idêntico ao do outro idioma);
 *   - um "TODO" que sobrou depois que você achou que tinha preenchido tudo.
 *
 * Nada disso quebra a compilação. Tudo isso quebra o site na prática.
 */

describe("estrutura", () => {
  function compareShape(a: unknown, b: unknown, path = ""): string[] {
    const problems: string[] = [];

    if (Array.isArray(a) || Array.isArray(b)) {
      if (!Array.isArray(a) || !Array.isArray(b)) {
        problems.push(`${path}: um é array e o outro não`);
        return problems;
      }
      if (a.length !== b.length) {
        problems.push(`${path}: pt tem ${a.length} item(s), en tem ${b.length}`);
        return problems;
      }
      a.forEach((item, index) => {
        problems.push(...compareShape(item, b[index], `${path}[${index}]`));
      });
      return problems;
    }

    if (a !== null && b !== null && typeof a === "object" && typeof b === "object") {
      const keysA = Object.keys(a).sort();
      const keysB = Object.keys(b).sort();

      const faltandoEmEn = keysA.filter((k) => !keysB.includes(k));
      const faltandoEmPt = keysB.filter((k) => !keysA.includes(k));

      if (faltandoEmEn.length) problems.push(`${path}: faltam em en -> ${faltandoEmEn.join(", ")}`);
      if (faltandoEmPt.length) problems.push(`${path}: faltam em pt -> ${faltandoEmPt.join(", ")}`);

      for (const key of keysA.filter((k) => keysB.includes(k))) {
        problems.push(
          ...compareShape(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key],
            path ? `${path}.${key}` : key,
          ),
        );
      }
      return problems;
    }

    if (typeof a !== typeof b) {
      problems.push(`${path}: tipos diferentes (${typeof a} vs ${typeof b})`);
    }

    return problems;
  }

  it("pt e en têm exatamente a mesma forma", () => {
    const problems = compareShape(pt, en);
    // Mostra TODOS os problemas de uma vez, e não só o primeiro: assim você
    expect(problems).toEqual([]);
  });

  it("existe conteúdo para cada idioma declarado em LOCALES", () => {
    for (const locale of LOCALES) {
      expect(CONTENT[locale], `conteúdo ausente para "${locale}"`).toBeDefined();
    }
  });
});

describe("dados que precisam ser idênticos nos dois idiomas", () => {
  it("os grupos de skill têm os mesmos ids, na mesma ordem", () => {
    expect(en.skills.groups.map((g) => g.id)).toEqual(pt.skills.groups.map((g) => g.id));
  });

  it("as skills têm os mesmos níveis nos dois idiomas", () => {
    pt.skills.groups.forEach((group, groupIndex) => {
      const other = en.skills.groups[groupIndex];
      expect(other, `grupo ${group.id} não existe em en`).toBeDefined();

      group.skills.forEach((skill, skillIndex) => {
        const twin = other?.skills[skillIndex];

        expect(twin, `${group.id}[${skillIndex}] não existe em en`).toBeDefined();
        expect(twin?.level, `nível de "${skill.name}" difere entre pt e en`).toBe(
          skill.level,
        );
      });
    });
  });

  it("nomes de produto não são traduzidos", () => {
    const nomesProprios = ["Python", "SQL (MySQL)", "Power Automate", "Burp Suite"];

    const nomesPt = pt.skills.groups.flatMap((g) => g.skills.map((s) => s.name));
    const nomesEn = en.skills.groups.flatMap((g) => g.skills.map((s) => s.name));

    for (const nome of nomesProprios) {
      expect(nomesPt, `"${nome}" sumiu de site.pt.ts`).toContain(nome);
      expect(nomesEn, `"${nome}" sumiu de site.en.ts`).toContain(nome);
    }
  });

  it("os projetos têm os mesmos ids, stack, ano e links", () => {
    pt.projects.items.forEach((project, index) => {
      const twin = en.projects.items[index];

      expect(twin?.id, `projeto ${index}`).toBe(project.id);
      expect(twin?.stack, `stack de ${project.id}`).toEqual(project.stack);
      expect(twin?.year, `ano de ${project.id}`).toBe(project.year);
      expect(twin?.repoUrl, `repoUrl de ${project.id}`).toBe(project.repoUrl);
      expect(twin?.demoUrl, `demoUrl de ${project.id}`).toBe(project.demoUrl);
    });
  });

  it("os cards de estudo e as medidas de segurança têm os mesmos ids", () => {
    expect(en.security.studying.items.map((i) => i.id)).toEqual(
      pt.security.studying.items.map((i) => i.id),
    );
    expect(en.security.hardening.items.map((i) => i.id)).toEqual(
      pt.security.hardening.items.map((i) => i.id),
    );
    expect(en.security.hardening.scanners.map((s) => s.id)).toEqual(
      pt.security.hardening.scanners.map((s) => s.id),
    );
  });

  it("aponta para o mesmo repositório nos dois rodapés", () => {
    expect(en.footer.sourceUrl).toBe(pt.footer.sourceUrl);
  });

  it("usa o mesmo e-mail de contato nos dois idiomas", () => {
    expect(en.contact.email).toBe(pt.contact.email);
  });
});

describe("consistência do idioma", () => {
  it("o hreflang de cada idioma está correto", () => {
    expect(pt.meta.htmlLang).toBe("pt-BR");
    expect(en.meta.htmlLang).toBe("en");
    expect(pt.meta.ogLocale).toBe("pt_BR");
    expect(en.meta.ogLocale).toBe("en_US");
  });

  it("os rótulos do menu foram traduzidos", () => {
    const traduzidos: Array<keyof typeof pt.nav> = [
      "about",
      "projects",
      "security",
      "contact",
    ];

    for (const key of traduzidos) {
      expect(en.nav[key], `nav.${key} não foi traduzido`).not.toBe(pt.nav[key]);
    }
  });

  it("os textos longos das seções foram traduzidos", () => {
    const pares: Array<[string, string, string]> = [
      ["meta.description", pt.meta.description, en.meta.description],
      ["hero.tagline", pt.hero.tagline, en.hero.tagline],
      ["about.heading", pt.about.heading, en.about.heading],
      ["skills.intro", pt.skills.intro, en.skills.intro],
      ["projects.intro", pt.projects.intro, en.projects.intro],
      ["security.intro", pt.security.intro, en.security.intro],
      ["contact.intro", pt.contact.intro, en.contact.intro],
    ];

    for (const [nome, textoPt, textoEn] of pares) {
      expect(textoEn, `${nome} parece não ter sido traduzido`).not.toBe(textoPt);
    }
  });

  it("os caminhos de currículo apontam para arquivos diferentes", () => {
    expect(pt.hero.cvPath).toBe("/cv-pt.pdf");
    expect(en.hero.cvPath).toBe("/cv-en.pdf");
  });
});

describe("sanidade do conteúdo", () => {
  it("nenhum nível de skill fica fora do intervalo 0-100", () => {
    for (const group of pt.skills.groups) {
      for (const skill of group.skills) {
        expect(skill.level, `${skill.name}`).toBeGreaterThanOrEqual(0);
        expect(skill.level, `${skill.name}`).toBeLessThanOrEqual(100);
      }
    }
  });

  it("todos os ids de projeto são únicos", () => {
    const ids = pt.projects.items.map((p) => p.id);
    expect(new Set(ids).size, "há ids repetidos").toBe(ids.length);
  });

  it("toda URL do conteúdo é https", () => {
    const urls = [
      pt.footer.sourceUrl,
      ...pt.projects.items.flatMap((p) => [p.repoUrl, p.demoUrl]),
      ...pt.security.studying.items.map((i) => i.url),
    ].filter((url): url is string => typeof url === "string");

    for (const url of urls) {
      expect(url, `${url} não é https`).toMatch(/^https:\/\//);
    }
  });

  it("a descrição de SEO cabe no resultado do Google", () => {
    for (const [locale, content] of Object.entries(CONTENT)) {
      expect(
        content.meta.description.length,
        `meta.description de ${locale} tem ${content.meta.description.length} caracteres`,
      ).toBeLessThanOrEqual(170);
    }
  });
});

describe("TODOs pendentes", () => {
  /**
   * Este bloco NÃO falha o build — ele imprime um lembrete.
   *
   * A ideia: enquanto houver placeholder, você vê a lista a cada `npm test`.
   * Quando terminar de preencher tudo, troque o `it.skip` por `it` e o teste
   * passa a impedir que um "TODO" volte a escapar para produção.
   */
  function findTodos(value: unknown, path = ""): string[] {
    if (typeof value === "string") {
      return value.includes("TODO") || value.includes("exemplo.com")
        ? [`${path}: ${value.slice(0, 60)}`]
        : [];
    }
    if (Array.isArray(value)) {
      return value.flatMap((item, i) => findTodos(item, `${path}[${i}]`));
    }
    if (value !== null && typeof value === "object") {
      return Object.entries(value).flatMap(([key, v]) =>
        findTodos(v, path ? `${path}.${key}` : key),
      );
    }
    return [];
  }

  it("lista o que ainda falta preencher", () => {
    const pendentes = [...findTodos(pt, "pt"), ...findTodos(en, "en")];

    if (pendentes.length > 0) {
      console.info(
        `\n  ${pendentes.length} campo(s) de conteúdo ainda com placeholder:\n` +
          pendentes.map((p) => `    - ${p}`).join("\n") +
          "\n",
      );
    }

    expect(true).toBe(true);
  });

  it.skip("não sobrou nenhum TODO no conteúdo", () => {
    // TODO: ative este teste (apague o `.skip`) quando terminar de preencher
    expect([...findTodos(pt, "pt"), ...findTodos(en, "en")]).toEqual([]);
  });
});
