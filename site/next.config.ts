import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ["amilcar-ai"],
  outputFileTracingIncludes: {
    "/api/chat": ["./node_modules/amilcar-ai/models/ami-base.amw"]
  }
};

export default nextConfig;
