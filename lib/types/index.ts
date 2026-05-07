// RigMate AU - Core TypeScript types

export type CategorySlug =
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooler'
  | 'fan'
  | 'monitor'
  | 'other'

export interface Category {
  id: string
  slug: CategorySlug
  name: string
  safeImport: boolean
}

export interface Part {
  id: string
  categoryId: string
  category: Category
  name: string
  brand: string
  model: string
  sku?: string
  imageUrl?: string
  description?: string

  socket?: string
  chipset?: string
  ramType?: string
  ramSlots?: number
  maxRamGb?: number
  formFactor?: string
  lengthMm?: number
  heightMm?: number
  widthMm?: number

  tdpWatts?: number
  psuWatts?: number
  psuFormFactor?: string

  benchmarkScore?: number
  fps1080p?: number
  fps1440p?: number
  fps4K?: number

  cores?: number
  threads?: number
  boostClockMhz?: number
  baseCockMhz?: number
  cacheMb?: number
  capacityGb?: number
  speedMhz?: number

  listings?: Listing[]
}

export type ListingSource = 'local' | 'ebay' | 'aliexpress'
export type ListingCoverage = 'live' | 'projected'

export interface Retailer {
  id: string
  name: string
  slug: string
  url: string
  country: string
  source: ListingSource
  logoUrl?: string
}

export interface SellerTrustScore {
  rating: number
  reviewCount: number
  orderCount?: number
  positivePercent?: number
  shipsToAU: boolean
  score: number
}

export interface Seller {
  id: string
  username: string
  platform: 'ebay' | 'aliexpress'
  profileUrl?: string
  country?: string
  trustScore?: SellerTrustScore
}

export interface Listing {
  id: string
  partId: string
  retailer: Retailer
  seller?: Seller
  url?: string
  affiliateUrl?: string
  price: number
  shipping: number
  currency: string
  inStock: boolean
  condition: 'new' | 'used' | 'refurbished'
  source: ListingSource
  coverage?: ListingCoverage
  deliveryDays?: number
  warrantyMonths?: number
}

export type WarrantyRisk = 'low' | 'medium' | 'high' | 'very-high'

export interface EnrichedListing extends Listing {
  landedCost: number
  trustScore: number
  valueScore: number
  warrantyRisk: WarrantyRisk
  worthImporting?: boolean
  recommendation: string
}

export type BuildSlotKey =
  | 'cpu'
  | 'motherboard'
  | 'ram'
  | 'gpu'
  | 'storage'
  | 'psu'
  | 'case'
  | 'cooler'
  | 'fan'

export const BUILD_SLOT_KEYS: BuildSlotKey[] = [
  'cpu',
  'motherboard',
  'ram',
  'gpu',
  'storage',
  'psu',
  'case',
  'cooler',
  'fan',
]

export function isBuildSlotKey(value: string): value is BuildSlotKey {
  return BUILD_SLOT_KEYS.includes(value as BuildSlotKey)
}

export interface BuildPart {
  partId: string
  part: Part
  quantity: number
  note?: string
}

export interface Build {
  id: string
  slug: string
  name: string
  purpose?: string
  isPublic: boolean
  userId?: string
  totalPrice?: number
  estimatedWatts?: number
  buildParts: BuildPart[]
}

export type PartWithCategory = Part & { category: Category }

export interface SavedBuildPart extends BuildPart {
  id: string
  part: PartWithCategory
}

export interface SavedBuild extends Build {
  createdAt: Date | string
  updatedAt: Date | string
  buildParts: SavedBuildPart[]
}

export type BuildState = Partial<Record<BuildSlotKey, Part>>

export interface BuildTemplate {
  id: string
  name: string
  description: string
  category: 'gaming' | 'workstation' | 'budget' | 'streaming' | 'content-creation'
  estimatedPrice: number
  performance?: string
  parts: Partial<Record<BuildSlotKey, string>>
}

export type CompatibilityStatus = 'compatible' | 'incompatible' | 'warning' | 'unknown'

export interface CompatibilityResult {
  status: CompatibilityStatus
  rule: string
  explanation: string
  severity: 'error' | 'warning' | 'info'
  parts: string[]
}

export interface CompatibilityReport {
  overallStatus: CompatibilityStatus
  results: CompatibilityResult[]
  estimatedWatts: number
  recommendedPsuWatts: number
}

export interface PerformanceEstimate {
  fps1080p?: number
  fps1440p?: number
  fps4K?: number
  tier: 'entry' | 'mid' | 'high' | 'ultra'
  disclaimer: string
}

export interface PriceScore {
  listing: EnrichedListing
  breakdown: {
    basePrice: number
    shipping: number
    landedCost: number
    sellerTrust: number
    warrantyValue: number
    deliverySpeed: number
    categoryRisk: number
  }
  totalScore: number
  verdict: 'excellent' | 'good' | 'fair' | 'avoid'
  worthImporting: boolean
  summary: string
}

export interface PriceCoverageSummary {
  totalOffers: number
  localOfferCount: number
  localRetailerCount: number
  importOfferCount: number
  projectedOfferCount: number
  sources: ListingSource[]
  bestLocalLandedCost?: number
  bestOverallLandedCost?: number
  recommendedChannel: 'local' | 'ebay' | 'aliexpress' | 'mixed' | 'none'
  recommendation: string
  aliexpressRisk?: 'safe' | 'risky'
}
