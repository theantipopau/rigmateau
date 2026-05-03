import { NextRequest, NextResponse } from 'next/server'
import { getPricedListings } from '@/lib/pricing'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const partId = searchParams.get('partId')

  if (!partId) {
    return NextResponse.json({ error: 'partId is required' }, { status: 400 })
  }

  try {
    const db = await getDb()
    const part = await db.part.findUnique({
      where: { id: partId },
      include: { category: true },
    })

    if (!part) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 })
    }

    const scores = await getPricedListings(part as any, part.category.slug)
    return NextResponse.json({ scores })
  } catch (error) {
    console.error('Pricing fetch failed:', error)
    return NextResponse.json({ error: 'Pricing fetch failed' }, { status: 500 })
  }
}
