import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { isLocale, siteUrl } from "@/lib/i18n";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { SecuritySection } from "@/components/SecuritySection";
import { Skills } from "@/components/Skills";

type Params = Promise<{ lang: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = getContent(lang);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-semibold focus:text-page"
      >
        {content.ui.skipToContent}
      </a>


      <Header locale={lang} content={content} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero content={content} />
        <About content={content} />
        <Skills content={content} />
        <Projects content={content} />
        <SecuritySection content={content} />
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
    image: `${base}/foto-placeholder.png`, // TODO: trocar junto com a foto
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
