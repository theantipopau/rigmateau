import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FF_HIERARCHY: Record<string, number> = { ITX: 1, mATX: 2, ATX: 3, 'E-ATX': 4 }

function allowedFormFactors(maxFormFactor: string): string[] {
  const maxLevel = FF_HIERARCHY[maxFormFactor] ?? 99
  return Object.entries(FF_HIERARCHY)
    .filter(([, level]) => level <= maxLevel)
    .map(([ff]) => ff)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('category')
  const query = searchParams.get('q')

  // Compatibility filters
  const filterSocket = searchParams.get('filterSocket') ?? undefined
  const filterMaxFormFactor = searchParams.get('filterMaxFormFactor') ?? undefined
  const filterRamType = searchParams.get('filterRamType') ?? undefined
  const filterMaxHeightMm = searchParams.get('filterMaxHeightMm')
  const filterMaxLengthMm = searchParams.get('filterMaxLengthMm')
  const filterPsuFormFactor = searchParams.get('filterPsuFormFactor') ?? undefined

  const compatWhere: Record<string, unknown> = {}
  if (filterSocket) compatWhere.socketFilter = filterSocket
  if (filterMaxFormFactor) compatWhere.formFactorIn = allowedFormFactors(filterMaxFormFactor)
  if (filterRamType) compatWhere.ramTypeFilter = filterRamType
  if (filterMaxHeightMm) compatWhere.maxHeightMm = Number(filterMaxHeightMm)
  if (filterMaxLengthMm) compatWhere.maxLengthMm = Number(filterMaxLengthMm)
  if (filterPsuFormFactor) compatWhere.psuFormFactorFilter = filterPsuFormFactor

  try {
    const db = await getDb()
    const parts = await db.part.findMany({
      where: {
        ...(categorySlug && {
          category: { slug: categorySlug },
        }),
        ...(query && {
          OR: [
            { name: { contains: query } },
            { brand: { contains: query } },
            { model: { contains: query } },
          ],
        }),
        ...compatWhere,
      },
    })

    return NextResponse.json({ parts })
  } catch (error) {
    console.error('Failed to fetch parts:', error)
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 })
  }
}
