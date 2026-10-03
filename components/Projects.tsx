import type { Project, ProjectsContent, SiteContent } from "@/content/types";
import { ExternalLink } from "./ExternalLink";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Projects({ content }: { content: SiteContent }) {
  const { projects, ui } = content;

  return (
    <Section
      id="projects"
      kicker={projects.kicker}
      heading={projects.heading}
      intro={projects.intro}
    >
      {projects.items.length === 0 ? (
        <Reveal>
          <p className="rounded-lg border border-dashed border-line p-8 text-center text-sm text-muted">
            {projects.emptyState}
          </p>
        </Reveal>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {projects.items.map((project, index) => (
            <li key={project.id} className="h-full">
              <Reveal delay={index * 100} className="h-full">
                <ProjectCard
                  project={project}
                  labels={projects.labels}
                  newTabHint={ui.opensInNewTab}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

function ProjectCard({
  project,
  labels,
  newTabHint,
}: {
  project: Project;
  labels: ProjectsContent["labels"];
  newTabHint: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-surface/60 p-6 transition-colors hover:border-line-strong">
      <header className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-text">{project.title}</h3>
        <span className="shrink-0 font-mono text-xs text-muted">{project.year}</span>
      </header>

      <dl className="mt-5 space-y-4 text-sm leading-relaxed">
        <Field label={labels.problem} value={project.problem} />
        <Field label={labels.solution} value={project.solution} />

        <div>
          <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
            {labels.stack}
          </dt>
          <dd className="mt-2">
            <ul className="flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded border border-line bg-accent-soft px-2 py-0.5 font-mono text-[11px] text-text"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </dd>
        </div>

        <Field label={labels.result} value={project.result} highlight />
      </dl>

      {(project.repoUrl ?? project.demoUrl) && (
        <div className="mt-auto flex flex-wrap gap-4 pt-6">
          {project.repoUrl && (
            <ExternalLink
              href={project.repoUrl}
              newTabHint={newTabHint}
              label={`${labels.repo}: ${project.title}`}
              className="font-mono text-xs text-accent underline-offset-4 hover:underline"
            >
              {labels.repo} <span aria-hidden="true">↗</span>
            </ExternalLink>
          )}

          {project.demoUrl && (
            <ExternalLink
              href={project.demoUrl}
              newTabHint={newTabHint}
              label={`${labels.demo}: ${project.title}`}
              className="font-mono text-xs text-accent underline-offset-4 hover:underline"
            >
              {labels.demo} <span aria-hidden="true">↗</span>
            </ExternalLink>
          )}
        </div>
      )}
    </article>
  );
}

function Field({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
        {label}
      </dt>
      <dd className={highlight ? "mt-1 font-medium text-text" : "mt-1 text-muted"}>
        {value}
      </dd>
    </div>
  );
}
