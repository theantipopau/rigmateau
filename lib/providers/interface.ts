// RigMate AU - Provider interface definitions
//
// Data sourcing guardrails:
// - Do not scrape or ingest OzBargain content.
// - Do not scrape or ingest Whirlpool content.
// - Respect retailer terms of service and robots.txt before any live integration.
// - Prefer official APIs, affiliate feeds, and approved partnerships.
// - Do not scrape Google Images for product media.

import type { Listing, Part } from '@/lib/types'

// A provider fetches listings for a given part.
export interface PriceProvider {
  // Unique provider identifier.
  id: string
  name: string
  source: 'local' | 'ebay' | 'aliexpress'

  // Fetch listings for a given part.
  // Returns an empty array when no listings are found.
  //
  // FUTURE:
  // - Local AU: official feeds, approved APIs, or compliant integrations.
  // - eBay AU: eBay Browse API (official).
  // - AliExpress: official partner/affiliate APIs.
  getListings(part: Part): Promise<Listing[]>
}

// Aggregate listings from all configured providers.
export interface PriceAggregator {
  providers: PriceProvider[]
  getAll(part: Part): Promise<Listing[]>
}
