import type { BuildSlotKey, SavedBuild } from '@/lib/types'
import { getStaticPartById } from '@/lib/static/catalog'

const SAMPLE_BUILD_PARTS: Partial<Record<BuildSlotKey, string>> = {
  cpu: 'cpu-r7-7800x3d',
  motherboard: 'mb-asus-x670e-hero',
  ram: 'ram-corsair-ddr5-6400-32gb',
  gpu: 'gpu-rtx4070super',
  storage: 'ssd-samsung-990pro-2tb',
  psu: 'psu-corsair-rm850x',
  case: 'case-lianli-lancool-216',
  cooler: 'cooler-deepcool-ak620',
  fan: 'fan-arctic-p12',
}

function makeSavedBuild(
  id: string,
  slug: string,
  name: string,
  purpose: string,
  parts: Partial<Record<BuildSlotKey, string>>
): SavedBuild {
  const now = new Date().toISOString()
  const buildParts = Object.entries(parts)
    .map(([slot, partId], index) => {
      const part = partId ? getStaticPartById(partId) : null
      if (!part) {
        return null
      }
      return {
        id: `${id}-part-${index}`,
        partId: part.id,
        quantity: 1,
        part: {
          ...part,
          category: {
            ...part.category,
            slug: slot as (typeof part.category)['slug'],
          },
        },
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  return {
    id,
    slug,
    name,
    purpose,
    isPublic: true,
    totalPrice: undefined,
    estimatedWatts: undefined,
    createdAt: now,
    updatedAt: now,
    buildParts,
  }
}

export const STATIC_SAMPLE_BUILDS: SavedBuild[] = [
  makeSavedBuild(
    'sample-1',
    'sample-1440p-gaming',
    'RigMate Sample 1440p Gaming',
    '1440p Gaming',
    SAMPLE_BUILD_PARTS
  ),
]

export function getStaticSampleBuildBySlug(slug: string): SavedBuild | null {
  return STATIC_SAMPLE_BUILDS.find((build) => build.slug === slug) ?? null
}
