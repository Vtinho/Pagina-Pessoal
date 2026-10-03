import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/contact-delivery", () => ({
  deliverContactMessage: vi.fn(async () => ({ delivered: true })),
}));

import { POST, GET, PUT, DELETE, PATCH } from "@/app/api/contact/route";
import { deliverContactMessage } from "@/lib/contact-delivery";
import { resetRateLimit, RATE_LIMIT_MAX } from "@/lib/rate-limit";
import { LIMITS } from "@/lib/contact-schema";

const deliverMock = vi.mocked(deliverContactMessage);

const VALID = {
  name: "Ana Souza",
  email: "ana@exemplo.com",
  message: "Olá Vitor, vi seu portfólio e queria conversar sobre uma vaga.",
};

function makeRequest(options: {
  body?: unknown;
  rawBody?: string;
  contentType?: string | null;
  origin?: string | null;
  host?: string;
  ip?: string;
} = {}): Request {
  const {
    body = VALID,
    rawBody,
    contentType = "application/json",
    origin = "https://portfolio.exemplo.com",
    host = "portfolio.exemplo.com",
    ip = "203.0.113.1",
  } = options;

  const headers = new Headers();
  if (contentType !== null) headers.set("content-type", contentType);
  if (origin !== null) headers.set("origin", origin);
  headers.set("host", host);
  headers.set("x-forwarded-for", ip);

  return new Request("https://portfolio.exemplo.com/api/contact", {
    method: "POST",
    headers,
    body: rawBody ?? JSON.stringify(body),
  });
}

beforeEach(() => {
  resetRateLimit();
  deliverMock.mockClear();
});

afterEach(() => {
  resetRateLimit();
});

