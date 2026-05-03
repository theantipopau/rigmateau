import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { checkCompatibility } from '@/lib/compatibility'
import type { BuildState } from '@/lib/types'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { partIds } = body as { partIds: Record<string, string> }

    const db = await getDb()
    const parts = await db.part.findMany({
      where: { id: { in: Object.values(partIds) } },
      include: { category: true },
    })

    const buildState: BuildState = {}
    for (const [slot, partId] of Object.entries(partIds)) {
      const part = parts.find(p => p.id === partId)
      if (part) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        buildState[slot as keyof BuildState] = part as any
      }
    }

    const report = checkCompatibility(buildState)
    return NextResponse.json({ report })
  } catch (error) {
    console.error('Compatibility check failed:', error)
    return NextResponse.json({ error: 'Compatibility check failed' }, { status: 500 })
  }
}
