import Link from "next/link";
import type { SectionId } from "@/content/types";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function SectionTeaser({
  id,
  kicker,
  heading,
  intro,
  items,
  href,
  linkLabel,
}: {
  id: SectionId;
  kicker: string;
  heading: string;
  intro: string;
  items: Array<{ title: string; meta?: string }>;
  href: string;
  linkLabel: string;
}) {
  return (
    <Section id={id} kicker={kicker} heading={heading} intro={intro}>
      <Reveal>
        {items.length > 0 && (
          <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface/40">
            {items.map((item) => (
              <li
                key={item.title}
                className="flex items-baseline justify-between gap-4 px-5 py-3.5"
              >
                <span className="min-w-0 text-sm text-text">{item.title}</span>
                {item.meta && (
                  <span className="shrink-0 font-mono text-xs text-muted">{item.meta}</span>
                )}
              </li>
            ))}
          </ul>
        )}

        <Link
          href={href}
          className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-accent underline-offset-4 hover:underline"
        >
          {linkLabel} <span aria-hidden="true">→</span>
        </Link>
      </Reveal>
    </Section>
  );
}
