import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {},
  images: {
    unoptimized: true,
  },
  // In production builds (for CF Workers), alias dev-only DB packages to an
  // empty module so webpack does NOT trace them into the build output.
  // The CF Workers runtime always uses @prisma/adapter-d1 via getCloudflareContext().
  webpack: (config, { dev }) => {
    if (!dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@libsql/client': false,
        '@prisma/adapter-libsql': false,
      }
    }
    return config
  },
}

export default nextConfig
