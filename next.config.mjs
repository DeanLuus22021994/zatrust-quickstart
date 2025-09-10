import bundleAnalyzer from "@next/bundle-analyzer";

/**
 * Extended Next.js config with conditional bundle analyzer for performance insights.
 */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default withBundleAnalyzer(nextConfig);
