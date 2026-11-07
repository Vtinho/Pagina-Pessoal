import Link from "next/link";
import type { Locale, SiteContent } from "@/content/types";
import { LOCALES } from "@/lib/i18n";
import { pathFor, type PageSection } from "@/lib/routes";

export function LangSwitch({
  current,
  content,
  section,
  className = "",
}: {
  current: Locale;
  content: SiteContent;
  /** Numa rota, o slug muda junto com o idioma: /pt/sobre -> /en/about. */
  section?: PageSection;
  className?: string;
}) {
  return (
    <nav aria-label={content.ui.langSwitchLabel} className={className}>
      <ul className="flex items-center gap-1 font-mono text-xs">
        {LOCALES.map((locale, index) => {
          const isCurrent = locale === current;

          return (
            <li key={locale} className="flex items-center">
              {index > 0 && (
                <span aria-hidden="true" className="px-1 text-line-strong">
                  |
                </span>
              )}

              <Link
                href={section ? pathFor(section, locale) : `/${locale}`}
                hrefLang={locale}
                lang={locale}
                aria-current={isCurrent ? "true" : undefined}
                className={
                  isCurrent
                    ? "inline-flex items-center rounded px-2.5 py-2 font-semibold text-accent"
                    : "inline-flex items-center rounded px-2.5 py-2 text-muted transition-colors hover:text-text"
                }
              >
                <span aria-hidden="true">{locale.toUpperCase()}</span>
                <span className="sr-only">{content.ui.langNames[locale]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
