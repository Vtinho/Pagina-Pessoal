import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { SOCIAL } from "@/content/types";
import { DEFAULT_LOCALE, LOCALES, isLocale, siteUrl } from "@/lib/i18n";

export function generateStaticParams(): Array<{ lang: string }> {
  return LOCALES.map((lang) => ({ lang }));
}

type Params = Promise<{ lang: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;

  if (!isLocale(lang)) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  const content = getContent(lang);
  const base = siteUrl();

  return {
    metadataBase: new URL(base),

    title: {
      default: content.meta.title,
      template: content.meta.titleTemplate,
    },
    description: content.meta.description,
    keywords: content.meta.keywords,
    authors: [{ name: "Vitor Manzotti", url: SOCIAL.github }],
    creator: "Vitor Manzotti",

    alternates: {
      canonical: `/${lang}`,
      languages: {
        "pt-BR": "/pt",
        en: "/en",
        "x-default": `/${DEFAULT_LOCALE}`,
      },
    },

    openGraph: {
      type: "website",
      locale: content.meta.ogLocale,
      alternateLocale: lang === "pt" ? "en_US" : "pt_BR",
      url: `${base}/${lang}`,
      siteName: "Vitor Manzotti",
      title: content.meta.title,
      description: content.meta.description,
    },

    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
      // TODO: se você criar um @ no X/Twitter, adicione: creator: "@seu_user"
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    formatDetection: { telephone: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { lang } = await params;

  if (!isLocale(lang)) notFound();

  return children;
}
