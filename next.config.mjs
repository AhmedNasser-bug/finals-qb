/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    resolveAlias: {
      'fs': { browser: './lib/stubs/fs.ts' },
      'fs/promises': { browser: './lib/stubs/fs-promises.ts' },
      'path': { browser: './lib/stubs/path.ts' },
      'net': { browser: './lib/empty.ts' },
      'tls': { browser: './lib/empty.ts' },
      'child_process': { browser: './lib/stubs/child_process.ts' },
      'dns': { browser: './lib/empty.ts' },
      'http': { browser: './lib/empty.ts' },
      'https': { browser: './lib/empty.ts' },
      'stream': { browser: './lib/stubs/stream.ts' },
      'crypto': { browser: './lib/empty.ts' },
      'zlib': { browser: './lib/empty.ts' },
      'os': { browser: './lib/stubs/os.ts' },
      'canvas': { browser: './lib/empty.ts' },
      '@aws-sdk/client-s3': { browser: './lib/empty.ts' },
    }
  }
}

export default nextConfig
