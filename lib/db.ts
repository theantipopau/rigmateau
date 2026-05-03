// RigMate AU – Prisma client
// Development: SQLite via @prisma/adapter-libsql
// Production (Cloudflare Workers): D1 via @prisma/adapter-d1 + getCloudflareContext()
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from '@/app/generated/prisma'

// ── Dev singleton (used locally via `next dev`) ──────────────────────────────
function createLibSqlClient() {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db'
  const adapter = new PrismaLibSql({ url })
  return new PrismaClient({ adapter } as any)
}

const globalForPrisma = globalThis as unknown as { _devPrisma?: PrismaClient }
const devPrisma: PrismaClient =
  globalForPrisma._devPrisma ?? createLibSqlClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma._devPrisma = devPrisma

// ── CF-aware client factory ──────────────────────────────────────────────────
// In Workers runtime: uses D1 binding via getCloudflareContext().
// In local dev: falls back to libsql dev.db.
export async function getDb(): Promise<PrismaClient> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { env } = getCloudflareContext() as any
    if (env?.DB) {
      const { PrismaD1 } = await import('@prisma/adapter-d1')
      const adapter = new PrismaD1(env.DB)
      return new PrismaClient({ adapter } as any)
    }
  } catch {
    // Not in a CF context — use dev client
  }
  return devPrisma
}

/** Convenience export for code that only runs in local dev */
export const prisma = devPrisma
export default devPrisma
