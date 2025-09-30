import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.stage.etailify.org"],
  },
  output: "standalone",
};

export default nextConfig;
