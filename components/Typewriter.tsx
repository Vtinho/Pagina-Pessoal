"use client";

import { useEffect, useState } from "react";

export function Typewriter({
  lines,
  className = "",
}: {
  lines: string[];
  className?: string;
}) {
  const [text, setText] = useState(lines[0] ?? "");

  useEffect(() => {
    if (lines.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lineIndex = 0;
    let charIndex = lines[0]?.length ?? 0;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const TYPE_MS = 65;
    const DELETE_MS = 30;
    const PAUSE_AFTER_TYPING_MS = 1800;
    const PAUSE_BEFORE_TYPING_MS = 350;

    const tick = () => {
      const current = lines[lineIndex] ?? "";

      if (deleting) {
        charIndex -= 1;
        setText(current.slice(0, charIndex));

        if (charIndex <= 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % lines.length;
          timer = setTimeout(tick, PAUSE_BEFORE_TYPING_MS);
          return;
        }

        timer = setTimeout(tick, DELETE_MS);
        return;
      }

      charIndex += 1;
      setText(current.slice(0, charIndex));

      if (charIndex >= current.length) {
        deleting = true;
        timer = setTimeout(tick, PAUSE_AFTER_TYPING_MS);
        return;
      }

      timer = setTimeout(tick, TYPE_MS);
    };

    timer = setTimeout(tick, PAUSE_AFTER_TYPING_MS);

    return () => clearTimeout(timer);
  }, [lines]);

  return (
    <span aria-hidden="true" className={className}>
      {text}
      <span className="caret" />
    </span>
  );
}
