import { NextResponse } from "next/server";
import {
  contactSchema,
  invalidFields,
  HONEYPOT_FIELD,
  MAX_BODY_BYTES,
  type ContactField,
} from "@/lib/contact-schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isAllowedOrigin } from "@/lib/security";
import { deliverContactMessage } from "@/lib/contact-delivery";

type ErrorCode =
  | "BAD_REQUEST" // corpo ilegível ou ausente
  | "UNSUPPORTED_MEDIA_TYPE" // Content-Type errado
  | "FORBIDDEN_ORIGIN" // Origin não autorizado
  | "PAYLOAD_TOO_LARGE" // corpo acima do teto
  | "VALIDATION" // campo inválido (acompanha a lista de campos)
  | "RATE_LIMITED" // excedeu o limite por IP
  | "METHOD_NOT_ALLOWED"
  | "SERVER_ERROR";

interface ErrorBody {
  ok: false;
  error: ErrorCode;
  fields?: ContactField[];
}

const NO_STORE = { "Cache-Control": "no-store" } as const;

function fail(
  status: number,
  error: ErrorCode,
  extra?: { fields?: ContactField[]; headers?: Record<string, string> },
): NextResponse<ErrorBody> {
  const body: ErrorBody = { ok: false, error };
  if (extra?.fields?.length) body.fields = extra.fields;

  return NextResponse.json(body, {
    status,
    headers: { ...NO_STORE, ...extra?.headers },
  });
}

// A ordem das checagens é proposital, do mais barato ao mais caro:
// Content-Type -> Origin -> rate limit -> tamanho -> JSON.parse -> Zod.
// O rate limit vem ANTES do parse para quem inunda a rota não custar CPU.
// Nenhuma resposta de erro inclui stack trace, caminho ou mensagem do Zod.
export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.split(";")[0]?.trim().toLowerCase() !== "application/json") {
    return fail(415, "UNSUPPORTED_MEDIA_TYPE");
  }

  if (!isAllowedOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return fail(403, "FORBIDDEN_ORIGIN");
  }

  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(ip);

  if (!limit.allowed) {
    return fail(429, "RATE_LIMITED", {
      headers: {
        "Retry-After": String(limit.retryAfterSeconds),
        "X-RateLimit-Limit": String(limit.limit),
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return fail(413, "PAYLOAD_TOO_LARGE");
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail(400, "BAD_REQUEST");
  }

  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return fail(413, "PAYLOAD_TOO_LARGE");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return fail(400, "BAD_REQUEST");
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return fail(400, "BAD_REQUEST");
  }

  const result = contactSchema.safeParse(parsed);
  if (!result.success) {
    return fail(422, "VALIDATION", { fields: invalidFields(result.error) });
  }

  const payload = result.data;

  // Responde 200 fingindo sucesso para o bot não aprender que foi pego.
  // Por isso a entrega vive em lib/contact-delivery.ts: e o que permite o
  // teste afirmar "respondeu 200 E não entregou".
  const honeypotValue = payload[HONEYPOT_FIELD];
  if (typeof honeypotValue === "string" && honeypotValue.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200, headers: NO_STORE });
  }

  try {
    const { delivered } = await deliverContactMessage(payload);
    if (!delivered) return fail(502, "SERVER_ERROR");
  } catch {
    return fail(500, "SERVER_ERROR");
  }

  return NextResponse.json(
    { ok: true },
    {
      status: 200,
      headers: {
        ...NO_STORE,
        "X-RateLimit-Limit": String(limit.limit),
        "X-RateLimit-Remaining": String(limit.remaining),
      },
    },
  );
}

function methodNotAllowed(): NextResponse<ErrorBody> {
  return NextResponse.json(
    { ok: false, error: "METHOD_NOT_ALLOWED" },
    { status: 405, headers: { ...NO_STORE, Allow: "POST" } },
  );
}

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const HEAD = methodNotAllowed;

export const runtime = "nodejs";

export const dynamic = "force-dynamic";
