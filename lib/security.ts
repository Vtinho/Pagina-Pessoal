const isDev = process.env.NODE_ENV === "development";

// Precisa ser novo a cada resposta e vir de CSPRNG. Nonce previsível ou
// reaproveitado não protege nada: vira uma allowlist fixa.
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

function connectSources(): string[] {
  const sources = ["'self'"];

  // TODO: só terá efeito quando você definir DATA_API_BASE_URL no .env.
  const dataApi = process.env.DATA_API_BASE_URL?.trim();
  if (dataApi) {
    try {
      sources.push(new URL(dataApi).origin);
    } catch {}
  }

  if (isDev) {
    sources.push("ws:", "wss:");
  }

  return sources;
}

export function buildCsp(nonce: string): string {
  const directives: string[] = [
    "default-src 'self'",

    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,

    // Única exceção da política: o Next injeta <style> inline sem nonce.
    // Remover 'unsafe-inline' aqui quebra o estilo em silêncio.
    // script-src continua sem unsafe-inline e sem unsafe-eval.
    "style-src 'self' 'unsafe-inline'",

    "font-src 'self'",

    "img-src 'self' data:",

    "object-src 'none'",

    "base-uri 'none'",

    "form-action 'self'",

    "frame-ancestors 'none'",

    "frame-src 'none'",
    "child-src 'none'",

    "media-src 'none'",

    "worker-src 'self'",

    "manifest-src 'self'",

    `connect-src ${connectSources().join(" ")}`,
  ];

  if (!isDev) {
    directives.push("upgrade-insecure-requests");
  }

  // TODO (opcional): para receber relatório de violação de CSP, adicione a
  // diretiva report-to e o header Reporting-Endpoints.

  return directives.join("; ");
}

const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "ambient-light-sensor=()",
  "autoplay=()",
  "battery=()",
  "bluetooth=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "gamepad=()",
  "geolocation=()",
  "gyroscope=()",
  "hid=()",
  "idle-detection=()",
  "local-fonts=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "picture-in-picture=()",
  "publickey-credentials-get=()",
  "screen-wake-lock=()",
  "serial=()",
  "usb=()",
  "xr-spatial-tracking=()",
  "fullscreen=(self)",
].join(", ");

export function securityHeaders(nonce: string): Record<string, string> {
  return {
    "Content-Security-Policy": buildCsp(nonce),

    // ATENÇÃO: só submeta ao preload quando tiver certeza de que TODO o
    // domínio e TODOS os subdomínios funcionam em HTTPS. Sair da lista de
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",

    "X-Content-Type-Options": "nosniff",

    "Referrer-Policy": "strict-origin-when-cross-origin",

    "Permissions-Policy": PERMISSIONS_POLICY,

    "X-Frame-Options": "DENY",

    "Cross-Origin-Opener-Policy": "same-origin",

    "Cross-Origin-Resource-Policy": "same-origin",

    "X-Permitted-Cross-Domain-Policies": "none",

    "X-DNS-Prefetch-Control": "off",
  };
}

export function allowedOrigins(): string[] {
  const origins = new Set<string>();

  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (site) {
    try {
      origins.add(new URL(site).origin);
    } catch {}
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) origins.add(`https://${vercelUrl}`);

  const extra = process.env.ALLOWED_ORIGINS?.trim();
  if (extra) {
    for (const candidate of extra.split(",")) {
      const value = candidate.trim();
      if (!value) continue;
      try {
        origins.add(new URL(value).origin);
      } catch {}
    }
  }

  if (isDev) {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }

  return [...origins];
}

export function isAllowedOrigin(origin: string | null, host: string | null): boolean {
  if (!origin) return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false; // Origin malformado.
  }

  const configured = allowedOrigins();
  if (configured.length > 0) {
    const matchesConfigured = configured.some((allowed) => {
      try {
        return new URL(allowed).host === originHost;
      } catch {
        return false;
      }
    });
    if (matchesConfigured) return true;
  }

  return host !== null && originHost === host;
}
