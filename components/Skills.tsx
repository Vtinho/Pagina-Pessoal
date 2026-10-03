import type { SkillGroup, SiteContent } from "@/content/types";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Skills({ content }: { content: SiteContent }) {
  const { skills } = content;

  return (
    <Section
      id="skills"
      kicker={skills.kicker}
      heading={skills.heading}
      intro={skills.intro}
    >
      <div className="grid gap-8 md:grid-cols-3">
        {skills.groups.map((group, index) => (
          <Reveal key={group.id} delay={index * 120}>
            <SkillGroupCard group={group} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SkillGroupCard({ group }: { group: SkillGroup }) {
  return (
    <article className="h-full rounded-lg border border-line bg-surface/60 p-5">
      <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.15em] text-accent">
        {group.label}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{group.caption}</p>

      <ul className="mt-6 space-y-4">
        {group.skills.map((skill) => (
          <li key={skill.name} className="border-l border-line pl-3">
            <p className="font-mono text-sm text-text">{skill.name}</p>
            <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted">
              {skill.note}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}
