// RigMate AU – Mock AliExpress Provider
// FUTURE: Replace with AliExpress Open Platform API or trusted partner scraper
// Docs: https://developers.aliexpress.com/
//
// Integration boundary:
// - Use approved partner data and respect platform rules.
// - Keep high-risk category warnings in place for AU buyers.

import type { Listing, Part } from '@/lib/types'
import type { PriceProvider } from './interface'
import { MOCK_ALIEXPRESS_LISTINGS } from '@/lib/pricing/mock-data'

// Categories considered safe to import from AliExpress
export const ALIEXPRESS_SAFE_CATEGORIES = new Set(['cpu', 'cooler', 'case', 'fan', 'other'])

// Categories with heavy risk warnings
export const ALIEXPRESS_RISKY_CATEGORIES = new Set(['gpu', 'motherboard', 'psu', 'ram', 'storage', 'monitor'])

// Trust thresholds for AliExpress listings
export const ALIEXPRESS_MIN_RATING = 4.0
export const ALIEXPRESS_MIN_ORDERS = 100

const TARGET_ALI_COVERAGE_SAFE = 4
const TARGET_ALI_COVERAGE_RISKY = 2

const ALI_RETAILER = {
  id: 'aliexpress',
  name: 'AliExpress',
  slug: 'aliexpress',
  url: 'https://www.aliexpress.com',
  country: 'CN',
  source: 'aliexpress',
} as const

type AliSellerProfile = {
  id: string
  username: string
  rating: number
  reviewCount: number
  orderCount: number
}

const PROJECTED_ALI_SELLERS: AliSellerProfile[] = [
  { id: 'ali-proj-1', username: 'shenzhen_pcmall', rating: 4.7, reviewCount: 3200, orderCount: 5400 },
  { id: 'ali-proj-2', username: 'global_hw_store', rating: 4.6, reviewCount: 1900, orderCount: 4100 },
  { id: 'ali-proj-3', username: 'eastwest_components', rating: 4.5, reviewCount: 2400, orderCount: 3900 },
  { id: 'ali-proj-4', username: 'digital_factory_cn', rating: 4.8, reviewCount: 2800, orderCount: 7200 },
]

function partHash(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

function estimateBasePrice(part: Part): number {
  if (typeof part.benchmarkScore === 'number' && part.benchmarkScore > 0) {
    return Math.max(15, Math.round(part.benchmarkScore * 0.23))
  }
  if (typeof part.psuWatts === 'number' && part.psuWatts > 0) {
    return Math.round(part.psuWatts * 0.18)
  }
  if (typeof part.capacityGb === 'number' && part.capacityGb > 0) {
    return Math.round(part.capacityGb * 0.09)
  }
  if (typeof part.cores === 'number' && part.cores > 0) {
    return Math.round(part.cores * 30)
  }
  return 79
}

function buildProjectedAliListings(part: Part, current: Listing[]): Listing[] {
  const isSafeCategory = ALIEXPRESS_SAFE_CATEGORIES.has(part.category.slug)
  const target = isSafeCategory ? TARGET_ALI_COVERAGE_SAFE : TARGET_ALI_COVERAGE_RISKY

  if (current.length >= target) {
    return []
  }

  const hash = partHash(part.id)
  const base = estimateBasePrice(part)
  const missing = target - current.length

  return Array.from({ length: missing }).map((_, index) => {
    const profile = PROJECTED_ALI_SELLERS[(hash + index) % PROJECTED_ALI_SELLERS.length]
    const priceFactor = isSafeCategory ? 0.78 + ((hash + index) % 8) / 100 : 0.86 + ((hash + index) % 8) / 100
    const price = Math.max(6, Math.round(base * priceFactor + index * 4))
    const shipping = isSafeCategory ? 0 + (index % 2) * 4 : 8 + (index % 2) * 5

    return {
      id: `ali-projected-${part.id}-${profile.id}-${index}`,
      partId: part.id,
      retailer: ALI_RETAILER,
      seller: {
        id: profile.id,
        username: profile.username,
        platform: 'aliexpress',
        country: 'CN',
        trustScore: {
          rating: profile.rating,
          reviewCount: profile.reviewCount,
          orderCount: profile.orderCount,
          positivePercent: Math.round(profile.rating * 19 + 5),
          shipsToAU: true,
          score: Math.round((profile.rating / 5) * 50 + Math.min(profile.orderCount / 6000, 1) * 30 + 20),
        },
      },
      price,
      shipping,
      currency: 'AUD',
      inStock: true,
      condition: 'new',
      source: 'aliexpress',
      coverage: 'projected',
      deliveryDays: isSafeCategory ? 8 + (index % 4) : 11 + (index % 5),
      warrantyMonths: 12,
      url: 'https://www.aliexpress.com',
      affiliateUrl: 'https://www.aliexpress.com',
    }
  })
}

export const aliexpressProvider: PriceProvider = {
  id: 'aliexpress',
  name: 'AliExpress',
  source: 'aliexpress',

  async getListings(part: Part): Promise<Listing[]> {
    // FUTURE implementation:
    //   Use AliExpress Affiliate API or partner scraper
    //   Filter: rating >= 4.0, orderCount >= 100, shipsToAU = true
    //   Map to Listing type with seller trust data
    //   Flag risky categories prominently
    //
    //   AliExpress Affiliate Portal: https://portals.aliexpress.com/
    //   Requires: affiliate account, API key

    const listings = (MOCK_ALIEXPRESS_LISTINGS[part.id] ?? []).map((listing) => ({
      ...listing,
      coverage: listing.coverage ?? ('live' as const),
    }))

    const projected = buildProjectedAliListings(part, listings)
    const combined = [...listings, ...projected]

    // Apply trust filtering
    return combined.filter(listing => {
      const trustScore = listing.seller?.trustScore
      if (!trustScore) return false
      if (trustScore.rating < ALIEXPRESS_MIN_RATING) return false
      if (trustScore.orderCount !== undefined && trustScore.orderCount < ALIEXPRESS_MIN_ORDERS) return false
      if (!trustScore.shipsToAU) return false
      return true
    })
  },
}
