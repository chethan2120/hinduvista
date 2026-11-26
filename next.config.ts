import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "/**": ["./prisma/dev.db"],
  },
};

export default nextConfig;
