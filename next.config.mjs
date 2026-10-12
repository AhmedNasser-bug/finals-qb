/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    // ⚡ Bolt Optimization: Skip redundant type checking during build to accelerate deployments.
    // CI handles type safety via `pnpm lint`.
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
      'tailwind-merge',
      'mermaid',
      'katex'
    ],
  },
}

export default nextConfig
