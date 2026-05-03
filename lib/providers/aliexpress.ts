// RigMate AU – Mock AliExpress Provider
// FUTURE: Replace with AliExpress Open Platform API or trusted partner scraper
// Docs: https://developers.aliexpress.com/

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

    const listings = MOCK_ALIEXPRESS_LISTINGS[part.id] ?? []

    // Apply trust filtering
    return listings.filter(listing => {
      const trustScore = listing.seller?.trustScore
      if (!trustScore) return false
      if (trustScore.rating < ALIEXPRESS_MIN_RATING) return false
      if (trustScore.orderCount !== undefined && trustScore.orderCount < ALIEXPRESS_MIN_ORDERS) return false
      if (!trustScore.shipsToAU) return false
      return true
    })
  },
}
