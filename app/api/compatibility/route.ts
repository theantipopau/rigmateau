import { NextRequest, NextResponse } from 'next/server'
import { checkCompatibility } from '@/lib/compatibility'
import { isBuildSlotKey, type BuildState } from '@/lib/types'
import { IS_GITHUB_PAGES } from '@/lib/runtime/deploy'
import { getStaticPartById } from '@/lib/static/catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { partIds } = body as { partIds: Record<string, string> }

    const parts = IS_GITHUB_PAGES
      ? Object.values(partIds)
          .map((id) => getStaticPartById(id))
          .filter((part): part is NonNullable<typeof part> => Boolean(part))
      : await (async () => {
          const { getDb } = await import('@/lib/db')
          const db = await getDb()
          return db.part.findMany({ where: { id: { in: Object.values(partIds) } } })
        })()

    const buildState: BuildState = {}
    for (const [slot, partId] of Object.entries(partIds)) {
      const part = parts.find((candidate) => candidate.id === partId)
      if (part && isBuildSlotKey(slot)) {
        buildState[slot] = part
      }
    }

    const report = checkCompatibility(buildState)
    return NextResponse.json({ report })
  } catch (error) {
    console.error('Compatibility check failed:', error)
    return NextResponse.json({ error: 'Compatibility check failed' }, { status: 500 })
  }
}
