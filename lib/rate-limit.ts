// Rate limit em memória NÃO é confiável em serverless: cada instância tem o
// próprio Map e o contador zera no cold start. É mitigação, não garantia.
// Para migrar ao Upstash Redis, ver a seção 10 do README.
export const RATE_LIMIT_MAX = 5;

export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const MAX_TRACKED_KEYS = 10_000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterSeconds: number;
}

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const previous = hits.get(key) ?? [];
  const recent = previous.filter((timestamp) => timestamp > windowStart);

  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = recent[0] ?? now;
    const retryAfterMs = oldest + RATE_LIMIT_WINDOW_MS - now;

    // A tentativa bloqueada NÃO é registrada de propósito: registrar empurraria
    // a janela para frente a cada retry e bloquearia a pessoa para sempre.
    hits.set(key, recent);

    return {
      allowed: false,
      remaining: 0,
      limit: RATE_LIMIT_MAX,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    pruneOldestKeys(windowStart);
  }

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - recent.length,
    limit: RATE_LIMIT_MAX,
    retryAfterSeconds: 0,
  };
}

function pruneOldestKeys(windowStart: number): void {
  for (const [key, timestamps] of hits) {
    const alive = timestamps.filter((t) => t > windowStart);
    if (alive.length === 0) hits.delete(key);
    else hits.set(key, alive);
  }

  if (hits.size <= MAX_TRACKED_KEYS) return;

  const byAge = [...hits.entries()].sort(
    (a, b) => (a[1][a[1].length - 1] ?? 0) - (b[1][b[1].length - 1] ?? 0),
  );
  for (const [key] of byAge.slice(0, hits.size - MAX_TRACKED_KEYS)) {
    hits.delete(key);
  }
}

export function resetRateLimit(): void {
  hits.clear();
}

// x-forwarded-for pode ser falsificado. Só é confiável porque o proxy da
// Vercel SOBRESCREVE o header. Ao trocar de hospedagem, confirme que o novo
// proxy faz o mesmo — se ele apenas acrescentar, o limite vira contornável.
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}
