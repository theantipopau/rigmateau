import type { NextConfig } from 'next'

const deployTarget = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'github-pages' ? 'github-pages' : 'cloudflare'
const isGithubPages = deployTarget === 'github-pages'
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isGithubPages ? '/rigmateau' : '')

const nextConfig: NextConfig = {
  experimental: {},
  output: isGithubPages ? 'export' : 'standalone',
  trailingSlash: isGithubPages,
  basePath: configuredBasePath || undefined,
  assetPrefix: configuredBasePath || undefined,
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
