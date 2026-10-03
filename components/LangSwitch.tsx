import Link from "next/link";
import type { Locale, SiteContent } from "@/content/types";
import { LOCALES } from "@/lib/i18n";

export function LangSwitch({
  current,
  content,
  hash = "",
  className = "",
}: {
  current: Locale;
  content: SiteContent;
  hash?: string;
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
                href={`/${locale}${hash}`}
                hrefLang={locale}
                lang={locale}
                aria-current={isCurrent ? "true" : undefined}
                className={
                  isCurrent
                    ? "rounded px-1.5 py-1 font-semibold text-accent"
                    : "rounded px-1.5 py-1 text-muted transition-colors hover:text-text"
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
