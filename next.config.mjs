/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  serverExternalPackages: ["isomorphic-dompurify"],
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig
