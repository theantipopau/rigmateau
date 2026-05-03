// RigMate AU – Provider Interface Definitions
// Real scraping/API integration will replace mock providers in future
// See docs: /docs/providers.md

import type { Listing, Part } from '@/lib/types'

/** A provider fetches listings for a given part */
export interface PriceProvider {
  /** Unique provider identifier */
  id: string
  name: string
  source: 'local' | 'ebay' | 'aliexpress'

  /**
   * Fetch listings for a given part.
   * Returns empty array if no listings found.
   *
   * FUTURE: Replace with real scraper / API client.
   * - Local retailers: direct HTML scrape or retailer API (MSY, Scorptec, PLE, Amazon AU, etc.)
   * - eBay AU: eBay Browse API (free tier available)
   * - AliExpress: AliExpress Open Platform API or partner scraper
   */
  getListings(part: Part): Promise<Listing[]>
}

/** Aggregate listings from all configured providers */
export interface PriceAggregator {
  providers: PriceProvider[]
  getAll(part: Part): Promise<Listing[]>
}
