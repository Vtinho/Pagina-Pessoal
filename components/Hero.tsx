import type { SiteContent } from "@/content/types";
import { SOCIAL } from "@/content/types";
import { ExternalLink } from "./ExternalLink";
import { Typewriter } from "./Typewriter";

export function Hero({ content }: { content: SiteContent }) {
  const { hero, ui } = content;

  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100svh-3.5rem)] items-center px-5 pb-16 pt-12"
    >
      <div className="grid-backdrop pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto w-full max-w-5xl">
        <div className="max-w-xl overflow-hidden rounded-lg border border-line bg-surface/80 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-line bg-surface-2/60 px-4 py-2.5">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            </span>
            <span className="font-mono text-[11px] text-muted">{hero.terminalTitle}</span>
          </div>

          <div className="px-4 py-5 font-mono text-sm sm:text-base">
            <p className="flex items-baseline gap-2">
              <span aria-hidden="true" className="shrink-0 text-accent">
                {hero.prompt}
              </span>
              <Typewriter lines={hero.typedCommands} className="text-text" />
            </p>

            <p className="sr-only">
              {hero.typedCommands.join(". ")}
            </p>

            <div className="mt-3 space-y-1 text-xs text-muted sm:text-sm">
              {hero.outputLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl">
            {hero.name}
          </h1>

          <p className="mt-2 font-mono text-sm text-accent sm:text-base">{hero.role}</p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {hero.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ExternalLink
              href={SOCIAL.github}
              newTabHint={ui.opensInNewTab}
              className="rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-semibold text-page transition-opacity hover:opacity-90"
            >
              {hero.actions.github}
            </ExternalLink>

            <ExternalLink
              href={SOCIAL.linkedin}
              newTabHint={ui.opensInNewTab}
              className="rounded-md border border-line px-5 py-2.5 font-mono text-sm text-text transition-colors hover:border-accent hover:text-accent"
            >
              {hero.actions.linkedin}
            </ExternalLink>

            {/*
              Download do CV.

              `download` sugere baixar em vez de abrir no navegador. Não usa
              target="_blank" porque não é navegação para outro site — é um
              arquivo do próprio domínio.

              TODO: coloque os PDFs em public/cv-pt.pdf e public/cv-en.pdf.
              Enquanto os arquivos não existirem, este link devolve 404.
            */}
            <a
              href={hero.cvPath}
              download
              className="rounded-md border border-line px-5 py-2.5 font-mono text-sm text-text transition-colors hover:border-accent hover:text-accent"
            >
              {hero.actions.cv}
              <span aria-hidden="true" className="ml-1.5 text-accent">
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
