import type { NextConfig } from "next";
import { SUPABASE_URL } from "./lib/supabase-config";

const nextConfig: NextConfig = {
  images: {
    // Pozele hainelor stau la Supabase; fara randul asta, site-ul refuza sa le afiseze.
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(SUPABASE_URL).hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
