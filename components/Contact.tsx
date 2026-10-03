import type { SiteContent } from "@/content/types";
import { SOCIAL } from "@/content/types";
import { ContactForm } from "./ContactForm";
import { ExternalLink } from "./ExternalLink";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Contact({ content }: { content: SiteContent }) {
  const { contact, ui } = content;

  return (
    <Section
      id="contact"
      kicker={contact.kicker}
      heading={contact.heading}
      intro={contact.intro}
    >
      <div className="grid gap-12 md:grid-cols-[260px_minmax(0,1fr)] md:gap-14">
        <Reveal>
          <ul className="space-y-5">
            <li>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                {contact.labels.email}
              </p>
              {/*
                TODO: o e-mail vem de content/site.*.ts -> contact.email.

                Sobre expor o e-mail em texto: sim, robô de spam varre páginas
                atrás de mailto:. As alternativas (ofuscar com JavaScript,
                virar imagem) atrapalham quem usa leitor de tela e quem quer
                só copiar o endereço. Num portfólio, ser encontrável vale mais
                que evitar spam — e filtro de spam moderno dá conta do resto.
              */}
              <a
                href={`mailto:${contact.email}`}
                className="mt-1 block break-all text-sm text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                {contact.email}
              </a>
            </li>

            <li>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                {contact.labels.linkedin}
              </p>
              <ExternalLink
                href={SOCIAL.linkedin}
                newTabHint={ui.opensInNewTab}
                className="mt-1 block text-sm text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                /in/vitor-manzotti
              </ExternalLink>
            </li>

            <li>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                {contact.labels.github}
              </p>
              <ExternalLink
                href={SOCIAL.github}
                newTabHint={ui.opensInNewTab}
                className="mt-1 block text-sm text-text underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                @Vtinho
              </ExternalLink>
            </li>
          </ul>
        </Reveal>

        <Reveal>
          <div className="rounded-lg border border-line bg-surface/50 p-6 sm:p-8">
            <ContactForm content={contact} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
