type RuntimeCloudflareEnv = {
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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CloudflareEnv extends RuntimeCloudflareEnv {}
}

export {}
