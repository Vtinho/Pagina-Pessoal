import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getContent } from "@/content";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const raw = requestHeaders.get("x-locale") ?? DEFAULT_LOCALE;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const { meta } = getContent(locale);

  return (
    <html
      lang={meta.htmlLang}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      translate="no"
    >
      <body className="bg-page text-text font-sans antialiased">{children}</body>
    </html>
  );
}
