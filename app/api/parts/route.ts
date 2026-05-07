import { NextRequest, NextResponse } from 'next/server'
import { USE_STATIC_DATA } from '@/lib/runtime/deploy'
import { getStaticPartById, getStaticParts } from '@/lib/static/catalog'
import type { PartWithCategory } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FF_HIERARCHY: Record<string, number> = { ITX: 1, mATX: 2, ATX: 3, 'E-ATX': 4 }

function allowedFormFactors(maxFormFactor: string): string[] {
  const maxLevel = FF_HIERARCHY[maxFormFactor] ?? 99
  return Object.entries(FF_HIERARCHY)
    .filter(([, level]) => level <= maxLevel)
    .map(([ff]) => ff)
}

function applyCompatFilters(
  parts: PartWithCategory[],
  filters: {
    filterSocket?: string
    filterMaxFormFactor?: string
    filterRamType?: string
    filterMaxHeightMm?: string | null
    filterMaxLengthMm?: string | null
    filterPsuFormFactor?: string
  }
): PartWithCategory[] {
  const allowedFormFactorSet = filters.filterMaxFormFactor
    ? new Set(allowedFormFactors(filters.filterMaxFormFactor))
    : null
  const maxHeightMm = filters.filterMaxHeightMm ? Number(filters.filterMaxHeightMm) : undefined
  const maxLengthMm = filters.filterMaxLengthMm ? Number(filters.filterMaxLengthMm) : undefined

  return parts.filter((part) => {
    if (filters.filterSocket) {
      const sockets = (part.socket ?? '')
        .split(',')
        .map((socket) => socket.trim())
        .filter(Boolean)
      if (!sockets.includes(filters.filterSocket)) {
        return false
      }
    }

    if (allowedFormFactorSet && part.formFactor && !allowedFormFactorSet.has(part.formFactor)) {
      return false
    }

    if (filters.filterRamType && part.ramType && part.ramType !== filters.filterRamType) {
      return false
    }

    if (
      typeof maxHeightMm === 'number' &&
      Number.isFinite(maxHeightMm) &&
      part.heightMm &&
      part.heightMm > maxHeightMm
    ) {
      return false
    }

    if (
      typeof maxLengthMm === 'number' &&
      Number.isFinite(maxLengthMm) &&
      part.lengthMm &&
      part.lengthMm > maxLengthMm
    ) {
      return false
    }

    if (
      filters.filterPsuFormFactor &&
      part.psuFormFactor &&
      part.psuFormFactor !== filters.filterPsuFormFactor
    ) {
      return false
    }

    return true
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const partId = searchParams.get('id')
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
    if (USE_STATIC_DATA) {
      if (partId) {
        const part = getStaticPartById(partId)
        if (!part) {
          return NextResponse.json({ error: 'Part not found' }, { status: 404 })
        }
        return NextResponse.json({ part })
      }

      let parts = getStaticParts()
      if (categorySlug) {
        parts = parts.filter((part) => part.category.slug === categorySlug)
      }
      if (query) {
        const q = query.toLowerCase()
        parts = parts.filter(
          (part) =>
            part.name.toLowerCase().includes(q) ||
            part.brand.toLowerCase().includes(q) ||
            part.model.toLowerCase().includes(q)
        )
      }

      parts = applyCompatFilters(parts, {
        filterSocket,
        filterMaxFormFactor,
        filterRamType,
        filterMaxHeightMm,
        filterMaxLengthMm,
        filterPsuFormFactor,
      })

      return NextResponse.json({ parts })
    }

    const { getDb } = await import('@/lib/db')
    const db = await getDb()

    if (partId) {
      const part = (await db.part.findUnique({ where: { id: partId } })) ?? getStaticPartById(partId)

      if (!part) {
        return NextResponse.json({ error: 'Part not found' }, { status: 404 })
      }

      return NextResponse.json({ part })
    }

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

    let staticParts = getStaticParts()
    if (categorySlug) {
      staticParts = staticParts.filter((part) => part.category.slug === categorySlug)
    }
    if (query) {
      const q = query.toLowerCase()
      staticParts = staticParts.filter(
        (part) =>
          part.name.toLowerCase().includes(q) ||
          part.brand.toLowerCase().includes(q) ||
          part.model.toLowerCase().includes(q)
      )
    }
    staticParts = applyCompatFilters(staticParts, {
      filterSocket,
      filterMaxFormFactor,
      filterRamType,
      filterMaxHeightMm,
      filterMaxLengthMm,
      filterPsuFormFactor,
    })

    const merged = new Map<string, PartWithCategory>()
    for (const part of parts) {
      merged.set(part.id, part)
    }
    for (const part of staticParts) {
      if (!merged.has(part.id)) {
        merged.set(part.id, part)
      }
    }

    return NextResponse.json({ parts: Array.from(merged.values()) })
  } catch (error) {
    console.error('Failed to fetch parts:', error)
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 })
  }
}
