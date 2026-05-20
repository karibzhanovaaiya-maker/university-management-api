/** @type {import('next').NextConfig} */

// In production, nginx routes /api, /auth, /swagger-ui directly to the Java API,
// so these rewrites never fire there. They make the app self-sufficient when run
// standalone (e.g. local dev): /api + /auth are proxied to the backend.
const BACKEND = process.env.BACKEND_ORIGIN || "http://127.0.0.1:8080";

const nextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND}/api/:path*` },
      { source: "/auth/:path*", destination: `${BACKEND}/auth/:path*` },
    ];
  },
};

export default nextConfig;
