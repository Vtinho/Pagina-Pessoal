import Link from "next/link";
import { headers } from "next/headers";
import { getContent } from "@/content";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export default async function NotFound() {
  const requestHeaders = await headers();
  const raw = requestHeaders.get("x-locale") ?? DEFAULT_LOCALE;
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const content = getContent(locale);

  const copy =
    locale === "pt"
      ? {
          title: "Página não encontrada",
          body: "O endereço que você abriu não existe neste site.",
          back: "Voltar para o início",
        }
      : {
          title: "Page not found",
          body: "The address you opened does not exist on this site.",
          back: "Back to home",
        };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-sm text-accent">404</p>

      <h1 className="mt-4 text-2xl font-bold text-text sm:text-3xl">{copy.title}</h1>

      <p className="mt-3 max-w-md text-sm text-muted">{copy.body}</p>

      <Link
        href={`/${locale}`}
        className="mt-8 rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-semibold text-page transition-opacity hover:opacity-90"
      >
        {copy.back}
      </Link>

      <a
        href="/.well-known/security.txt"
        className="mt-6 font-mono text-xs text-line-strong transition-colors hover:text-muted"
      >
        {content.footer.securityTxtLabel}
      </a>
    </main>
  );
}
