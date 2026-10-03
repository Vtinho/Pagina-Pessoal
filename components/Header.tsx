import type { Locale, NavSectionId, SiteContent } from "@/content/types";
import { LangSwitch } from "./LangSwitch";

const NAV_ORDER: NavSectionId[] = ["about", "skills", "projects", "security", "contact"];

export function Header({ locale, content }: { locale: Locale; content: SiteContent }) {
  const links = NAV_ORDER.map((id) => ({ id, label: content.nav[id] }));

  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-page/85 backdrop-blur-md no-print"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <a
          href={`/${locale}`}
          className="font-mono text-sm font-semibold tracking-tight text-text"
        >
          vitor
          <span className="text-accent">.</span>
          manzotti
        </a>

        <nav aria-label={content.ui.navLabel} className="hidden md:block">
          <ul className="flex items-center gap-6 font-mono text-xs">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-muted transition-colors hover:text-accent"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch current={locale} content={content} className="hidden sm:block" />

          <details className="group relative md:hidden">
            <summary className="cursor-pointer list-none rounded border border-line px-2.5 py-1.5 font-mono text-xs text-muted marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="sr-only group-open:hidden">{content.ui.openMenu}</span>
              <span className="sr-only hidden group-open:inline">
                {content.ui.closeMenu}
              </span>

              <span aria-hidden="true" className="flex flex-col gap-[3px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </summary>

            <nav
              aria-label={content.ui.navLabel}
              className="absolute right-0 top-full mt-2 w-48 rounded-md border border-line bg-surface p-2 shadow-xl shadow-black/50"
            >
              <ul className="flex flex-col font-mono text-sm">
                {links.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="block rounded px-3 py-2 text-muted transition-colors hover:bg-surface-2 hover:text-accent"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-2 border-t border-line pt-2 sm:hidden">
                <LangSwitch current={locale} content={content} className="px-3 py-1" />
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
