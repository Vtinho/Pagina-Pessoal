import { NextResponse, type NextRequest } from "next/server";
import { generateNonce, securityHeaders } from "@/lib/security";
import { DEFAULT_LOCALE, LOCALES, pickLocale } from "@/lib/i18n";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const nonce = generateNonce();
  const headers = securityHeaders(nonce);

  // O CSP vai também nos headers da REQUISIÇÃO: é dali que o Next.js lê o
  // nonce para marcar as próprias tags <script>. Sem isso a página carrega
  // sem JavaScript nenhum. O x-locale alimenta a tag <html lang> em
  // app/layout.tsx, que não recebe o parâmetro [lang].
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", headers["Content-Security-Policy"]!);

  const firstSegment = pathname.split("/")[1] ?? "";
  const pathLocale = (LOCALES as readonly string[]).includes(firstSegment)
    ? firstSegment
    : DEFAULT_LOCALE;
  requestHeaders.set("x-locale", pathLocale);

  if (pathname === "/") {
    const locale = pickLocale(request.headers.get("accept-language"));

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;

    const redirect = NextResponse.redirect(url, 307);

    applyHeaders(redirect, headers);
    redirect.headers.set("Vary", "Accept-Language");
    return redirect;
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  applyHeaders(response, headers);
  return response;
}

function applyHeaders(response: NextResponse, headers: Record<string, string>): void {
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
}

// Cada caminho excluído do matcher abaixo passa a ser servido SEM CSP.
// Só exclua asset estático, nunca rota que devolva HTML ou aceite POST.
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
