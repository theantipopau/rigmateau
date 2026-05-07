'use client'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BuildShowcase from '@/components/build/BuildShowcase'
import { decodeSharePayload } from '@/lib/runtime/client-data'
import { IS_GITHUB_PAGES, withBasePath } from '@/lib/runtime/deploy'
import { getStaticPartById } from '@/lib/static/catalog'
import type { BuildSlotKey, SavedBuild } from '@/lib/types'

function buildFromSharedData(data: string): SavedBuild | null {
  const payload = decodeSharePayload(data)
  if (!payload) {
    return null
  }

  const now = new Date().toISOString()
  const buildParts = Object.entries(payload.partIds)
    .map(([slot, partId], index) => {
      const part = getStaticPartById(partId)
      if (!part) {
        return null
      }
      return {
        id: `shared-${index}`,
        partId: part.id,
        quantity: 1,
        part: {
          ...part,
          category: {
            ...part.category,
            slug: slot as BuildSlotKey,
          },
        },
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  if (buildParts.length === 0) {
    return null
  }

  return {
    id: 'shared-build',
    slug: 'shared-build',
    name: payload.name,
    purpose: payload.purpose,
    isPublic: true,
    totalPrice: undefined,
    estimatedWatts: undefined,
    createdAt: now,
    updatedAt: now,
    buildParts,
  }
}

function SharedShowcaseContent() {
  const searchParams = useSearchParams()
  const encodedData = searchParams.get('data') ?? ''
  const slug = searchParams.get('slug') ?? ''
  const [cloudflareBuild, setCloudflareBuild] = useState<SavedBuild | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadBuild = async () => {
      if (IS_GITHUB_PAGES || !slug) {
        setCloudflareBuild(null)
        return
      }

      try {
        const response = await fetch(withBasePath(`/api/builds?slug=${encodeURIComponent(slug)}`))
        if (!response.ok) {
          if (!cancelled) setCloudflareBuild(null)
          return
        }
        const data = (await response.json()) as { build?: SavedBuild }
        if (!cancelled) {
          setCloudflareBuild(data.build ?? null)
        }
      } catch {
        if (!cancelled) {
          setCloudflareBuild(null)
        }
      }
    }

    void loadBuild()
    return () => {
      cancelled = true
    }
  }, [slug])

  const sharedBuild = useMemo(() => {
    if (!encodedData) {
      return null
    }
    return buildFromSharedData(encodedData)
  }, [encodedData])

  const build = cloudflareBuild ?? sharedBuild

  if (!build) {
    return (
      <main className="min-h-screen bg-gray-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="text-2xl font-semibold">Shared build data is missing</h1>
          <p className="mt-3 text-sm text-gray-400">
            This static showcase link may be invalid or from a different app version.
          </p>
          <Link
            href={withBasePath('/builder')}
            className="mt-6 inline-flex rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500"
          >
            Open Builder
          </Link>
        </div>
      </main>
    )
  }

  return <BuildShowcase build={build} />
}

export default function SharedShowcasePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-950" />}>
      <SharedShowcaseContent />
    </Suspense>
  )
}
