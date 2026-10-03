import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { buildCsp, generateNonce, isAllowedOrigin, securityHeaders } from "@/lib/security";

function request(path = "/pt", headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(`https://portfolio.exemplo.com${path}`, { headers });
}

describe("headers aplicados em toda resposta", () => {
  const response = proxy(request());

  it.each([
    ["content-security-policy", undefined],
    ["strict-transport-security", "max-age=63072000; includeSubDomains; preload"],
    ["x-content-type-options", "nosniff"],
    ["referrer-policy", "strict-origin-when-cross-origin"],
    ["x-frame-options", "DENY"],
    ["cross-origin-opener-policy", "same-origin"],
    ["cross-origin-resource-policy", "same-origin"],
    ["x-permitted-cross-domain-policies", "none"],
    ["x-dns-prefetch-control", "off"],
  ])("define %s", (header, expected) => {
    const value = response.headers.get(header);
    expect(value, `header ${header} ausente`).toBeTruthy();
    if (expected) expect(value).toBe(expected);
  });

  it("desliga câmera, microfone e geolocalização no Permissions-Policy", () => {
    const policy = response.headers.get("permissions-policy") ?? "";

    for (const feature of ["camera", "microphone", "geolocation", "payment", "usb"]) {
      expect(policy, `${feature} deveria estar desligado`).toContain(`${feature}=()`);
    }
  });

  it("aplica os headers também na resposta de /api/contact", () => {
    const apiResponse = proxy(request("/api/contact"));
    expect(apiResponse.headers.get("content-security-policy")).toBeTruthy();
    expect(apiResponse.headers.get("x-content-type-options")).toBe("nosniff");
  });
});

describe("Content-Security-Policy", () => {
  const csp = proxy(request()).headers.get("content-security-policy") ?? "";

  it("tem um nonce no script-src", () => {
    expect(csp).toMatch(/script-src[^;]*'nonce-[A-Za-z0-9+/]+={0,2}'/);
  });

  it("usa um nonce DIFERENTE a cada requisição", () => {
    const extrair = (value: string) => value.match(/'nonce-([^']+)'/)?.[1];

    const a = extrair(proxy(request()).headers.get("content-security-policy") ?? "");
    const b = extrair(proxy(request()).headers.get("content-security-policy") ?? "");

    expect(a).toBeTruthy();
    expect(a).not.toBe(b);
  });

  it("não permite 'unsafe-eval' em script-src", () => {
    const scriptSrc = csp.split(";").find((d) => d.trim().startsWith("script-src")) ?? "";
    expect(scriptSrc).not.toContain("unsafe-eval");
  });

  it("não permite 'unsafe-inline' em script-src", () => {
    const scriptSrc = csp.split(";").find((d) => d.trim().startsWith("script-src")) ?? "";
    expect(scriptSrc).not.toContain("unsafe-inline");
  });

  it("bloqueia enquadramento com frame-ancestors 'none'", () => {
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it.each([
    "default-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
  ])("contém a diretiva %s", (directive) => {
    expect(csp).toContain(directive);
  });

  it("documenta a única exceção: 'unsafe-inline' em style-src", () => {
    const styleSrc = csp.split(";").find((d) => d.trim().startsWith("style-src")) ?? "";
    expect(styleSrc).toContain("'unsafe-inline'");
  });
});

describe("nonce", () => {
  it("tem pelo menos 128 bits de entropia", () => {
    const nonce = generateNonce();
    expect(nonce.length).toBeGreaterThanOrEqual(22);
  });

  it("usa só caracteres que o Next.js consegue ler de volta do header", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateNonce()).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    }
  });

  it("nunca repete", () => {
    const amostras = new Set(Array.from({ length: 500 }, () => generateNonce()));
    expect(amostras.size).toBe(500);
  });

  it("chega ao Next.js pelo header da requisição", () => {
    const csp = buildCsp("abc123==");
    expect(csp).toContain("'nonce-abc123=='");
  });
});

describe("redirecionamento de idioma na raiz", () => {
  it("manda para /pt quando não há Accept-Language", () => {
    const response = proxy(request("/"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/pt");
  });

  it("manda para /en quando o navegador prefere inglês", () => {
    const response = proxy(request("/", { "accept-language": "en-US,en;q=0.9" }));
    expect(response.headers.get("location")).toContain("/en");
  });

  it("manda para /pt quando o navegador prefere português", () => {
    const response = proxy(request("/", { "accept-language": "pt-BR,pt;q=0.9,en;q=0.8" }));
    expect(response.headers.get("location")).toContain("/pt");
  });

  it("respeita o peso q e não apenas a ordem", () => {
    const response = proxy(request("/", { "accept-language": "en;q=0.3,pt;q=0.9" }));
    expect(response.headers.get("location")).toContain("/pt");
  });

  it("cai no padrão com um idioma que não servimos", () => {
    const response = proxy(request("/", { "accept-language": "ja,ko;q=0.8" }));
    expect(response.headers.get("location")).toContain("/pt");
  });

  it("declara Vary: Accept-Language", () => {
    const response = proxy(request("/"));
    expect(response.headers.get("vary")).toBe("Accept-Language");
  });

  it("aplica os headers de segurança também no redirect", () => {
    const response = proxy(request("/"));
    expect(response.headers.get("content-security-policy")).toBeTruthy();
    expect(response.headers.get("strict-transport-security")).toBeTruthy();
  });

  it("não redireciona quem já está em /pt ou /en", () => {
    for (const path of ["/pt", "/en"]) {
      expect(proxy(request(path)).status).not.toBe(307);
    }
  });
});

describe("isAllowedOrigin", () => {
  it("recusa quando o Origin está ausente", () => {
    expect(isAllowedOrigin(null, "exemplo.com")).toBe(false);
  });

  it("recusa Origin malformado", () => {
    expect(isAllowedOrigin("nao-e-url", "exemplo.com")).toBe(false);
  });

  it("aceita quando Origin e Host batem", () => {
    expect(isAllowedOrigin("https://exemplo.com", "exemplo.com")).toBe(true);
  });

  it("recusa domínio diferente", () => {
    expect(isAllowedOrigin("https://atacante.net", "exemplo.com")).toBe(false);
  });

  it("recusa subdomínio de atacante que começa com o host", () => {
    expect(isAllowedOrigin("https://exemplo.com.atacante.net", "exemplo.com")).toBe(false);
  });

  it("diferencia a porta", () => {
    expect(isAllowedOrigin("http://localhost:4000", "localhost:3000")).toBe(false);
  });
});

describe("securityHeaders()", () => {
  it("não expõe nenhum header que revele o stack", () => {
    const headers = securityHeaders(generateNonce());
    const keys = Object.keys(headers).map((k) => k.toLowerCase());

    expect(keys).not.toContain("x-powered-by");
    expect(keys).not.toContain("server");
  });
});
