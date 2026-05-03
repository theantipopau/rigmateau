// RigMate AU – Mock Local Retailer Provider
// Simulates: MSY, Scorptec, PLE, PC Case Gear, Umart, Amazon AU
// FUTURE: Replace with real scraper per retailer

import type { Listing, Part } from '@/lib/types'
import type { PriceProvider } from './interface'
import { MOCK_LOCAL_LISTINGS } from '@/lib/pricing/mock-data'

export const localRetailerProvider: PriceProvider = {
  id: 'local-au',
  name: 'Australian Retailers',
  source: 'local',

  async getListings(part: Part): Promise<Listing[]> {
    // In production: scrape/call APIs for each AU retailer
    // Supported retailers to implement:
    //   - MSY Technology (msy.com.au)
    //   - Scorptec Computers (scorptec.com.au)
    //   - PLE Computers (ple.com.au)
    //   - PC Case Gear (pccasegear.com)
    //   - Umart (umart.com.au)
    //   - Amazon AU (amazon.com.au)
    //   - Centre Com (centrecom.com.au)
    //   - JB Hi-Fi (jbhifi.com.au)

    return MOCK_LOCAL_LISTINGS[part.id] ?? []
  },
}
