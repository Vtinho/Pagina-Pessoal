import type { ReactNode } from "react";

export function ExternalLink({
  href,
  children,
  className = "",
  newTabHint,
  label,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  newTabHint: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label ? `${label} (${newTabHint})` : undefined}
    >
      {children}
      {!label && <span className="sr-only"> ({newTabHint})</span>}
    </a>
  );
}
