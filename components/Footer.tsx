import type { Locale, SiteContent } from "@/content/types";
import { SOCIAL } from "@/content/types";
import { ExternalLink } from "./ExternalLink";
import { LangSwitch } from "./LangSwitch";

export function Footer({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { footer, ui, contact } = content;

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line px-5 py-10 no-print">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs text-muted">
            {footer.copyright.replace("{year}", String(year))}
          </p>
          <p className="font-mono text-[11px] text-line-strong">{footer.builtWith}</p>
        </div>

        <nav aria-label={ui.navLabel} className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <ExternalLink
            href={SOCIAL.github}
            newTabHint={ui.opensInNewTab}
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            GitHub
          </ExternalLink>

          <ExternalLink
            href={SOCIAL.linkedin}
            newTabHint={ui.opensInNewTab}
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            LinkedIn
          </ExternalLink>

          <a
            href={`mailto:${contact.email}`}
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            {contact.labels.email}
          </a>

          <ExternalLink
            href={footer.sourceUrl}
            newTabHint={ui.opensInNewTab}
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            {footer.sourceLabel}
          </ExternalLink>

          <a
            href="/.well-known/security.txt"
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            {footer.securityTxtLabel}
          </a>

          <a
            href="#hero"
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            {ui.backToTop} <span aria-hidden="true">↑</span>
          </a>
        </nav>

        <LangSwitch current={locale} content={content} />
      </div>
    </footer>
  );
}
