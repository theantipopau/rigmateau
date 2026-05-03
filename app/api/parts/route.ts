import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('category')
  const query = searchParams.get('q')

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
      },
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ parts })
  } catch (error) {
    console.error('Failed to fetch parts:', error)
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 })
  }
}
