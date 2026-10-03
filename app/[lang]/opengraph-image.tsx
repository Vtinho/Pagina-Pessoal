import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 }; // tamanho padrão do Open Graph
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export function generateImageMetadata({ params }: { params: { lang: string } }) {
  const locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;

  return [
    {
      id: "og",
      size,
      contentType,
      alt: getContent(locale).meta.ogImageAlt,
    },
  ];
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;
  const content = getContent(locale);

  const PAGE = "#0a0a0a";
  const ACCENT = "#f5d76e";
  const TEXT = "#ededed";
  const MUTED = "#a3a3a3";
  const LINE = "#262626";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: PAGE,
          padding: 72,
          backgroundImage: `linear-gradient(to right, ${LINE} 1px, transparent 1px), linear-gradient(to bottom, ${LINE} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: ACCENT, fontSize: 30 }}>&gt;</span>
          <span style={{ color: MUTED, fontSize: 28 }}>
            {content.hero.typedCommands[0] ?? "vitor.analyze(data)"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: TEXT, fontSize: 82, fontWeight: 700, lineHeight: 1.05 }}>
            {content.hero.name}
          </div>

          <div style={{ color: ACCENT, fontSize: 34, marginTop: 18 }}>
            {content.hero.role}
          </div>

          <div
            style={{
              color: MUTED,
              fontSize: 26,
              marginTop: 26,
              maxWidth: 900,
              lineHeight: 1.45,
            }}
          >
            {content.hero.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            borderTop: `1px solid ${LINE}`,
            paddingTop: 26,
          }}
        >
          <span style={{ color: MUTED, fontSize: 22 }}>github.com/Vtinho</span>
          <span style={{ color: LINE, fontSize: 22 }}>|</span>
          <span style={{ color: MUTED, fontSize: 22 }}>{locale.toUpperCase()}</span>
        </div>
      </div>
    ),
    size,
  );
}