describe("caminho feliz", () => {
  it("aceita um payload válido e entrega a mensagem", async () => {
    const response = await POST(makeRequest({ ip: "203.0.113.10" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(deliverMock).toHaveBeenCalledTimes(1);
  });

  it("aplica trim nos campos antes de entregar", async () => {
    await POST(
      makeRequest({
        ip: "203.0.113.11",
        body: {
          name: "   Ana Souza   ",
          email: "  ana@exemplo.com  ",
          message: `   ${VALID.message}   `,
        },
      }),
    );

    const [payload] = deliverMock.mock.calls[0] ?? [];
    expect(payload?.name).toBe("Ana Souza");
    expect(payload?.email).toBe("ana@exemplo.com");
  });

  it("nunca guarda a resposta em cache", async () => {
    const response = await POST(makeRequest({ ip: "203.0.113.12" }));
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});

describe("validação dos campos", () => {
  it("recusa quando falta um campo obrigatório", async () => {
    const response = await POST(
      makeRequest({ ip: "203.0.113.20", body: { name: "Ana", email: "ana@exemplo.com" } }),
    );

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.error).toBe("VALIDATION");
    expect(body.fields).toContain("message");
    expect(deliverMock).not.toHaveBeenCalled();
  });

  it("recusa e-mail com formato inválido", async () => {
    const response = await POST(
      makeRequest({ ip: "203.0.113.21", body: { ...VALID, email: "nao-e-um-email" } }),
    );

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.fields).toEqual(["email"]);
  });

  it("recusa campo acima do tamanho máximo", async () => {
    const response = await POST(
      makeRequest({
        ip: "203.0.113.22",
        body: { ...VALID, name: "a".repeat(LIMITS.name.max + 1) },
      }),
    );

    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.fields).toEqual(["name"]);
  });

  it("recusa campo abaixo do tamanho mínimo", async () => {
    const response = await POST(
      makeRequest({ ip: "203.0.113.23", body: { ...VALID, message: "oi" } }),
    );

    expect(response.status).toBe(422);
    expect((await response.json()).fields).toEqual(["message"]);
  });

  it("recusa uma mensagem que é só espaço em branco", async () => {
    const response = await POST(
      makeRequest({ ip: "203.0.113.24", body: { ...VALID, message: " ".repeat(40) } }),
    );

    expect(response.status).toBe(422);
  });

  it("recusa campo desconhecido no payload (strictObject)", async () => {
    const response = await POST(
      makeRequest({ ip: "203.0.113.25", body: { ...VALID, isAdmin: true } }),
    );

    expect(response.status).toBe(422);
    expect(await response.text()).not.toContain("isAdmin");
  });

  it("recusa payload gigante antes de processar", async () => {
    const response = await POST(
      makeRequest({
        ip: "203.0.113.26",
        body: { ...VALID, message: "a".repeat(50_000) },
      }),
    );

    expect(response.status).toBe(413);
    expect((await response.json()).error).toBe("PAYLOAD_TOO_LARGE");
    expect(deliverMock).not.toHaveBeenCalled();
  });

  it("recusa JSON malformado sem vazar detalhe do erro", async () => {
    const response = await POST(
      makeRequest({ ip: "203.0.113.27", rawBody: "{ isso nao e json" }),
    );

    expect(response.status).toBe(400);

    const text = await response.text();
    expect(JSON.parse(text)).toEqual({ ok: false, error: "BAD_REQUEST" });
    expect(text.toLowerCase()).not.toContain("unexpected");
    expect(text.toLowerCase()).not.toContain("position");
  });

  it("recusa JSON válido que não é objeto", async () => {
    for (const rawBody of ["[]", '"texto"', "42", "null"]) {
      const response = await POST(makeRequest({ ip: "203.0.113.28", rawBody }));
      expect(response.status).toBe(400);
    }
  });
});

describe("XSS e injeção de HTML", () => {
  const payloads = [
    "<script>alert(1)</script>",
    '<img src=x onerror="alert(1)">',
    "<svg/onload=alert(1)>",
    "javascript:alert(1)",
    "'; DROP TABLE users; --",
    "{{7*7}}",
    "${jndi:ldap://exemplo.com/a}",
  ];

  it.each(payloads)("aceita %s como texto e não o executa", async (payload) => {
    const response = await POST(
      makeRequest({
        ip: `198.51.100.${payloads.indexOf(payload) + 1}`,
        body: { ...VALID, message: `Olá, teste de payload: ${payload}` },
      }),
    );

    expect(response.status).toBe(200);

    const [delivered] = deliverMock.mock.calls[0] ?? [];
    expect(delivered?.message).toContain(payload);
  });

  it("escapa HTML ao montar o corpo do e-mail", async () => {
    const { buildEmailHtml } = await vi.importActual<
      typeof import("@/lib/contact-delivery")
    >("@/lib/contact-delivery");

    const html = buildEmailHtml({
      name: "<script>alert(1)</script>",
      email: "ana@exemplo.com",
      message: '<img src=x onerror="alert(1)">',
    });

    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;img");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("onerror=\"alert");
  });

  it("recusa quebra de linha no nome (injeção de cabeçalho de e-mail)", async () => {
    const response = await POST(
      makeRequest({
        ip: "198.51.100.50",
        body: { ...VALID, name: "Ana\r\nBcc: vitima@exemplo.com" },
      }),
    );

    expect(response.status).toBe(422);
    expect((await response.json()).fields).toEqual(["name"]);
  });

  it("recusa caracteres de controle nos campos", async () => {
    const controles = [
      ["NUL", "\0"],
      ["ESC", String.fromCharCode(27)],
      ["CR", "\r"],
    ] as const;

    for (const [index, [nome, caractere]] of controles.entries()) {
      const response = await POST(
        makeRequest({
          ip: `198.51.100.${51 + index}`,
          body: { ...VALID, name: `Ana${caractere}Souza` },
        }),
      );

      expect(response.status, `${nome} deveria ser recusado em name`).toBe(422);
    }
  });

  it("aceita quebra de linha DENTRO da mensagem", async () => {
    const response = await POST(
      makeRequest({
        ip: "198.51.100.58",
        body: { ...VALID, message: "Olá Vitor,\n\nVi seu portfólio.\n\nAbraço,\nAna" },
      }),
    );

    expect(response.status).toBe(200);
  });
});

describe("honeypot", () => {
  it("responde 200 mas NÃO entrega quando o honeypot vem preenchido", async () => {
    const response = await POST(
      makeRequest({
        ip: "198.51.100.60",
        body: { ...VALID, website: "http://spam.exemplo.com" },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });

    expect(deliverMock).not.toHaveBeenCalled();
  });

  it("entrega normalmente quando o honeypot vem vazio", async () => {
    const response = await POST(
      makeRequest({ ip: "198.51.100.61", body: { ...VALID, website: "" } }),
    );

    expect(response.status).toBe(200);
    expect(deliverMock).toHaveBeenCalledTimes(1);
  });
});

describe("método e Content-Type", () => {
  it.each([
    ["GET", GET],
    ["PUT", PUT],
    ["DELETE", DELETE],
    ["PATCH", PATCH],
  ])("responde 405 para %s", async (_method, handler) => {
    const response = handler();

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("POST");
  });

  it("recusa Content-Type que não seja application/json", async () => {
    for (const contentType of [
      "text/plain",
      "application/x-www-form-urlencoded",
      "multipart/form-data",
    ]) {
      const response = await POST(makeRequest({ ip: "198.51.100.70", contentType }));
      expect(response.status).toBe(415);
    }
  });

  it("recusa requisição sem Content-Type", async () => {
    const response = await POST(makeRequest({ ip: "198.51.100.71", contentType: null }));
    expect(response.status).toBe(415);
  });

  it("aceita application/json com charset", async () => {
    const response = await POST(
      makeRequest({ ip: "198.51.100.72", contentType: "application/json; charset=utf-8" }),
    );
    expect(response.status).toBe(200);
  });
});

describe("Origin (anti-CSRF)", () => {
  it("recusa Origin de outro domínio", async () => {
    const response = await POST(
      makeRequest({ ip: "198.51.100.80", origin: "https://site-malicioso.exemplo" }),
    );

    expect(response.status).toBe(403);
    expect((await response.json()).error).toBe("FORBIDDEN_ORIGIN");
    expect(deliverMock).not.toHaveBeenCalled();
  });

  it("recusa requisição sem header Origin", async () => {
    const response = await POST(makeRequest({ ip: "198.51.100.81", origin: null }));
    expect(response.status).toBe(403);
  });

  it("aceita Origin igual ao Host da requisição", async () => {
    const response = await POST(
      makeRequest({
        ip: "198.51.100.82",
        origin: "https://portfolio.exemplo.com",
        host: "portfolio.exemplo.com",
      }),
    );
    expect(response.status).toBe(200);
  });

  it("recusa Origin que só começa igual ao host (bypass por prefixo)", async () => {
    const response = await POST(
      makeRequest({
        ip: "198.51.100.83",
        origin: "https://portfolio.exemplo.com.atacante.net",
        host: "portfolio.exemplo.com",
      }),
    );
    expect(response.status).toBe(403);
  });
});

describe("rate limit", () => {
  it(`permite ${RATE_LIMIT_MAX} requisições e bloqueia a seguinte`, async () => {
    const ip = "198.51.100.90";

    for (let i = 0; i < RATE_LIMIT_MAX; i++) {
      const response = await POST(makeRequest({ ip }));
      expect(response.status, `requisição ${i + 1} deveria passar`).toBe(200);
    }

    const blocked = await POST(makeRequest({ ip }));
    expect(blocked.status).toBe(429);
    expect((await blocked.json()).error).toBe("RATE_LIMITED");

    expect(deliverMock).toHaveBeenCalledTimes(RATE_LIMIT_MAX);
  });

  it("informa Retry-After quando bloqueia", async () => {
    const ip = "198.51.100.91";
    for (let i = 0; i < RATE_LIMIT_MAX; i++) await POST(makeRequest({ ip }));

    const blocked = await POST(makeRequest({ ip }));
    const retryAfter = Number(blocked.headers.get("retry-after"));

    expect(retryAfter).toBeGreaterThan(0);
    expect(blocked.headers.get("x-ratelimit-remaining")).toBe("0");
  });

  it("conta por IP, não globalmente", async () => {
    const ip = "198.51.100.92";
    for (let i = 0; i <= RATE_LIMIT_MAX; i++) await POST(makeRequest({ ip }));

    const outro = await POST(makeRequest({ ip: "198.51.100.93" }));
    expect(outro.status).toBe(200);
  });

  it("bloqueia ANTES de processar o corpo", async () => {
    const ip = "198.51.100.94";
    for (let i = 0; i < RATE_LIMIT_MAX; i++) await POST(makeRequest({ ip }));

    const response = await POST(makeRequest({ ip, body: { lixo: true } }));
    expect(response.status).toBe(429);
  });
});

describe("vazamento de informação", () => {
  it("nunca inclui stack trace nem caminho de arquivo na resposta", async () => {
    const respostas = await Promise.all([
      POST(makeRequest({ ip: "192.0.2.1", rawBody: "{{{" })),
      POST(makeRequest({ ip: "192.0.2.2", body: { name: 1, email: 2, message: 3 } })),
      POST(makeRequest({ ip: "192.0.2.3", contentType: "text/plain" })),
      POST(makeRequest({ ip: "192.0.2.4", origin: "https://outro.exemplo" })),
    ]);

    for (const response of respostas) {
      const text = await response.text();

      expect(text).not.toMatch(/\bat\s+\w+\s+\(/); // linha de stack trace
      expect(text).not.toMatch(/node_modules/);
      expect(text).not.toMatch(/[A-Za-z]:\\|\/home\/|\/var\//); // caminho absoluto
      expect(text.toLowerCase()).not.toContain("zod");
      expect(text.toLowerCase()).not.toContain("expected");
    }
  });

  it("a resposta de erro só tem as chaves ok, error e fields", async () => {
    const response = await POST(
      makeRequest({ ip: "192.0.2.5", body: { ...VALID, email: "x" } }),
    );

    const body = await response.json();
    expect(Object.keys(body).sort()).toEqual(["error", "fields", "ok"]);
  });
});
