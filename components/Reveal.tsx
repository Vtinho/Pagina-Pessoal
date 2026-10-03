"use client";

import { useEffect, useRef, type ReactNode } from "react";

// O HTML do servidor sai SEM o atributo data-visible, e nesse estado o CSS
// mostra o conteudo normalmente. Quem esconde e o JavaScript, logo antes de
// animar. Assim, se o JS nao rodar - extensao bloqueando, erro, rede ruim,
// crawler sem JS - a pagina aparece inteira em vez de ficar em branco.
//
// A versao anterior fazia o contrario (CSS escondia por padrao) e bastava o JS
// falhar para o site inteiro sumir, deixando so o hero.
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Navegador sem IntersectionObserver: deixa visivel, sem animacao.
    if (typeof IntersectionObserver === "undefined") return;

    // Se o bloco ja esta na tela no primeiro render, nao ha o que revelar:
    // esconder agora para animar causaria um piscado. Fica visivel e pronto.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    // Abaixo da dobra: agora sim esconde, para animar quando entrar na tela.
    element.dataset.visible = "false";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          element.dataset.visible = "true";
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -64px 0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
