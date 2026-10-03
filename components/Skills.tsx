import type { CSSProperties } from "react";
import type { Skill, SkillGroup, SiteContent } from "@/content/types";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const BAR_WIDTH = 100;
const BAR_HEIGHT = 6;

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
            <SkillGroupCard group={group} levelLabel={skills.levelLabel} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SkillGroupCard({
  group,
  levelLabel,
}: {
  group: SkillGroup;
  levelLabel: string;
}) {
  return (
    <article className="h-full rounded-lg border border-line bg-surface/60 p-5">
      <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.15em] text-accent">
        {group.label}
      </h3>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">{group.caption}</p>

      <ul className="mt-6 space-y-5">
        {group.skills.map((skill) => (
          <li key={skill.name}>
            <SkillBar skill={skill} levelLabel={levelLabel} />
          </li>
        ))}
      </ul>
    </article>
  );
}

function SkillBar({ skill, levelLabel }: { skill: Skill; levelLabel: string }) {
  const level = Math.min(100, Math.max(0, skill.level));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-sm text-text">{skill.name}</span>
        <span className="font-mono text-xs tabular-nums text-muted">{level}%</span>
      </div>

      <svg
        role="img"
        aria-label={`${skill.name}: ${levelLabel} ${level} / 100`}
        viewBox={`0 0 ${BAR_WIDTH} ${BAR_HEIGHT}`}
        preserveAspectRatio="none"
        className="mt-2 h-1.5 w-full overflow-visible"
        focusable="false"
      >
        <title>{`${skill.name}: ${levelLabel} ${level} / 100`}</title>

        <rect
          x="0"
          y="0"
          width={BAR_WIDTH}
          height={BAR_HEIGHT}
          rx={BAR_HEIGHT / 2}
          className="fill-line"
        />

        <rect
          x="0"
          y="0"
          width={BAR_WIDTH}
          height={BAR_HEIGHT}
          rx={BAR_HEIGHT / 2}
          className="skill-bar-fill fill-accent"
          style={{ "--level-scale": level / 100 } as CSSProperties}
        />
      </svg>

      <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-muted">
        {skill.note}
      </p>
    </div>
  );
}
