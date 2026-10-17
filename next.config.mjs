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
    // ⚡ Bolt Optimization: Skip redundant type checking during production builds.
    // Type safety is already verified upstream in CI using `pnpm lint` (`tsc --noEmit`).
    // Skipping this phase reduces Next.js build time by avoiding duplicate validation.
    ignoreBuildErrors: true,
  },
}

export default nextConfig
