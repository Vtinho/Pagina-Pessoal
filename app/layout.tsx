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

// Roda antes da primeira pintura, senão a página aparece no tema errado e
// pisca. Precisa do nonce: a CSP não tem 'unsafe-inline' em script-src.
const THEME_BOOTSTRAP = `try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t==="light"?"#e6e0d5":"#0a0a0a"}catch(e){}`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const raw = requestHeaders.get("x-locale") ?? DEFAULT_LOCALE;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const { meta } = getContent(locale);

  const nonce = requestHeaders.get("x-nonce") ?? undefined;

  return (
    <html
      lang={meta.htmlLang}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      translate="no"
      // O script acima mexe no data-theme antes da hidratação.
      suppressHydrationWarning
    >
      <body className="bg-page text-text font-sans antialiased">
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        {children}
      </body>
    </html>
  );
}
