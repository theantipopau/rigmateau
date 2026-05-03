// Cloudflare Workers/Pages environment bindings
// These types are available in the edge runtime via getRequestContext()

interface CloudflareEnv {
  // D1 database (replaces local SQLite in production)
  DB: D1Database

  // R2 bucket for build card image exports
  R2_STORAGE: R2Bucket

  // KV namespace for pricing cache
  PRICE_CACHE: KVNamespace

  // Environment variables
  NODE_ENV: string
}

declare global {
  interface CloudflareEnv extends CloudflareEnv {}
}

export {}
