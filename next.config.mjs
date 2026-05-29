const isCI = process.env.CI === "true" || process.env.VERCEL === "1"

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["isomorphic-dompurify"],
  experimental: {
    ...(isCI ? {
      cpus: 1,
      workerThreads: false,
    } : {}),
  },
}

export default nextConfig
