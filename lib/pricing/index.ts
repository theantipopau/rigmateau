// RigMate AU - Price scoring engine
// Scores listings by landed cost, trust, warranty, delivery, and category risk.

import type {
  EnrichedListing,
  Listing,
  ListingSource,
  Part,
  PriceCoverageSummary,
  PriceScore,
  WarrantyRisk,
} from '@/lib/types'
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
  if (listing.source === 'local') {
    return listing.coverage === 'projected'
      ? 'Projected AU retailer coverage based on current local pricing.'
      : 'Buy with confidence - Australian retailer with full warranty.'
  }
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

export function summarizePriceCoverage(
  scores: PriceScore[],
  categorySlug: string
): PriceCoverageSummary {
  if (scores.length === 0) {
    return {
      totalOffers: 0,
      localOfferCount: 0,
      localRetailerCount: 0,
      importOfferCount: 0,
      projectedOfferCount: 0,
      sources: [],
      recommendedChannel: 'none',
      recommendation: 'No retailer coverage is available for this part yet.',
    }
  }

  const localScores = scores.filter((score) => score.listing.source === 'local')
  const importScores = scores.filter((score) => score.listing.source !== 'local')
  const projectedOfferCount = scores.filter((score) => score.listing.coverage === 'projected').length
  const localRetailerCount = new Set(
    localScores.map((score) => score.listing.retailer.slug)
  ).size
  const sources = [...new Set(scores.map((score) => score.listing.source))] as ListingSource[]
  const bestOverall = [...scores].sort((a, b) => a.listing.landedCost - b.listing.landedCost)[0]
  const bestLocal = [...localScores].sort((a, b) => a.listing.landedCost - b.listing.landedCost)[0]
  const aliexpressRisk = ALIEXPRESS_RISKY_CATEGORIES.has(categorySlug)
    ? 'risky'
    : ALIEXPRESS_SAFE_CATEGORIES.has(categorySlug)
      ? 'safe'
      : undefined

  let recommendedChannel: PriceCoverageSummary['recommendedChannel'] = 'mixed'
  let recommendation = 'Compare AU retailers against import options and balance warranty against savings.'

  const hasAliExpress = sources.includes('aliexpress')
  const hasEbay = sources.includes('ebay')
  const hasLocal = localScores.length > 0

  if (hasLocal && bestLocal && bestOverall) {
    const premium = bestLocal.listing.landedCost - bestOverall.listing.landedCost
    const premiumRatio = bestOverall.listing.landedCost > 0 ? premium / bestOverall.listing.landedCost : 0

    if (bestOverall.listing.source === 'local' || premiumRatio <= 0.08) {
      recommendedChannel = 'local'
      recommendation =
        'Local AU pricing is close enough that retailer warranty and simpler returns usually win.'
    } else if (bestOverall.listing.source === 'aliexpress' && aliexpressRisk === 'safe') {
      recommendedChannel = 'aliexpress'
      recommendation =
        'AliExpress can be worth considering for this category if seller trust is strong and shipping time is acceptable.'
    } else if (bestOverall.listing.source === 'ebay') {
      recommendedChannel = 'ebay'
      recommendation =
        'eBay AU has the sharpest landed price right now, but seller reputation still matters.'
    } else {
      recommendedChannel = 'mixed'
      recommendation =
        'Import pricing is lower, but this category still benefits from comparing warranty coverage before you commit.'
    }
  } else if (hasLocal) {
    recommendedChannel = 'local'
    recommendation = 'Only AU retailer coverage is available right now.'
  } else if (hasAliExpress && aliexpressRisk === 'safe') {
    recommendedChannel = 'aliexpress'
    recommendation =
      'AliExpress is the main option here. Stick to strong seller ratings and verified shipping to Australia.'
  } else if (hasEbay) {
    recommendedChannel = 'ebay'
    recommendation = 'eBay AU is currently the best-covered fallback. Review seller history before buying.'
  } else if (hasAliExpress) {
    recommendedChannel = 'mixed'
    recommendation = 'AliExpress is visible for comparison, but this category is still safer through local retailers.'
  }

  return {
    totalOffers: scores.length,
    localOfferCount: localScores.length,
    localRetailerCount,
    importOfferCount: importScores.length,
    projectedOfferCount,
    sources,
    bestLocalLandedCost: bestLocal?.listing.landedCost,
    bestOverallLandedCost: bestOverall?.listing.landedCost,
    recommendedChannel,
    recommendation,
    aliexpressRisk,
  }
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
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore
      }
      return a.listing.landedCost - b.listing.landedCost
    })
}
