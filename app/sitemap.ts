import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LOCALES, siteUrl } from "@/lib/i18n";
import { PAGE_SECTIONS, languageAlternates, pathFor } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  const absolute = (paths: Record<string, string>) =>
    Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, `${base}${path}`]));

  const home = LOCALES.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: locale === DEFAULT_LOCALE ? 1 : 0.8,
    alternates: { languages: absolute(languageAlternates()) },
  }));

  const sections = LOCALES.flatMap((locale) =>
    PAGE_SECTIONS.map((section) => ({
      url: `${base}${pathFor(section, locale)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: locale === DEFAULT_LOCALE ? 0.9 : 0.7,
      alternates: { languages: absolute(languageAlternates(section)) },
    })),
  );

  return [...home, ...sections];
}
