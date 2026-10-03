import type { NextConfig } from "next";

const staticAssetHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  trailingSlash: false,

  typescript: { ignoreBuildErrors: false },

  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: staticAssetHeaders,
      },
      {
        source: "/_next/image/:path*",
        headers: staticAssetHeaders,
      },
    ];
  },
};

export default nextConfig;
