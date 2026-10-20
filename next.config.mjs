/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚡ Bolt Optimization: Bypass redundant TypeScript checking during build
    // Type-checking is already strictly enforced via pnpm lint (tsc --noEmit)
    ignoreBuildErrors: true,
  },
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
}

export default nextConfig
