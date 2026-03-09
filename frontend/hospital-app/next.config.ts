import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

// Note: next-pwa caused build-time errors in some environments. To keep the
// app PWA-capable without relying on next-pwa, we register a simple custom
// service worker at /sw.js (in public/) and link the manifest in the app head.
export default nextConfig;
