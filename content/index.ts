import type { Locale, SiteContent } from "./types";
import { pt } from "./site.pt";
import { en } from "./site.en";

/**
 * Registro de conteúdo por idioma.
 *
 * O tipo `Record<Locale, SiteContent>` é a segunda metade da garantia:
 *   - types.ts obriga cada arquivo a ter TODOS os campos;
 *   - este Record obriga a existir um arquivo para CADA idioma.
 *
 * Adicionou um idioma em `Locale` (ex.: "es") e esqueceu de criar
 * site.es.ts? O TypeScript quebra exatamente aqui.
 */
export const CONTENT: Record<Locale, SiteContent> = { pt, en };

export function getContent(locale: Locale): SiteContent {
  return CONTENT[locale];
}

export type { Locale, SiteContent };
export { SECTION_IDS, SOCIAL } from "./types";
