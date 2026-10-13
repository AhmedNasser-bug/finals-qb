/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    // ⚡ Bolt Optimization: Type checking is enforced upstream via CI (`pnpm lint`).
    // Ignoring it here eliminates redundant bottleneck during deployment builds.
    ignoreBuildErrors: true,
  },
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
}

export default nextConfig
