/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  serverExternalPackages: ["isomorphic-dompurify"],
  experimental: {
    allowedDevOrigins: ['192.168.100.11'],
  },
}

export default nextConfig
