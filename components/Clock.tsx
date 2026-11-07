"use client";

import { useEffect, useState } from "react";

const TIME_ZONE = "America/Sao_Paulo";

// Renderiza vazio no servidor de propósito: a hora do servidor não é a hora
// de quem lê, e qualquer valor no HTML viraria divergência de hidratação.
export function Clock({ note, locale }: { note: string; locale: string }) {
  const [now, setNow] = useState<{ time: string; date: string } | null>(null);

  useEffect(() => {
    const time = new Intl.DateTimeFormat(locale, {
      timeZone: TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const date = new Intl.DateTimeFormat(locale, {
      timeZone: TIME_ZONE,
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

    const tick = () => {
      const stamp = new Date();
      setNow({ time: time.format(stamp), date: date.format(stamp) });
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [locale]);

  return (
    <div>
      <p className="font-mono text-2xl tabular-nums tracking-tight text-text">
        {now?.time ?? "--:--:--"}
      </p>

      <p className="mt-1 font-mono text-[11px] text-muted">
        {now?.date ? `${now.date} · ${note}` : note}
      </p>
    </div>
  );
}
