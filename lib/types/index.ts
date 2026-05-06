// RigMate AU – Core TypeScript Types

// ─── Category ────────────────────────────────────────────────────────────────

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

// ─── Part ────────────────────────────────────────────────────────────────────

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

  // Compatibility fields
  socket?: string
  chipset?: string
  ramType?: string
  ramSlots?: number
  maxRamGb?: number
  formFactor?: string
  lengthMm?: number
  heightMm?: number
  widthMm?: number

  // Power
  tdpWatts?: number
  psuWatts?: number
  psuFormFactor?: string

  // Performance
  benchmarkScore?: number
  fps1080p?: number
  fps1440p?: number
  fps4K?: number

  // Specs
  cores?: number
  threads?: number
  boostClockMhz?: number
  baseCockMhz?: number
  cacheMb?: number
  capacityGb?: number
  speedMhz?: number

  listings?: Listing[]
}

// ─── Retailer ────────────────────────────────────────────────────────────────

export type ListingSource = 'local' | 'ebay' | 'aliexpress'

export interface Retailer {
  id: string
  name: string
  slug: string
  url: string
  country: string
  source: ListingSource
  logoUrl?: string
}

// ─── Seller / Trust ──────────────────────────────────────────────────────────

export interface SellerTrustScore {
  rating: number         // 0–5
  reviewCount: number
  orderCount?: number
  positivePercent?: number
  shipsToAU: boolean
  score: number          // 0–100
}

export interface Seller {
  id: string
  username: string
  platform: 'ebay' | 'aliexpress'
  profileUrl?: string
  country?: string
  trustScore?: SellerTrustScore
}

// ─── Listing ─────────────────────────────────────────────────────────────────

export interface Listing {
  id: string
  partId: string
  retailer: Retailer
  seller?: Seller
  url?: string
  affiliateUrl?: string
  price: number          // AUD
  shipping: number       // AUD
  currency: string
  inStock: boolean
  condition: 'new' | 'used' | 'refurbished'
  source: ListingSource
  deliveryDays?: number
  warrantyMonths?: number
}

// ─── Enriched Listing (pricing engine output) ────────────────────────────────

export type WarrantyRisk = 'low' | 'medium' | 'high' | 'very-high'

export interface EnrichedListing extends Listing {
  landedCost: number
  trustScore: number        // 0–100
  valueScore: number        // 0–100
  warrantyRisk: WarrantyRisk
  worthImporting?: boolean  // only for aliexpress
  recommendation: string
}

// ─── Build ───────────────────────────────────────────────────────────────────

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

// Keyed build state used in the UI
export type BuildState = Partial<Record<BuildSlotKey, Part>>

// ─── Build Templates ─────────────────────────────────────────────────────────

export interface BuildTemplate {
  id: string
  name: string
  description: string
  category: 'gaming' | 'workstation' | 'budget' | 'streaming' | 'content-creation'
  estimatedPrice: number // AUD, approximate
  performance?: string
  parts: Partial<Record<BuildSlotKey, string>> // part IDs
}

// ─── Compatibility ───────────────────────────────────────────────────────────

export type CompatibilityStatus = 'compatible' | 'incompatible' | 'warning' | 'unknown'

export interface CompatibilityResult {
  status: CompatibilityStatus
  rule: string        // human-readable rule name
  explanation: string
  severity: 'error' | 'warning' | 'info'
  parts: string[]     // part names involved
}

export interface CompatibilityReport {
  overallStatus: CompatibilityStatus
  results: CompatibilityResult[]
  estimatedWatts: number
  recommendedPsuWatts: number
}

// ─── Performance ─────────────────────────────────────────────────────────────

export interface PerformanceEstimate {
  fps1080p?: number
  fps1440p?: number
  fps4K?: number
  tier: 'entry' | 'mid' | 'high' | 'ultra'
  disclaimer: string
}

// ─── Price Scoring ───────────────────────────────────────────────────────────

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
  totalScore: number // 0–100
  verdict: 'excellent' | 'good' | 'fair' | 'avoid'
  worthImporting: boolean
  summary: string
}
