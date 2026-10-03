import Image from "next/image";
import type { SiteContent, TimelineItem } from "@/content/types";
import { Reveal } from "./Reveal";
import { Section, SubHeading } from "./Section";

export function About({ content }: { content: SiteContent }) {
  const { about } = content;

  return (
    <Section id="about" kicker={about.kicker} heading={about.heading}>
      <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_240px] md:gap-10">
        <div className="space-y-12">
          <Reveal>
            <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
              {about.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <SubHeading>{about.experience.heading}</SubHeading>
            <ol className="mt-5 space-y-6">
              {about.experience.items.map((item) => (
                <TimelineEntry key={`${item.org}-${item.title}`} item={item} />
              ))}
            </ol>
          </Reveal>

          <Reveal>
            <SubHeading>{about.education.heading}</SubHeading>
            <ol className="mt-5 space-y-6">
              {about.education.items.map((item) => (
                <TimelineEntry key={`${item.org}-${item.title}`} item={item} />
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="order-first md:order-last">
          <figure className="relative mx-auto w-40 sm:w-48 md:w-full">
            {/*
              next/image em vez de <img>.

              O que ele faz por você: converte para WebP/AVIF, gera as versões
              por tamanho de tela, e — o mais importante para o layout —
              reserva o espaço antes da imagem chegar, evitando que o texto
              "salte" durante o carregamento (o CLS que o Lighthouse mede).

              `width`/`height` definem a PROPORÇÃO, não o tamanho final: o
              tamanho quem manda é o CSS.

              TODO: TROQUE A FOTO.
                1. Coloque a sua imagem em public/ (800x800, quadrada — o
                   recorte é circular, então centralize o rosto).
                2. Ajuste o `src` abaixo para o nome do seu arquivo.
                   Se for .jpg, o caminho vira "/sua-foto.jpg".
              O placeholder atual é um PNG gerado para o tema do site.
            */}
            <Image
              src="/foto-placeholder.png"
              alt={about.photoAlt}
              width={800}
              height={800}
              className="aspect-square w-full rounded-full border border-line object-cover grayscale transition-all duration-500 hover:grayscale-0"
              sizes="(max-width: 768px) 12rem, 240px"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-full border border-accent/40"
            />
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}

function TimelineEntry({ item }: { item: TimelineItem }) {
  return (
    <li className="relative border-l border-line pl-5">
      <span
        aria-hidden="true"
        className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-accent"
      />

      <p className="font-mono text-xs text-muted">{item.period}</p>

      <h4 className="mt-1 text-base font-semibold text-text">{item.title}</h4>
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
  );
}
