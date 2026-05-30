const isCI = process.env.CI === "true" || process.env.VERCEL === "1"
const maxCPUs = isCI ? 1 : 2
const useWorkerThreads = !isCI

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["isomorphic-dompurify"],
  experimental: {
    cpus: maxCPUs,
    workerThreads: useWorkerThreads,
  },
}

export default nextConfig
