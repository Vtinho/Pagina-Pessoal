"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

const COPY = {
  pt: {
    label: "erro",
    title: "Algo quebrou por aqui",
    body: "Não foi culpa sua. O problema foi registrado e eu vou dar uma olhada.",
    retry: "Tentar de novo",
    home: "Voltar ao início",
  },
  en: {
    label: "error",
    title: "Something broke on my side",
    body: "This was not your fault. The problem has been logged and I will look into it.",
    retry: "Try again",
    home: "Back to home",
  },
} as const;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ lang?: string }>();
  const copy = params?.lang === "en" ? COPY.en : COPY.pt;

  useEffect(() => {
    console.error("[render] falha na página", error.digest ?? "sem digest");
  }, [error]);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-sm text-accent">{copy.label}</p>

      <h1 className="mt-4 text-2xl font-bold text-text sm:text-3xl">{copy.title}</h1>

      <p className="mt-3 max-w-md text-sm text-muted">{copy.body}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-semibold text-page transition-opacity hover:opacity-90"
        >
          {copy.retry}
        </button>

        <a
          href={`/${params?.lang === "en" ? "en" : "pt"}`}
          className="rounded-md border border-line px-5 py-2.5 font-mono text-sm text-text transition-colors hover:border-accent hover:text-accent"
        >
          {copy.home}
        </a>
      </div>
    </main>
  );
}
