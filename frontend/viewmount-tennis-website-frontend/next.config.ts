import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.2.12"],

  turbopack: {
    root: __dirname,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vjuhoddzvwurvecfaoie.supabase.co",
        pathname: "/storage/v1/object/public/images/**",
      },
    ],
  },
};

export default nextConfig;
