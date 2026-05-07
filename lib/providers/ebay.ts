// RigMate AU – Mock eBay AU Provider
// FUTURE: Replace with eBay Browse API (free, OAuth2 token)
// Docs: https://developer.ebay.com/api-docs/buy/browse/overview.html
//
// Integration boundary:
// - Use official eBay APIs and approved affiliate mechanisms.
// - Do not use third-party forum deal scraping.

import type { Listing, Part } from '@/lib/types'
import type { PriceProvider } from './interface'
import { MOCK_EBAY_LISTINGS } from '@/lib/pricing/mock-data'

const TARGET_EBAY_COVERAGE = 3

const EBAY_RETAILER = {
  id: 'ebay-au',
  name: 'eBay Australia',
  slug: 'ebay-au',
  url: 'https://www.ebay.com.au',
  country: 'AU',
  source: 'ebay',
} as const

type EbaySellerProfile = {
  id: string
  username: string
  rating: number
  reviewCount: number
  positivePercent: number
}

const PROJECTED_EBAY_SELLERS: EbaySellerProfile[] = [
  { id: 'eb-proj-1', username: 'aussie_tech_hub', rating: 4.8, reviewCount: 820, positivePercent: 98.3 },
  { id: 'eb-proj-2', username: 'pcparts_direct_au', rating: 4.7, reviewCount: 560, positivePercent: 97.5 },
  { id: 'eb-proj-3', username: 'gearclearance_au', rating: 4.6, reviewCount: 340, positivePercent: 96.8 },
  { id: 'eb-proj-4', username: 'buildlab_au', rating: 4.9, reviewCount: 1010, positivePercent: 99.0 },
]

function partHash(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

function estimateBasePrice(part: Part): number {
  if (typeof part.benchmarkScore === 'number' && part.benchmarkScore > 0) {
    return Math.max(25, Math.round(part.benchmarkScore * 0.28))
  }
  if (typeof part.psuWatts === 'number' && part.psuWatts > 0) {
    return Math.round(part.psuWatts * 0.22)
  }
  if (typeof part.capacityGb === 'number' && part.capacityGb > 0) {
    return Math.round(part.capacityGb * 0.12)
  }
  if (typeof part.cores === 'number' && part.cores > 0) {
    return Math.round(part.cores * 38)
  }
  return 99
}

function toSeller(profile: EbaySellerProfile) {
  return {
    id: profile.id,
    username: profile.username,
    platform: 'ebay' as const,
    country: 'AU',
    trustScore: {
      rating: profile.rating,
      reviewCount: profile.reviewCount,
      positivePercent: profile.positivePercent,
      shipsToAU: true,
      score: Math.round((profile.rating / 5) * 60 + (profile.positivePercent / 100) * 40),
    },
  }
}

function buildProjectedEbayListings(part: Part, current: Listing[]): Listing[] {
  if (current.length >= TARGET_EBAY_COVERAGE) {
    return []
  }

  const hash = partHash(part.id)
  const seed = estimateBasePrice(part)
  const missing = TARGET_EBAY_COVERAGE - current.length

  return Array.from({ length: missing }).map((_, index) => {
    const profile = PROJECTED_EBAY_SELLERS[(hash + index) % PROJECTED_EBAY_SELLERS.length]
    const qualityFactor = 0.94 + ((hash + index) % 9) / 100
    const price = Math.max(8, Math.round(seed * qualityFactor + index * 6))
    const isUsed = index === missing - 1 && current.length > 0

    return {
      id: `eb-projected-${part.id}-${profile.id}-${index}`,
      partId: part.id,
      retailer: EBAY_RETAILER,
      seller: toSeller(profile),
      price,
      shipping: isUsed ? 0 : 10 + (index % 2) * 5,
      currency: 'AUD',
      inStock: true,
      condition: isUsed ? 'used' : 'new',
      source: 'ebay',
      coverage: 'projected',
      deliveryDays: 4 + (index % 3),
      warrantyMonths: isUsed ? 0 : 12,
      url: 'https://www.ebay.com.au',
      affiliateUrl: 'https://www.ebay.com.au',
    }
  })
}

export const ebayProvider: PriceProvider = {
  id: 'ebay-au',
  name: 'eBay Australia',
  source: 'ebay',

  async getListings(part: Part): Promise<Listing[]> {
    // FUTURE implementation:
    //   POST https://api.ebay.com/buy/browse/v1/item_summary/search
    //   ?q={part.name}&marketplace_id=EBAY_AU&filter=conditionIds:{1000}
    //   Headers: Authorization: Bearer {token}
    //
    // Notes:
    //   - eBay Partner Network affiliate links available
    //   - Filter by itemLocationCountry: AU or shipsToLocations: AU
    //   - Map results to Listing type
    //   - Compute seller trust score from feedbackScore + feedbackPercentage

    const liveListings = (MOCK_EBAY_LISTINGS[part.id] ?? []).map((listing) => ({
      ...listing,
      coverage: listing.coverage ?? ('live' as const),
    }))

    return [...liveListings, ...buildProjectedEbayListings(part, liveListings)]
  },
}
