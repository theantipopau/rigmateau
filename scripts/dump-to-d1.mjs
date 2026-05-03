/**
 * Dump local dev.db (SQLite) data to a D1-compatible SQL file.
 * Usage: node scripts/dump-to-d1.mjs > prisma/d1-seed.sql
 * Requires Node.js 22.5+ (node:sqlite is built-in)
 */
import { DatabaseSync } from 'node:sqlite'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dir, '..', 'dev.db')

const db = new DatabaseSync(dbPath)

// Tables in dependency order (parents before children)
const tables = [
  'Category',
  'Retailer',
  'Seller',
  'SellerTrustScore',
  'Part',
  'Listing',
  'PriceHistory',
  'Build',
  'BuildPart',
  'CompatibilityRule',
]

function escapeVal(v) {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number' || typeof v === 'bigint') return String(v)
  if (typeof v === 'boolean') return v ? '1' : '0'
  // Escape single quotes
  return `'${String(v).replace(/'/g, "''")}'`
}

console.log('-- RigMate AU D1 Seed')
console.log('-- Generated from local dev.db by scripts/dump-to-d1.mjs')
console.log('-- Apply with: wrangler d1 execute rigmateapp-db --remote --file=prisma/d1-seed.sql')
console.log('')

for (const table of tables) {
  let rows
  try {
    rows = db.prepare(`SELECT * FROM "${table}"`).all()
  } catch {
    // Table may not exist (e.g. empty migrations-only table)
    continue
  }
  if (!rows.length) continue

  console.log(`-- ${table} (${rows.length} rows)`)
  for (const row of rows) {
    const keys = Object.keys(row)
    const cols = keys.map(k => `"${k}"`).join(', ')
    const vals = keys.map(k => escapeVal(row[k])).join(', ')
    console.log(`INSERT OR IGNORE INTO "${table}" (${cols}) VALUES (${vals});`)
  }
  console.log('')
}

db.close()
