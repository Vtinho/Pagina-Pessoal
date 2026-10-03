import type { ReactNode } from "react";
import type { SectionId } from "@/content/types";
import { Reveal } from "./Reveal";

export function Section({
  id,
  kicker,
  heading,
  intro,
  children,
  className = "",
}: {
  id: SectionId;
  kicker: string;
  heading: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-20 px-5 py-20 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {kicker}
          </p>

          <h2
            id={headingId}
            className="mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl"
          >
            {heading}
          </h2>

          {intro && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {intro}
            </p>
          )}
        </Reveal>

        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-mono text-sm uppercase tracking-[0.15em] text-muted">
      {children}
    </h3>
  );
}
