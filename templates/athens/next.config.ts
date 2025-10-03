import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.stage.etailify.org", "cdn.staging.etailify.io"],
  },
  output: "standalone",
};

export default nextConfig;
