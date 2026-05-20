/** @type {import('next').NextConfig} */

// Production: STATIC_EXPORT=1 -> emits plain static files to ./out, served directly
// by nginx (no Node process, no extra port). Same-origin in prod: nginx routes
// /api + /auth to the Java backend, so there is never any CORS.
//
// Local dev (no STATIC_EXPORT): a dev server with rewrites that proxy /api + /auth
// to the backend, so `next dev` works standalone too.
const isExport = process.env.STATIC_EXPORT === "1";
const BACKEND = process.env.BACKEND_ORIGIN || "http://127.0.0.1:8080";

const nextConfig = {
  output: isExport ? "export" : undefined,
  images: { unoptimized: true },
  ...(isExport
    ? {}
    : {
        async rewrites() {
          return [
            { source: "/api/:path*", destination: `${BACKEND}/api/:path*` },
            { source: "/auth/:path*", destination: `${BACKEND}/auth/:path*` },
          ];
        },
      }),
};

export default nextConfig;
