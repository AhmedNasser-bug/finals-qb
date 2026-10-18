/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // ⚡ Bolt Optimization: Skip redundant TS validation during build
  // since CI enforces type safety via `pnpm lint` (`tsc --noEmit`).
  typescript: {
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
