import { NextRequest, NextResponse } from 'next/server'
import { getPricedListings, summarizePriceCoverage } from '@/lib/pricing'
import { USE_STATIC_DATA } from '@/lib/runtime/deploy'
import { getStaticPartById } from '@/lib/static/catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const partId = searchParams.get('partId')

  if (!partId) {
    return NextResponse.json({ error: 'partId is required' }, { status: 400 })
  }

  try {
    const part = USE_STATIC_DATA
      ? getStaticPartById(partId)
      : await (async () => {
          const { getDb } = await import('@/lib/db')
          const db = await getDb()
          return db.part.findUnique({ where: { id: partId } })
        })()

    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 })
    }

    const scores = await getPricedListings(part, part.category.slug)
    const coverage = summarizePriceCoverage(scores, part.category.slug)

    return NextResponse.json({ scores, coverage })
  } catch (error) {
    console.error('Pricing fetch failed:', error)
    return NextResponse.json({ error: 'Pricing fetch failed' }, { status: 500 })
  }
}
