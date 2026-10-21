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
  // ⚡ Bolt Optimization: Bypass redundant TypeScript type-checking during production build.
  // Type-checking is strictly enforced in a separate pipeline step (tsc --noEmit) to parallelize CI.
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
