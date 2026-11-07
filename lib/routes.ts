import type { Locale } from "@/content/types";
import { DEFAULT_LOCALE, LOCALES } from "./i18n";

export const PAGE_SECTIONS = ["about", "projects", "security"] as const;

export type PageSection = (typeof PAGE_SECTIONS)[number];

// Slug por idioma. Sem acento e sem cedilha de propósito: endereço com
// caractere fora do ASCII vira percent-encoding feio ao ser copiado.
const SLUGS: Record<PageSection, Record<Locale, string>> = {
  about: { pt: "sobre", en: "about" },
  projects: { pt: "projetos", en: "projects" },
  security: { pt: "seguranca", en: "security" },
};

export function slugFor(section: PageSection, locale: Locale): string {
  return SLUGS[section][locale];
}

export function pathFor(section: PageSection, locale: Locale): string {
  return `/${locale}/${SLUGS[section][locale]}`;
}

export function sectionFromSlug(slug: string, locale: Locale): PageSection | null {
  return PAGE_SECTIONS.find((section) => SLUGS[section][locale] === slug) ?? null;
}

const HREFLANG: Record<Locale, string> = { pt: "pt-BR", en: "en" };

export function languageAlternates(section?: PageSection): Record<string, string> {
  const href = (locale: Locale) => (section ? pathFor(section, locale) : `/${locale}`);

  return {
    ...Object.fromEntries(LOCALES.map((locale) => [HREFLANG[locale], href(locale)])),
    "x-default": href(DEFAULT_LOCALE),
  };
}
