import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { LOCALES, isLocale, siteUrl } from "@/lib/i18n";
import {
  PAGE_SECTIONS,
  languageAlternates,
  pathFor,
  sectionFromSlug,
  slugFor,
  type PageSection,
} from "@/lib/routes";
import { AboutTerminal } from "@/components/AboutTerminal";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Projects } from "@/components/Projects";
import { SecuritySection } from "@/components/SecuritySection";
import { SkipLink } from "@/components/SkipLink";

type Params = Promise<{ lang: string; section: string }>;

export function generateStaticParams(): Array<{ lang: string; section: string }> {
  return LOCALES.flatMap((lang) =>
    PAGE_SECTIONS.map((section) => ({ lang, section: slugFor(section, lang) })),
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, section: slug } = await params;
  if (!isLocale(lang)) return { title: "Not found", robots: { index: false, follow: false } };

  const section = sectionFromSlug(slug, lang);
  if (!section) return { title: "Not found", robots: { index: false, follow: false } };

  const content = getContent(lang);
  const { heading, description } = headings(content, section);

  return {
    title: heading,
    description,
    alternates: {
      canonical: pathFor(section, lang),
      languages: languageAlternates(section),
    },
    openGraph: {
      type: "website",
      locale: content.meta.ogLocale,
      url: `${siteUrl()}${pathFor(section, lang)}`,
      title: `${heading} | ${content.hero.name}`,
      description,
    },
  };
}

export default async function SectionPage({ params }: { params: Params }) {
  const { lang, section: slug } = await params;
  if (!isLocale(lang)) notFound();

  const section = sectionFromSlug(slug, lang);
  if (!section) notFound();

  const content = getContent(lang);

  return (
    <>
      <SkipLink label={content.ui.skipToContent} />

      <Header locale={lang} content={content} current={section} />

      <main id="main" tabIndex={-1} className="outline-none">
        {section === "about" && <AboutTerminal content={content} locale={lang} />}
        {section === "projects" && <Projects content={content} />}
        {section === "security" && <SecuritySection content={content} />}
      </main>

      <Footer locale={lang} content={content} section={section} />
    </>
  );
}

function headings(
  content: ReturnType<typeof getContent>,
  section: PageSection,
): { heading: string; description: string } {
  if (section === "about") {
    return { heading: content.about.heading, description: content.about.teaser };
  }
  if (section === "projects") {
    return { heading: content.projects.heading, description: content.projects.intro };
  }
  return { heading: content.security.heading, description: content.security.intro };
}
