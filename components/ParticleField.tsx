"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const ACCENT = "#f5d76e";

export function ParticleField() {
  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 768px)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const sync = () => {
      setEnabled(!reducedMotion.matches);
      setIsMobile(mobile.matches || coarsePointer.matches);
    };

    sync();

    reducedMotion.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    coarsePointer.addEventListener("change", sync);

    return () => {
      reducedMotion.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
      coarsePointer.removeEventListener("change", sync);
    };
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: { color: "transparent" },

      pauseOnBlur: true,
      pauseOnOutsideViewport: true,

      fpsLimit: 45,

      detectRetina: true,

      interactivity: {
        detectsOn: "window",
        events: {
          onHover: {
            enable: !isMobile,
            mode: "grab",
            parallax: { enable: false },
          },
          onClick: {
            enable: !isMobile,
            mode: "repulse",
          },
          resize: { enable: true },
        },
        modes: {
          grab: {
            distance: 160,
            links: { opacity: 0.55, color: ACCENT },
          },
          repulse: {
            distance: 120,
            duration: 0.4,
          },
        },
      },

      particles: {
        color: { value: ACCENT },

        links: {
          enable: true,
          color: ACCENT,
          distance: 140,
          opacity: 0.18,
          width: 1,
        },

        move: {
          enable: true,
          speed: 0.45,
          direction: "none",
          random: false,
          straight: false,
          outModes: { default: "out" },
        },

        number: {
          value: isMobile ? 26 : 70,
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
        },

        opacity: {
          value: { min: 0.15, max: 0.45 },
          animation: { enable: true, speed: 0.4, sync: false },
        },

        size: { value: { min: 1, max: 2.4 } },
      },
    }),
    [isMobile],
  );

  // prefers-reduced-motion ativo: não montamos o canvas. Apenas pausar a
  // animação seria cumprir a regra pela metade: o engine continuaria vivo.
  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 no-print"
      aria-hidden="true"
    >
      {/* loadSlim vai DIRETO, sem arrow function: a v4 compara a identidade
          da função entre renders e lança erro se ela mudar. */}
      <ParticlesProvider init={loadSlim}>
        <Particles id="tsparticles" options={options} className="h-full w-full" />
      </ParticlesProvider>
    </div>
  );
}
