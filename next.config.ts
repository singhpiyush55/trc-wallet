import type { NextConfig } from "next";
import dns from "node:dns";

// Configure DNS fallback for Neon Postgres in dev environment
if (process.env.NODE_ENV !== "production") {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      if (url.hostname.endsWith(".neon.tech")) {
        const servers = (process.env.DB_DNS_FALLBACK_SERVERS ?? "8.8.8.8,1.1.1.1")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (servers.length > 0) {
          dns.setServers(servers);
        }
      }
    } catch {
      // DATABASE_URL invalid, skip DNS config
    }
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
