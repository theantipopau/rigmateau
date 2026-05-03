import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {},
  images: {
    unoptimized: true,
  },
  // Exclude dev-only DB adapter from the CF Workers bundle.
  // @libsql/client and @prisma/adapter-libsql are only used in local dev.
  // In production, @prisma/adapter-d1 is used via getCloudflareContext().
  serverExternalPackages: [
    '@libsql/client',
    '@prisma/adapter-libsql',
  ],
}

export default nextConfig
