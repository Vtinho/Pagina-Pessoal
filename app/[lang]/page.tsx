import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { isLocale, siteUrl } from "@/lib/i18n";
import { pathFor } from "@/lib/routes";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SectionTeaser } from "@/components/SectionTeaser";
import { SkipLink } from "@/components/SkipLink";
import { Skills } from "@/components/Skills";

type Params = Promise<{ lang: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = getContent(lang);
  const { about, projects, security } = content;

  return (
    <>
      <SkipLink label={content.ui.skipToContent} />

      <Header locale={lang} content={content} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero content={content} />

        <SectionTeaser
          id="about"
          kicker={about.kicker}
          heading={about.heading}
          intro={about.teaser}
          items={[...about.experience.items, ...about.education.items].map((item) => ({
            title: item.title,
            meta: item.period,
          }))}
          href={pathFor("about", lang)}
          linkLabel={about.allLabel}
        />

        <Skills content={content} />

        <SectionTeaser
          id="projects"
          kicker={projects.kicker}
          heading={projects.heading}
          intro={projects.intro}
          items={projects.items.map((project) => ({
            title: project.title,
            meta: project.year,
          }))}
          href={pathFor("projects", lang)}
          linkLabel={projects.allLabel}
        />

        <SectionTeaser
          id="security"
          kicker={security.kicker}
          heading={security.heading}
          intro={security.intro}
          items={security.hardening.items.map((item) => ({ title: item.title }))}
          href={pathFor("security", lang)}
          linkLabel={security.allLabel}
        />

        <Contact content={content} />
      </main>

      <Footer locale={lang} content={content} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildJsonLd(lang, content) }}
      />
    </>
  );
}

function buildJsonLd(lang: string, content: ReturnType<typeof getContent>): string {
  const base = siteUrl();

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.hero.name,
    jobTitle: content.hero.role,
    description: content.meta.description,
    url: `${base}/${lang}`,
    image: `${base}/foto.jpg`,
    sameAs: [
      "https://github.com/Vtinho",
      "https://www.linkedin.com/in/vitor-manzotti-5b0731290",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidade Federal do ABC (UFABC)",
    },
    knowsAbout: content.meta.keywords,
  };

  return JSON.stringify(data).replace(/</g, "\\u003c");
}
