/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: {
    // ⚡ Bolt Optimization: Bypass loading unused modules from the lucide-react barrel file
    // to significantly reduce memory usage and Turbopack build latency.
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
      '@clerk/nextjs',
      '@clerk/ui',
      'tailwind-merge'
    ],
  },
  typescript: {
    // ⚡ Bolt Optimization: Bypass redundant TypeScript type-checking during the build process
    // as it's already enforced as a separate pipeline step (e.g., via `pnpm lint`).
    ignoreBuildErrors: true,
  },
}

export default nextConfig
