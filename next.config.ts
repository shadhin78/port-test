import type { NextConfig } from "next";

/**
 * Security headers that are safe for this site. A Content Security Policy is
 * intentionally not set yet: the pre-paint theme script and JSON-LD blocks are
 * inline, so a strict CSP needs nonces and should be added deliberately later.
 * (Vercel adds Strict-Transport-Security automatically on HTTPS deployments.)
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    // Tailwind CSS v4 is processed through this loader (set up by create-next-app).
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
