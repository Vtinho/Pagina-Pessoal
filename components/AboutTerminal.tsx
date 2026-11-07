import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale, SiteContent, TimelineItem } from "@/content/types";
import { SOCIAL } from "@/content/types";
import { Clock } from "./Clock";
import { ExternalLink } from "./ExternalLink";
import { Reveal } from "./Reveal";

export function AboutTerminal({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  const { about, hero, skills, contact, ui } = content;
  const { terminal } = about;

  return (
    <div className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="overflow-hidden rounded-lg border border-line bg-surface/70 shadow-2xl shadow-(color:--c-shadow)">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-4 py-2.5 font-mono text-[11px] text-muted">
            <span>{hero.terminalTitle}</span>
            <span aria-hidden="true" className="text-line-strong">
              {terminal.fileLabel}
            </span>
          </div>

          <div className="px-4 py-6 sm:px-6 sm:py-8">
            <Prompt>{terminal.identityCommand}</Prompt>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              {hero.name}
            </h1>

            <p className="mt-2 font-mono text-sm text-accent">{hero.role}</p>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="space-y-6">
            <Reveal>
              <Pane label={terminal.fileLabel} meta="utf-8">
                <div className="flex flex-wrap items-start gap-5">
                  <Image
                    src="/foto.jpg"
                    alt={about.photoAlt}
                    width={104}
                    height={104}
                    className="size-24 shrink-0 rounded border border-line object-cover"
                    sizes="104px"
                  />

                  <dl className="min-w-0 flex-1 space-y-1.5 font-mono text-xs">
                    {terminal.facts.map((fact) => (
                      <div key={fact.label} className="flex flex-wrap gap-x-3">
                        <dt className="w-24 shrink-0 text-line-strong">{fact.label}</dt>
                        <dd className="min-w-0 flex-1 text-text">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="mt-7 border-t border-line pt-5">
                  <Prompt>{terminal.readCommand}</Prompt>

                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
                    {about.bio.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  <p className="mt-6 font-mono text-[11px] text-line-strong">
                    <span aria-hidden="true">↳ </span>
                    {terminal.endOfFile}
                  </p>
                </div>
              </Pane>
            </Reveal>

            <Reveal>
              <Pane label={about.experience.heading} meta={`${about.experience.items.length}`}>
                <Timeline items={about.experience.items} />
              </Pane>
            </Reveal>

            <Reveal>
              <Pane label={about.education.heading} meta={`${about.education.items.length}`}>
                <Timeline items={about.education.items} />
              </Pane>
            </Reveal>
          </div>

          <aside className="space-y-6" aria-label={about.heading}>
            <Pane label={terminal.panes.clock}>
              <Clock note={terminal.panes.clockNote} locale={content.meta.htmlLang} />
            </Pane>

            <Pane label={terminal.panes.skills} meta={`${skills.groups.length}`}>
              <Prompt small>{terminal.panes.skillsCommand}</Prompt>

              <ul className="mt-3 font-mono text-xs">
                {skills.groups.map((group, index) => (
                  <li key={group.id} className="flex gap-2 py-0.5">
                    <span aria-hidden="true" className="select-none text-line-strong">
                      {index === skills.groups.length - 1 ? "└──" : "├──"}
                    </span>
                    <a
                      href={`/${locale}#skills`}
                      className="min-w-0 flex-1 text-muted transition-colors hover:text-accent"
                    >
                      {group.label}{" "}
                      <span className="text-line-strong">({group.skills.length})</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Pane>

            <Pane label={terminal.panes.links}>
              <nav className="flex flex-col gap-2 font-mono text-xs" aria-label={terminal.panes.links}>
                <ExternalLink
                  href={SOCIAL.github}
                  newTabHint={ui.opensInNewTab}
                  className="flex items-center justify-between gap-2 text-muted transition-colors hover:text-accent"
                >
                  github <span aria-hidden="true">↗</span>
                </ExternalLink>

                <ExternalLink
                  href={SOCIAL.linkedin}
                  newTabHint={ui.opensInNewTab}
                  className="flex items-center justify-between gap-2 text-muted transition-colors hover:text-accent"
                >
                  linkedin <span aria-hidden="true">↗</span>
                </ExternalLink>

                <a
                  href={`/${locale}#contact`}
                  className="flex items-center justify-between gap-2 text-muted transition-colors hover:text-accent"
                >
                  {contact.labels.email.toLowerCase()} <span aria-hidden="true">→</span>
                </a>
              </nav>
            </Pane>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Pane({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-line bg-surface/50">
      <h2 className="flex items-baseline justify-between gap-3 border-b border-line bg-surface-2/40 px-4 py-2 font-mono text-[11px] lowercase text-muted">
        <span className="min-w-0 truncate">{label}</span>
        {meta && (
          <span aria-hidden="true" className="shrink-0 text-line-strong">
            {meta}
          </span>
        )}
      </h2>

      <div className="px-4 py-5">{children}</div>
    </section>
  );
}

function Prompt({ children, small = false }: { children: ReactNode; small?: boolean }) {
  return (
    <p className={`font-mono ${small ? "text-[11px]" : "text-sm"}`}>
      <span aria-hidden="true" className="mr-2 select-none text-accent">
        $
      </span>
      <span className="text-text">{children}</span>
    </p>
  );
}

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="space-y-6">
      {items.map((item) => (
        <li key={`${item.org}-${item.title}`} className="relative border-l border-line pl-5">
          <span
            aria-hidden="true"
            className="absolute -left-[4.5px] top-1.5 size-2 rounded-full bg-accent"
          />

          <p className="font-mono text-xs text-muted">{item.period}</p>

          <h3 className="mt-1 text-base font-semibold text-text">{item.title}</h3>
          <p className="text-sm text-accent">{item.org}</p>

          <ul className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-muted">
            {item.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2">
                <span aria-hidden="true" className="select-none text-line-strong">
                  —
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
