const DEFAULT_TIMEOUT_MS = 8_000;

export class DataApiError extends Error {
  constructor(
    message: string,
    readonly status: number = 0,
  ) {
    super(message);
    this.name = "DataApiError";
  }
}

function baseUrl(): string | null {
  const raw = process.env.DATA_API_BASE_URL?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
      console.error("[api] DATA_API_BASE_URL precisa ser https em produção");
      return null;
    }
    return url.toString().replace(/\/+$/, "");
  } catch {
    console.error("[api] DATA_API_BASE_URL não é uma URL válida");
    return null;
  }
}

export function isDataApiConfigured(): boolean {
  return baseUrl() !== null;
}

export async function fetchJson<T>(
  path: string,
  options: { revalidate?: number; signal?: AbortSignal } = {},
): Promise<T> {
  const base = baseUrl();
  if (!base) {
    throw new DataApiError("DATA_API_BASE_URL não configurada");
  }

  if (!path.startsWith("/")) {
    throw new DataApiError("path precisa começar com /");
  }

  const headers: Record<string, string> = { Accept: "application/json" };

  const token = process.env.DATA_API_TOKEN?.trim();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const timeout = AbortSignal.timeout(DEFAULT_TIMEOUT_MS);
  const signal = options.signal
    ? AbortSignal.any([options.signal, timeout])
    : timeout;

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      headers,
      signal,
      next: options.revalidate !== undefined ? { revalidate: options.revalidate } : undefined,
    });
  } catch {
    throw new DataApiError("falha de rede ao chamar a API de dados");
  }

  if (!response.ok) {
    console.error(`[api] ${path} respondeu ${response.status}`);
    throw new DataApiError("a API de dados respondeu com erro", response.status);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new DataApiError("a API de dados devolveu um JSON inválido");
  }
}
