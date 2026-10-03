import type { HardeningItem, SecurityContent, SiteContent, StudyCard } from "@/content/types";
import { siteUrl } from "@/lib/i18n";
import { ExternalLink } from "./ExternalLink";
import { Reveal } from "./Reveal";
import { Section, SubHeading } from "./Section";

export function SecuritySection({ content }: { content: SiteContent }) {
  const { security, ui } = content;

  return (
    <Section
      id="security"
      kicker={security.kicker}
      heading={security.heading}
      intro={security.intro}
    >
      <div>
        <Reveal>
          <SubHeading>{security.studying.heading}</SubHeading>
          <p className="mt-2 text-sm text-muted">{security.studying.intro}</p>
        </Reveal>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {security.studying.items.map((item, index) => (
            <li key={item.id} className="h-full">
              <Reveal delay={index * 70} className="h-full">
                <StudyCardView card={item} newTabHint={ui.opensInNewTab} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20">
        <Reveal>
          <SubHeading>{security.hardening.heading}</SubHeading>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {security.hardening.intro}
          </p>
        </Reveal>

        <Reveal>
          <ul className="mt-6 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface/40">
            {security.hardening.items.map((item) => (
              <li key={item.id}>
                <HardeningRow item={item} labels={security.hardening.labels} />
              </li>
            ))}
          </ul>
        </Reveal>

        <ScannerLinks hardening={security.hardening} newTabHint={ui.opensInNewTab} />
      </div>
    </Section>
  );
}

function StudyCardView({ card, newTabHint }: { card: StudyCard; newTabHint: string }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-mono text-sm font-semibold text-text">{card.title}</h4>
        <span className="shrink-0 rounded border border-line bg-accent-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
          {card.tag}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{card.description}</p>

      {card.progress && (
        <p className="mt-4 font-mono text-[11px] text-line-strong">{card.progress}</p>
      )}
    </>
  );

  const shell =
    "flex h-full flex-col rounded-lg border border-line bg-surface/60 p-4 transition-colors";

  if (!card.url) {
    return <div className={shell}>{body}</div>;
  }

  return (
    <ExternalLink
      href={card.url}
      newTabHint={newTabHint}
      label={card.title}
      className={`${shell} hover:border-accent/50`}
    >
      {body}
    </ExternalLink>
  );
}

function HardeningRow({
  item,
  labels,
}: {
  item: HardeningItem;
  labels: SecurityContent["hardening"]["labels"];
}) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-surface-2 marker:content-none [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden="true"
          className="select-none font-mono text-xs text-accent transition-transform group-open:rotate-90"
        >
          ▸
        </span>
        <span className="font-mono text-sm text-text">{item.title}</span>
      </summary>

      <div className="space-y-3 border-t border-line bg-page/40 px-5 py-4 pl-11 text-sm leading-relaxed">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            {labels.what}
          </span>
          <p className="mt-1 text-muted">{item.what}</p>
        </div>

        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            {labels.why}
          </span>
          <p className="mt-1 text-muted">{item.why}</p>
        </div>

        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            {labels.where}
          </span>
          <p className="mt-1">
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-text">
              {item.where}
            </code>
          </p>
        </div>
      </div>
    </details>
  );
}

function ScannerLinks({
  hardening,
  newTabHint,
}: {
  hardening: SecurityContent["hardening"];
  newTabHint: string;
}) {
  const base = siteUrl();
  const host = safeHost(base);

  const isLocal = host === null || host.startsWith("localhost") || host.startsWith("127.");

  const hrefFor = (id: "observatory" | "securityheaders"): string | null => {
    if (isLocal || host === null) return null;
    return id === "observatory"
      ? `https://developer.mozilla.org/en-US/observatory/analyze?host=${encodeURIComponent(host)}`
      : `https://securityheaders.com/?q=${encodeURIComponent(base)}&followRedirects=on`;
  };

  return (
    <Reveal className="mt-10">
      <SubHeading>{hardening.scannersHeading}</SubHeading>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {hardening.scanners.map((scanner) => {
          const href = hrefFor(scanner.id);

          return (
            <li key={scanner.id}>
              <div className="h-full rounded-lg border border-line bg-surface/60 p-4">
                <h4 className="font-mono text-sm font-semibold text-text">
                  {href ? (
                    <ExternalLink
                      href={href}
                      newTabHint={newTabHint}
                      label={scanner.label}
                      className="text-accent underline-offset-4 hover:underline"
                    >
                      {scanner.label} <span aria-hidden="true">↗</span>
                    </ExternalLink>
                  ) : (
                    scanner.label
                  )}
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {scanner.description}
                </p>

                {!href && (
                  // TODO: este aviso some sozinho quando NEXT_PUBLIC_SITE_URL apontar para o domínio de produção.
                  <p className="mt-3 font-mono text-[11px] text-line-strong">
                    NEXT_PUBLIC_SITE_URL ainda aponta para localhost
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 max-w-3xl border-l-2 border-accent/40 pl-4 text-xs leading-relaxed text-muted">
        {hardening.disclaimer}
      </p>
    </Reveal>
  );
}

function safeHost(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
