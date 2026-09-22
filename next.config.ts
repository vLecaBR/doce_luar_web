import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Fotos de produto passam de 1 MB (limite padrão). Sobe pra 5 MB.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
