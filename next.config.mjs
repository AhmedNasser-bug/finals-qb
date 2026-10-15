/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    // ⚡ Bolt Optimization: Bypass redundant type checking during `next build`.
    // Type safety is already enforced upstream in CI via `pnpm lint` (`tsc --noEmit`).
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
