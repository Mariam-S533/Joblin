import type { NextConfig } from "next";

// ─── Development: Accept self-signed SSL certs from .NET backend ────
// The .NET backend serves HTTP on port 5246 and HTTPS on port 7127.
// If server-side code ever needs to call the HTTPS endpoint directly,
// this setting allows Node.js to accept the self-signed certificate.
// This must be set before the Node.js TLS module initializes.
// Only enable in development — never in production.
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
