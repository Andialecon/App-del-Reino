import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

/** Dev y build usan carpetas distintas para evitar conflictos (OneDrive / MODULE_NOT_FOUND). */
const isDevServer = process.argv.some(
  (arg) => arg === "dev" || arg.includes("next-dev")
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: isDevServer ? ".next-dev" : ".next",
};

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

export default isDevServer ? nextConfig : withSerwist(nextConfig);
