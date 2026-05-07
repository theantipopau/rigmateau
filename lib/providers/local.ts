// RigMate AU - Mock local retailer provider
// Broadens AU coverage with projected retailer options when mock data is sparse.
//
// Future integration note:
// - Prefer official APIs, approved affiliate feeds, or explicit data partnerships.
// - Respect each retailer terms of service and robots.txt.

import type { Listing, Part, Retailer } from '@/lib/types'
import type { PriceProvider } from './interface'
import { MOCK_LOCAL_LISTINGS } from '@/lib/pricing/mock-data'

const TARGET_LOCAL_COVERAGE = 7

const PROJECTED_LOCAL_RETAILERS: Retailer[] = [
  {
    id: 'amazon-au',
    name: 'Amazon AU',
    slug: 'amazon-au',
    url: 'https://www.amazon.com.au',
    country: 'AU',
    source: 'local',
  },
  {
    id: 'mwave',
    name: 'Mwave',
    slug: 'mwave',
    url: 'https://www.mwave.com.au',
    country: 'AU',
    source: 'local',
  },
  {
    id: 'jw',
    name: 'JW Computers',
    slug: 'jw',
    url: 'https://www.jw.com.au',
    country: 'AU',
    source: 'local',
  },
  {
    id: 'shopping-express',
    name: 'Shopping Express',
    slug: 'shopping-express',
    url: 'https://www.shoppingexpress.com.au',
    country: 'AU',
    source: 'local',
  },
  {
    id: 'bpctech',
    name: 'BPC Tech',
    slug: 'bpctech',
    url: 'https://www.bpctech.com.au',
    country: 'AU',
    source: 'local',
  },
  {
    id: 'jbhifi',
    name: 'JB Hi-Fi',
    slug: 'jbhifi',
    url: 'https://www.jbhifi.com.au',
    country: 'AU',
    source: 'local',
  },
  {
    id: 'centrecom',
    name: 'Centre Com',
    slug: 'centrecom',
    url: 'https://www.centrecom.com.au',
    country: 'AU',
    source: 'local',
  },
  {
    id: 'computer-alliance',
    name: 'Computer Alliance',
    slug: 'computer-alliance',
    url: 'https://www.computeralliance.com.au',
    country: 'AU',
    source: 'local',
  },
  {
    id: 'cpl',
    name: 'CPL',
    slug: 'cpl',
    url: 'https://cplonline.com.au',
    country: 'AU',
    source: 'local',
  },
]

const RETAILER_MULTIPLIERS: Record<string, { priceFactor: number; shipping: number; deliveryDays: number }> = {
  'amazon-au': { priceFactor: 1.02, shipping: 0, deliveryDays: 3 },
  mwave: { priceFactor: 1.01, shipping: 9, deliveryDays: 4 },
  jw: { priceFactor: 1.015, shipping: 11, deliveryDays: 4 },
  'shopping-express': { priceFactor: 0.995, shipping: 10, deliveryDays: 5 },
  bpctech: { priceFactor: 0.99, shipping: 12, deliveryDays: 5 },
  jbhifi: { priceFactor: 1.05, shipping: 0, deliveryDays: 3 },
  centrecom: { priceFactor: 1.005, shipping: 10, deliveryDays: 4 },
  'computer-alliance': { priceFactor: 1.0, shipping: 11, deliveryDays: 4 },
  cpl: { priceFactor: 0.992, shipping: 12, deliveryDays: 5 },
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

function getReferenceListing(listings: Listing[]): Listing | null {
  const sorted = [...listings]
    .filter((listing) => listing.inStock)
    .sort((a, b) => a.price + a.shipping - (b.price + b.shipping))

  return sorted[0] ?? listings[0] ?? null
}

function buildProjectedListings(part: Part, listings: Listing[]): Listing[] {
  if (listings.length === 0 || listings.length >= TARGET_LOCAL_COVERAGE) {
    return []
  }

  const reference = getReferenceListing(listings)
  if (!reference) {
    return []
  }

  const existingRetailers = new Set(listings.map((listing) => listing.retailer.slug))
  const missingRetailers = PROJECTED_LOCAL_RETAILERS.filter(
    (retailer) => !existingRetailers.has(retailer.slug)
  ).slice(0, TARGET_LOCAL_COVERAGE - listings.length)

  return missingRetailers.map((retailer, index) => {
    const modifier = RETAILER_MULTIPLIERS[retailer.slug] ?? {
      priceFactor: 1.01,
      shipping: 10,
      deliveryDays: 4,
    }

    const shipping = modifier.shipping
    const price = roundCurrency(
      Math.max(1, reference.price * modifier.priceFactor + index * 2.5)
    )

    return {
      id: `${part.id}-${retailer.slug}-projected`,
      partId: part.id,
      retailer,
      price,
      shipping,
      currency: 'AUD',
      inStock: true,
      condition: 'new',
      source: 'local',
      coverage: 'projected',
      deliveryDays: modifier.deliveryDays,
      warrantyMonths: Math.max(reference.warrantyMonths ?? 24, 24),
      url: retailer.url,
      affiliateUrl: retailer.url,
    }
  })
}

export const localRetailerProvider: PriceProvider = {
  id: 'local-au',
  name: 'Australian Retailers',
  source: 'local',

  async getListings(part: Part): Promise<Listing[]> {
    const liveListings = (MOCK_LOCAL_LISTINGS[part.id] ?? []).map((listing) => ({
      ...listing,
      coverage: listing.coverage ?? ('live' as const),
    }))

    return [...liveListings, ...buildProjectedListings(part, liveListings)]
  },
}
