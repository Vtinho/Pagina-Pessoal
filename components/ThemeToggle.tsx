"use client";

import { useEffect, useState, type MouseEvent } from "react";
import type { UiContent } from "@/content/types";

type Theme = "dark" | "light";

// Mesma chave e mesmas cores lidas pelo script de boot em app/layout.tsx.
const STORAGE_KEY = "theme";
const THEME_COLOR: Record<Theme, string> = { dark: "#0a0a0a", light: "#faf9f6" };

// Nem todo lib.dom tem startViewTransition; daqui sai o tipo sem `any`.
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

function stored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // modo privado pode recusar o acesso
  }
}

function apply(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
}

export function ThemeToggle({
  labels,
  className = "",
}: {
  labels: UiContent["theme"];
  className?: string;
}) {
  // Só o texto depende deste estado. O ícone é CSS em cima do data-theme,
  // senão o snapshot da View Transition congela o ícone no tema anterior.
  const [theme, setTheme] = useState<Theme>("dark");

  // Sem JavaScript o botão não faria nada, então ele nasce `hidden`.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    setReady(true);

    const system = window.matchMedia("(prefers-color-scheme: light)");

    const follow = () => {
      if (stored()) return;
      const next: Theme = system.matches ? "light" : "dark";
      apply(next);
      setTheme(next);
    };

    system.addEventListener("change", follow);
    return () => system.removeEventListener("change", follow);
  }, []);

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === "dark" ? "light" : "dark";

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}

    const commit = () => {
      apply(next);
      setTheme(next);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      commit();
      return;
    }

    const root = document.documentElement;
    const start = (document as ViewTransitionDocument).startViewTransition;

    if (!start) {
      root.dataset.themeSwitching = "";
      commit();
      window.setTimeout(() => {
        delete root.dataset.themeSwitching;
      }, 320);
      return;
    }

    const box = event.currentTarget.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;

    root.style.setProperty("--wipe-x", `${x}px`);
    root.style.setProperty("--wipe-y", `${y}px`);
    root.style.setProperty(
      "--wipe-r",
      `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`,
    );

    start.call(document, commit);
  }

  // O aria-label precisa conter a palavra visível (WCAG 2.5.3).
  const target = labels[theme === "dark" ? "light" : "dark"];

  return (
    <button
      type="button"
      onClick={toggle}
      hidden={!ready}
      aria-label={target.action}
      aria-pressed={theme === "light"}
      title={target.action}
      className={`inline-flex items-center gap-2 rounded px-1.5 py-2 font-mono text-xs lowercase text-muted transition-colors hover:text-accent ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="theme-icon"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      >
        <path d="m12 2 8.66 5v10L12 22l-8.66-5V7Z" />
        <path className="theme-icon__half" d="M12 6v12l5.2-3V9Z" fill="currentColor" stroke="none" />
      </svg>

      <span>{target.label}</span>
    </button>
  );
}
