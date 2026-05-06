// RigMate AU - Price scoring engine
// Scores listings 0-100 considering: price, shipping, trust, warranty, delivery, and category risk

import type { EnrichedListing, Listing, Part, PriceScore, WarrantyRisk } from '@/lib/types'
import {
  ALIEXPRESS_RISKY_CATEGORIES,
  ALIEXPRESS_SAFE_CATEGORIES,
  aliexpressProvider,
} from '@/lib/providers/aliexpress'
import { ebayProvider } from '@/lib/providers/ebay'
import { localRetailerProvider } from '@/lib/providers/local'

function getWarrantyRisk(listing: Listing, categorySlug: string): WarrantyRisk {
  if (listing.source === 'local') return 'low'
  if (listing.source === 'ebay') {
    return (listing.warrantyMonths ?? 0) >= 12 ? 'low' : 'medium'
  }

  if (ALIEXPRESS_SAFE_CATEGORIES.has(categorySlug)) return 'medium'
  if (ALIEXPRESS_RISKY_CATEGORIES.has(categorySlug)) return 'very-high'
  return 'high'
}

export function enrichListing(listing: Listing, categorySlug: string): EnrichedListing {
  const landedCost = listing.price + listing.shipping
  const trustScore = listing.seller?.trustScore?.score ?? (listing.source === 'local' ? 90 : 50)
  const warrantyRisk = getWarrantyRisk(listing, categorySlug)
  const valueScore = Math.min(
    100,
    Math.max(0, trustScore - (warrantyRisk === 'very-high' ? 30 : warrantyRisk === 'high' ? 15 : 0))
  )

  const worthImporting =
    listing.source === 'aliexpress' &&
    ALIEXPRESS_SAFE_CATEGORIES.has(categorySlug) &&
    trustScore >= 75

  return {
    ...listing,
    landedCost,
    trustScore,
    valueScore,
    warrantyRisk,
    worthImporting,
    recommendation: getRecommendation(listing, trustScore, warrantyRisk),
  }
}

function getRecommendation(listing: Listing, trust: number, risk: WarrantyRisk): string {
  if (listing.source === 'local') return 'Buy with confidence - Australian retailer with full warranty.'
  if (listing.source === 'ebay' && trust >= 90) return 'Reputable AU eBay seller - good option.'
  if (listing.source === 'ebay' && trust >= 70) return 'Decent eBay seller - check listing carefully.'
  if (listing.source === 'aliexpress' && risk === 'medium') return 'Safe AliExpress category - verify seller reviews.'
  if (listing.source === 'aliexpress' && risk === 'very-high') {
    return 'High-risk import. Counterfeit risk. Buy locally instead.'
  }
  return 'Proceed with caution.'
}

export function scoreListing(
  enriched: EnrichedListing,
  allLandedCosts: number[],
  categorySlug: string
): PriceScore {
  const min = Math.min(...allLandedCosts)
  const max = Math.max(...allLandedCosts)
  const range = max - min || 1

  const priceScore = 100 - ((enriched.landedCost - min) / range) * 60
  const trustComponent = enriched.trustScore * 0.25

  const warrantyMap: Record<WarrantyRisk, number> = {
    low: 20,
    medium: 12,
    high: 5,
    'very-high': 0,
  }
  const warrantyValue = warrantyMap[enriched.warrantyRisk]

  const deliveryDays = enriched.deliveryDays ?? 14
  const deliverySpeed = deliveryDays < 5 ? 10 : deliveryDays < 14 ? 5 : 0

  const categoryRisk =
    enriched.source === 'aliexpress' && ALIEXPRESS_RISKY_CATEGORIES.has(categorySlug) ? -20 : 0

  const totalScore = Math.round(
    Math.min(100, Math.max(0, priceScore + trustComponent + warrantyValue + deliverySpeed + categoryRisk))
  )

  let verdict: PriceScore['verdict']
  if (totalScore >= 80) verdict = 'excellent'
  else if (totalScore >= 60) verdict = 'good'
  else if (totalScore >= 40) verdict = 'fair'
  else verdict = 'avoid'

  return {
    listing: enriched,
    breakdown: {
      basePrice: enriched.price,
      shipping: enriched.shipping,
      landedCost: enriched.landedCost,
      sellerTrust: enriched.trustScore,
      warrantyValue,
      deliverySpeed,
      categoryRisk,
    },
    totalScore,
    verdict,
    worthImporting: enriched.worthImporting ?? false,
    summary: getSummary(verdict, enriched),
  }
}

function getSummary(verdict: PriceScore['verdict'], enriched: EnrichedListing): string {
  const cost = enriched.landedCost.toFixed(2)
  if (verdict === 'excellent') return `Best value at A$${cost} landed - highly recommended.`
  if (verdict === 'good') return `Good option at A$${cost} landed.`
  if (verdict === 'fair') return `Acceptable at A$${cost} - check alternatives.`
  return `Avoid - A$${cost} landed but risk outweighs savings.`
}

export async function getPricedListings(part: Part, categorySlug: string): Promise<PriceScore[]> {
  const [local, ebay, ali] = await Promise.all([
    localRetailerProvider.getListings(part),
    ebayProvider.getListings(part),
    aliexpressProvider.getListings(part),
  ])

  const all = [...local, ...ebay, ...ali]
  const enriched = all.map((listing) => enrichListing(listing, categorySlug))
  const costs = enriched.map((listing) => listing.landedCost)

  return enriched
    .map((listing) => scoreListing(listing, costs, categorySlug))
    .sort((a, b) => b.totalScore - a.totalScore)
}
