import { checkCompatibility } from '@/lib/compatibility'
import { getPricedListings, summarizePriceCoverage } from '@/lib/pricing'
import { IS_GITHUB_PAGES, withBasePath } from '@/lib/runtime/deploy'
import { getStaticPartById, getStaticPartsByCategory, getStaticParts } from '@/lib/static/catalog'
import type {
  BuildSlotKey,
  BuildState,
  CompatibilityReport,
  PartWithCategory,
  PriceCoverageSummary,
  PriceScore,
} from '@/lib/types'

interface PartQuery {
  id?: string
  category?: string
  q?: string
  filters?: Record<string, string>
}

interface SaveBuildInput {
  name: string
  purpose?: string
  partIds: Record<string, string>
}

interface SaveBuildResult {
  url: string
}

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const FF_HIERARCHY: Record<string, number> = { ITX: 1, mATX: 2, ATX: 3, 'E-ATX': 4 }

function allowedFormFactors(maxFormFactor: string): string[] {
  const maxLevel = FF_HIERARCHY[maxFormFactor] ?? 99
  return Object.entries(FF_HIERARCHY)
    .filter(([, level]) => level <= maxLevel)
    .map(([ff]) => ff)
}

function applyFilters(parts: PartWithCategory[], filters: Record<string, string>): PartWithCategory[] {
  const socket = filters.filterSocket
  const maxFormFactor = filters.filterMaxFormFactor
  const ramType = filters.filterRamType
  const maxHeightMm = Number(filters.filterMaxHeightMm)
  const maxLengthMm = Number(filters.filterMaxLengthMm)
  const psuFormFactor = filters.filterPsuFormFactor

  const allowedFf = maxFormFactor ? new Set(allowedFormFactors(maxFormFactor)) : null

  return parts.filter((part) => {
    if (socket && !(part.socket ?? '').split(',').map((s) => s.trim()).includes(socket)) {
      return false
    }
    if (allowedFf && part.formFactor && !allowedFf.has(part.formFactor)) {
      return false
    }
    if (ramType && part.ramType !== ramType) {
      return false
    }
    if (Number.isFinite(maxHeightMm) && part.heightMm && part.heightMm > maxHeightMm) {
      return false
    }
    if (Number.isFinite(maxLengthMm) && part.lengthMm && part.lengthMm > maxLengthMm) {
      return false
    }
    if (psuFormFactor && part.psuFormFactor && part.psuFormFactor !== psuFormFactor) {
      return false
    }
    return true
  })
}

function encodeSharePayload(payload: SaveBuildInput): string {
  const value = JSON.stringify(payload)
  const bytes = textEncoder.encode(value)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function decodeSharePayload(raw: string): SaveBuildInput | null {
  try {
    const padded = raw + '='.repeat((4 - (raw.length % 4)) % 4)
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const parsed = JSON.parse(textDecoder.decode(bytes)) as SaveBuildInput
    return parsed
  } catch {
    return null
  }
}

export async function fetchParts(query: PartQuery): Promise<{ part?: PartWithCategory; parts?: PartWithCategory[] }> {
  if (!IS_GITHUB_PAGES) {
    const params = new URLSearchParams()
    if (query.id) params.set('id', query.id)
    if (query.category) params.set('category', query.category)
    if (query.q) params.set('q', query.q)
    for (const [key, value] of Object.entries(query.filters ?? {})) {
      if (value) params.set(key, value)
    }
    const response = await fetch(`${withBasePath('/api/parts')}?${params.toString()}`)
    return response.json()
  }

  if (query.id) {
    const part = getStaticPartById(query.id)
    return { part: part ?? undefined }
  }

  let parts = query.category ? getStaticPartsByCategory(query.category) : getStaticParts()

  if (query.q) {
    const term = query.q.toLowerCase()
    parts = parts.filter((part) => {
      return (
        part.name.toLowerCase().includes(term) ||
        part.brand.toLowerCase().includes(term) ||
        part.model.toLowerCase().includes(term)
      )
    })
  }

  parts = applyFilters(parts, query.filters ?? {})

  return { parts }
}

export async function fetchPricing(partId: string): Promise<{ scores: PriceScore[]; coverage: PriceCoverageSummary }> {
  if (!IS_GITHUB_PAGES) {
    const response = await fetch(`${withBasePath('/api/pricing')}?partId=${encodeURIComponent(partId)}`)
    return response.json()
  }

  const part = getStaticPartById(partId)
  if (!part) {
    return {
      scores: [],
      coverage: summarizePriceCoverage([], 'other'),
    }
  }

  const scores = await getPricedListings(part, part.category.slug)
  const coverage = summarizePriceCoverage(scores, part.category.slug)
  return { scores, coverage }
}

export async function fetchCompatibility(partIds: Record<string, string>): Promise<{ report: CompatibilityReport }> {
  if (!IS_GITHUB_PAGES) {
    const response = await fetch(withBasePath('/api/compatibility'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partIds }),
    })
    return response.json()
  }

  const buildState: BuildState = {}
  for (const [slot, partId] of Object.entries(partIds)) {
    const part = getStaticPartById(partId)
    if (part) {
      buildState[slot as BuildSlotKey] = part
    }
  }
  return { report: checkCompatibility(buildState) }
}

export async function saveBuild(input: SaveBuildInput): Promise<SaveBuildResult> {
  if (!IS_GITHUB_PAGES) {
    const response = await fetch(withBasePath('/api/builds'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const data = (await response.json()) as { url?: string }
    return { url: data.url ?? '/showcase' }
  }

  const encoded = encodeSharePayload(input)
  return { url: `${withBasePath('/showcase')}?data=${encodeURIComponent(encoded)}` }
}
