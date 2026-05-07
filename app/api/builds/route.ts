import { NextRequest, NextResponse } from 'next/server'
import type { PartWithCategory } from '@/lib/types'
import { z } from 'zod'
import { slugify } from '@/lib/utils'
import { USE_STATIC_DATA } from '@/lib/runtime/deploy'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CreateBuildSchema = z.object({
  name: z.string().min(1).max(100),
  purpose: z.string().max(100).optional(),
  partIds: z.record(z.string(), z.string()),
})

export async function POST(request: NextRequest) {
  if (USE_STATIC_DATA) {
    return NextResponse.json(
      { error: 'Build persistence API is unavailable in static mode' },
      { status: 405 }
    )
  }

  try {
    const body = await request.json()
    const parsed = CreateBuildSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { name, purpose, partIds } = parsed.data

    const { getDb } = await import('@/lib/db')
    const db = await getDb()
    const parts = await db.part.findMany({
      where: { id: { in: Object.values(partIds) } },
    })

    const slug = `${slugify(name)}-${Date.now().toString(36)}`

    const build = await db.build.create({
      data: {
        slug,
        name,
        purpose,
        isPublic: true,
        buildParts: {
          create: parts.map((part: PartWithCategory) => ({
            partId: part.id,
            quantity: 1,
          })),
        },
      },
    })

    return NextResponse.json({ build, url: `/showcase?slug=${build.slug}` })
  } catch (error) {
    console.error('Build creation failed:', error)
    return NextResponse.json({ error: 'Build creation failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (USE_STATIC_DATA) {
    return NextResponse.json(
      { error: 'Build fetch API is unavailable in static mode' },
      { status: 405 }
    )
  }

  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 })
  }

  try {
    const { getDb } = await import('@/lib/db')
    const db = await getDb()
    const build = await db.build.findUnique({ where: { slug } })

    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 })
    }

    return NextResponse.json({ build })
  } catch (error) {
    console.error('Build fetch failed:', error)
    return NextResponse.json({ error: 'Build fetch failed' }, { status: 500 })
  }
}
