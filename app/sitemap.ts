import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LOCALES, siteUrl } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale === "pt" ? "pt-BR" : locale, `${base}/${locale}`]),
  );

  return LOCALES.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === DEFAULT_LOCALE ? 1 : 0.8,
    alternates: { languages },
  }));
}
