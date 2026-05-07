import { checkCompatibility } from '@/lib/compatibility'
import { getPricedListings } from '@/lib/pricing'
import { estimatePerformance } from '@/lib/rendering/performance'
import type {
  BuildSlotKey,
  BuildState,
  CompatibilityReport,
  PartWithCategory,
  PerformanceEstimate,
  PriceScore,
  SavedBuild,
} from '@/lib/types'

export const BUILD_SLOT_LABELS: Record<BuildSlotKey, string> = {
  cpu: 'CPU',
  motherboard: 'Motherboard',
  ram: 'RAM',
  gpu: 'GPU',
  storage: 'Storage',
  psu: 'PSU',
  case: 'Case',
  cooler: 'CPU Cooler',
  fan: 'Case Fans',
}

export interface BuildExportPart {
  slotKey: BuildSlotKey
  slotLabel: string
  part: PartWithCategory
  scores: PriceScore[]
  bestOverall?: PriceScore
  bestLocal?: PriceScore
}

export interface BuildExportSnapshot {
  buildState: BuildState
  parts: BuildExportPart[]
  compatibility: CompatibilityReport
  performance: PerformanceEstimate | null
  bestOverallTotal: number
  bestLocalTotal?: number
  hasCompleteLocalCoverage: boolean
}

export function buildStateFromSavedBuild(build: SavedBuild): BuildState {
  const state: BuildState = {}

  for (const buildPart of build.buildParts) {
    const slug = buildPart.part.category.slug
    if (slug in BUILD_SLOT_LABELS) {
      state[slug as BuildSlotKey] = buildPart.part
    }
  }

  return state
}

export async function getBuildExportSnapshot(build: SavedBuild): Promise<BuildExportSnapshot> {
  const buildState = buildStateFromSavedBuild(build)
  const parts = await Promise.all(
    build.buildParts
      .filter((buildPart): buildPart is typeof buildPart & { part: PartWithCategory } => {
        return buildPart.part.category.slug in BUILD_SLOT_LABELS
      })
      .map(async (buildPart) => {
        const slotKey = buildPart.part.category.slug as BuildSlotKey
        const scores = await getPricedListings(buildPart.part, buildPart.part.category.slug)
        const bestOverall = [...scores].sort((a, b) => a.listing.landedCost - b.listing.landedCost)[0]
        const bestLocal = [...scores]
          .filter((score) => score.listing.source === 'local')
          .sort((a, b) => a.listing.landedCost - b.listing.landedCost)[0]

        return {
          slotKey,
          slotLabel: BUILD_SLOT_LABELS[slotKey],
          part: buildPart.part,
          scores,
          bestOverall,
          bestLocal,
        }
      })
  )

  const bestOverallTotal = parts.reduce(
    (total, item) => total + (item.bestOverall?.listing.landedCost ?? 0),
    0
  )
  const hasCompleteLocalCoverage = parts.every((item) => Boolean(item.bestLocal))
  const bestLocalTotal = hasCompleteLocalCoverage
    ? parts.reduce((total, item) => total + (item.bestLocal?.listing.landedCost ?? 0), 0)
    : undefined

  return {
    buildState,
    parts,
    compatibility: checkCompatibility(buildState),
    performance: estimatePerformance(buildState),
    bestOverallTotal,
    bestLocalTotal,
    hasCompleteLocalCoverage,
  }
}
