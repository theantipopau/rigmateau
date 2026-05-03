import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

export const runtime = 'nodejs'

const CreateBuildSchema = z.object({
  name: z.string().min(1).max(100),
  purpose: z.string().max(100).optional(),
  partIds: z.record(z.string(), z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = CreateBuildSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { name, purpose, partIds } = parsed.data

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
          create: parts.map(part => ({
            partId: part.id,
            quantity: 1,
          })),
        },
      },
      include: {
        buildParts: {
          include: { part: { include: { category: true } } },
        },
      },
    })

    return NextResponse.json({ build, url: `/build/${build.slug}` })
  } catch (error) {
    console.error('Build creation failed:', error)
    return NextResponse.json({ error: 'Build creation failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 })
  }

  try {
    const db = await getDb()
    const build = await db.build.findUnique({
      where: { slug },
      include: {
        buildParts: {
          include: { part: { include: { category: true } } },
        },
      },
    })

    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 })
    }

    return NextResponse.json({ build })
  } catch (error) {
    console.error('Build fetch failed:', error)
    return NextResponse.json({ error: 'Build fetch failed' }, { status: 500 })
  }
}
