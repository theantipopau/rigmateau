// RigMate AU – Mock eBay AU Provider
// FUTURE: Replace with eBay Browse API (free, OAuth2 token)
// Docs: https://developer.ebay.com/api-docs/buy/browse/overview.html

import type { Listing, Part } from '@/lib/types'
import type { PriceProvider } from './interface'
import { MOCK_EBAY_LISTINGS } from '@/lib/pricing/mock-data'

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

    return MOCK_EBAY_LISTINGS[part.id] ?? []
  },
}
