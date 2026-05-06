// RigMate AU – Mock Listing Data
// Covers all 25 seeded parts across local AU retailers, eBay AU, and AliExpress
// In production these come from live provider calls / scrapers

import type { Listing } from '@/lib/types'

// ─── Retailer shorthand ───────────────────────────────────────────────────────
const R = {
  scorptec: { id: 'scorptec', name: 'Scorptec', slug: 'scorptec', url: 'https://www.scorptec.com.au', country: 'AU', source: 'local' as const },
  pccg:     { id: 'pccg',     name: 'PC Case Gear', slug: 'pccg', url: 'https://www.pccasegear.com', country: 'AU', source: 'local' as const },
  ple:      { id: 'ple',      name: 'PLE Computers', slug: 'ple', url: 'https://www.ple.com.au', country: 'AU', source: 'local' as const },
  msy:      { id: 'msy',      name: 'MSY Technology', slug: 'msy', url: 'https://www.msy.com.au', country: 'AU', source: 'local' as const },
  umart:    { id: 'umart',    name: 'Umart', slug: 'umart', url: 'https://www.umart.com.au', country: 'AU', source: 'local' as const },
  ebay:     { id: 'ebay-au',  name: 'eBay Australia', slug: 'ebay-au', url: 'https://www.ebay.com.au', country: 'AU', source: 'ebay' as const },
  ali:      { id: 'aliexpress', name: 'AliExpress', slug: 'aliexpress', url: 'https://www.aliexpress.com', country: 'CN', source: 'aliexpress' as const },
}

// ─── Seller shorthand ────────────────────────────────────────────────────────
function ebaySeller(id: string, username: string, rating: number, reviews: number, positive: number): Listing['seller'] {
  return { id, username, platform: 'ebay', country: 'AU', trustScore: { rating, reviewCount: reviews, positivePercent: positive, shipsToAU: true, score: Math.round((rating / 5) * 60 + (positive / 100) * 40) } }
}
function aliSeller(id: string, username: string, rating: number, reviews: number, orders: number): Listing['seller'] {
  return { id, username, platform: 'aliexpress', country: 'CN', trustScore: { rating, reviewCount: reviews, orderCount: orders, positivePercent: Math.round(rating * 19 + 5), shipsToAU: true, score: Math.round((rating / 5) * 50 + Math.min(orders / 200, 1) * 30 + 20) } }
}

// ─── Listing builder helpers ─────────────────────────────────────────────────
function local(id: string, partId: string, retailer: typeof R[keyof typeof R], price: number, shipping: number, inStock: boolean, delivery: number, warranty: number): Listing {
  return { id, partId, retailer, price, shipping, currency: 'AUD', inStock, condition: 'new', source: 'local', deliveryDays: delivery, warrantyMonths: warranty, url: '#', affiliateUrl: '#' }
}
function ebay(id: string, partId: string, seller: Listing['seller'], price: number, shipping: number, condition: 'new' | 'used', delivery: number, warranty: number): Listing {
  return { id, partId, retailer: R.ebay, seller, price, shipping, currency: 'AUD', inStock: true, condition, source: 'ebay', deliveryDays: delivery, warrantyMonths: warranty, url: '#', affiliateUrl: '#' }
}
function ali(id: string, partId: string, seller: Listing['seller'], price: number, shipping: number, delivery: number): Listing {
  return { id, partId, retailer: R.ali, seller, price, shipping, currency: 'AUD', inStock: true, condition: 'new', source: 'aliexpress', deliveryDays: delivery, warrantyMonths: 12, url: '#', affiliateUrl: '#' }
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL AU RETAILER LISTINGS
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_LOCAL_LISTINGS: Record<string, Listing[]> = {

  // ── CPUs ──────────────────────────────────────────────────────────────────
  'cpu-r5-5600': [
    local('loc-r55600-sc',  'cpu-r5-5600', R.scorptec, 169,  0,    true,  3, 36),
    local('loc-r55600-pg',  'cpu-r5-5600', R.pccg,     172,  9.90, true,  4, 36),
    local('loc-r55600-msy', 'cpu-r5-5600', R.msy,      165,  0,    true,  2, 36),
    local('loc-r55600-um',  'cpu-r5-5600', R.umart,    167,  0,    true,  3, 36),
  ],
  'cpu-r7-7600': [
    local('loc-r77600-sc',  'cpu-r7-7600', R.scorptec, 279,  0,    true,  3, 36),
    local('loc-r77600-pg',  'cpu-r7-7600', R.pccg,     285,  9.90, true,  4, 36),
    local('loc-r77600-ple', 'cpu-r7-7600', R.ple,      282,  12,   true,  5, 36),
    local('loc-r77600-um',  'cpu-r7-7600', R.umart,    275,  0,    false, 3, 36),
  ],
  'cpu-r7-7800x3d': [
    local('loc-7800x3d-sc',  'cpu-r7-7800x3d', R.scorptec, 549,  0,    true,  3, 36),
    local('loc-7800x3d-ple', 'cpu-r7-7800x3d', R.ple,      545,  12,   true,  5, 36),
    local('loc-7800x3d-pg',  'cpu-r7-7800x3d', R.pccg,     555,  9.90, true,  4, 36),
    local('loc-7800x3d-um',  'cpu-r7-7800x3d', R.umart,    542,  0,    true,  3, 36),
  ],

  // ── Motherboards ──────────────────────────────────────────────────────────
  'mb-asus-b550f': [
    local('loc-b550f-sc',  'mb-asus-b550f', R.scorptec, 249,  0,    true,  3, 36),
    local('loc-b550f-pg',  'mb-asus-b550f', R.pccg,     255,  9.90, true,  4, 36),
    local('loc-b550f-msy', 'mb-asus-b550f', R.msy,      245,  0,    true,  2, 36),
  ],
  'mb-msi-b650m': [
    local('loc-b650m-sc',  'mb-msi-b650m', R.scorptec, 199,  0,    true,  3, 36),
    local('loc-b650m-um',  'mb-msi-b650m', R.umart,    195,  0,    true,  3, 36),
    local('loc-b650m-ple', 'mb-msi-b650m', R.ple,      205,  12,   true,  5, 36),
  ],
  'mb-gigabyte-x570': [
    local('loc-x570-sc',  'mb-gigabyte-x570', R.scorptec, 299,  0,    true,  3, 36),
    local('loc-x570-pg',  'mb-gigabyte-x570', R.pccg,     305,  9.90, true,  4, 36),
    local('loc-x570-ple', 'mb-gigabyte-x570', R.ple,      289,  12,   true,  5, 36),
    local('loc-x570-msy', 'mb-gigabyte-x570', R.msy,      295,  0,    false, 2, 36),
  ],

  // ── RAM ───────────────────────────────────────────────────────────────────
  'ram-corsair-ddr4-3600': [
    local('loc-ddr4-sc',  'ram-corsair-ddr4-3600', R.scorptec, 69,  0,    true,  3, 36),
    local('loc-ddr4-pg',  'ram-corsair-ddr4-3600', R.pccg,     72,  9.90, true,  4, 36),
    local('loc-ddr4-msy', 'ram-corsair-ddr4-3600', R.msy,      65,  0,    true,  2, 36),
    local('loc-ddr4-um',  'ram-corsair-ddr4-3600', R.umart,    67,  0,    true,  3, 36),
  ],
  'ram-gskill-ddr5-6000': [
    local('loc-ddr5-sc',  'ram-gskill-ddr5-6000', R.scorptec, 149,  0,    true,  3, 36),
    local('loc-ddr5-pg',  'ram-gskill-ddr5-6000', R.pccg,     155,  9.90, true,  4, 36),
    local('loc-ddr5-um',  'ram-gskill-ddr5-6000', R.umart,    145,  0,    true,  3, 36),
  ],

  // ── GPUs ──────────────────────────────────────────────────────────────────
  'gpu-rtx4070': [
    local('loc-4070-sc',  'gpu-rtx4070', R.scorptec, 869,  0,    true,  3, 36),
    local('loc-4070-pg',  'gpu-rtx4070', R.pccg,     879,  9.90, true,  4, 36),
    local('loc-4070-msy', 'gpu-rtx4070', R.msy,      889,  15,   false, 7, 36),
    local('loc-4070-um',  'gpu-rtx4070', R.umart,    865,  0,    true,  3, 36),
  ],
  'gpu-rtx4070super': [
    local('loc-4070s-sc',  'gpu-rtx4070super', R.scorptec, 799,  0,    true,  3, 36),
    local('loc-4070s-pg',  'gpu-rtx4070super', R.pccg,     819,  9.90, true,  4, 36),
    local('loc-4070s-ple', 'gpu-rtx4070super', R.ple,      809,  12,   true,  5, 36),
    local('loc-4070s-um',  'gpu-rtx4070super', R.umart,    795,  0,    true,  3, 36),
  ],
  'gpu-rx7800xt': [
    local('loc-7800xt-sc',  'gpu-rx7800xt', R.scorptec, 649,  0,    true,  3, 36),
    local('loc-7800xt-ple', 'gpu-rx7800xt', R.ple,      659,  12,   true,  5, 36),
    local('loc-7800xt-pg',  'gpu-rx7800xt', R.pccg,     669,  9.90, true,  4, 36),
    local('loc-7800xt-msy', 'gpu-rx7800xt', R.msy,      645,  0,    false, 2, 36),
  ],

  // ── SSDs ──────────────────────────────────────────────────────────────────
  'ssd-wd-sn850x-1tb': [
    local('loc-sn850-sc',  'ssd-wd-sn850x-1tb', R.scorptec, 129,  0,    true,  3, 60),
    local('loc-sn850-pg',  'ssd-wd-sn850x-1tb', R.pccg,     135,  9.90, true,  4, 60),
    local('loc-sn850-msy', 'ssd-wd-sn850x-1tb', R.msy,      125,  0,    true,  2, 60),
    local('loc-sn850-um',  'ssd-wd-sn850x-1tb', R.umart,    127,  0,    true,  3, 60),
  ],
  'ssd-samsung-990pro-1tb': [
    local('loc-990pro-sc',  'ssd-samsung-990pro-1tb', R.scorptec, 149,  0,    true,  3, 60),
    local('loc-990pro-pg',  'ssd-samsung-990pro-1tb', R.pccg,     155,  9.90, true,  4, 60),
    local('loc-990pro-um',  'ssd-samsung-990pro-1tb', R.umart,    145,  0,    true,  3, 60),
  ],

  // ── PSUs ──────────────────────────────────────────────────────────────────
  'psu-corsair-rm850x': [
    local('loc-rm850-sc',  'psu-corsair-rm850x', R.scorptec, 189,  0,    true,  3, 120),
    local('loc-rm850-pg',  'psu-corsair-rm850x', R.pccg,     195,  9.90, true,  4, 120),
    local('loc-rm850-ple', 'psu-corsair-rm850x', R.ple,      185,  12,   true,  5, 120),
    local('loc-rm850-msy', 'psu-corsair-rm850x', R.msy,      182,  0,    true,  2, 120),
  ],
  'psu-corsair-sf750': [
    local('loc-sf750-sc',  'psu-corsair-sf750', R.scorptec, 229,  0,    true,  3, 84),
    local('loc-sf750-pg',  'psu-corsair-sf750', R.pccg,     235,  9.90, true,  4, 84),
    local('loc-sf750-ple', 'psu-corsair-sf750', R.ple,      225,  12,   false, 5, 84),
  ],
  'psu-seasonic-focus-750': [
    local('loc-ss750-sc',  'psu-seasonic-focus-750', R.scorptec, 179,  0,    true,  3, 120),
    local('loc-ss750-um',  'psu-seasonic-focus-750', R.umart,    175,  0,    true,  3, 120),
    local('loc-ss750-pg',  'psu-seasonic-focus-750', R.pccg,     185,  9.90, true,  4, 120),
  ],

  // ── Cases ─────────────────────────────────────────────────────────────────
  'case-lianli-o11d': [
    local('loc-o11d-sc',  'case-lianli-o11d', R.scorptec, 199,  0,    true,  3, 24),
    local('loc-o11d-pg',  'case-lianli-o11d', R.pccg,     195,  9.90, true,  4, 24),
    local('loc-o11d-ple', 'case-lianli-o11d', R.ple,      205,  12,   true,  5, 24),
    local('loc-o11d-um',  'case-lianli-o11d', R.umart,    192,  0,    true,  3, 24),
  ],
  'case-fractal-north': [
    local('loc-north-sc',  'case-fractal-north', R.scorptec, 179,  0,    true,  3, 24),
    local('loc-north-pg',  'case-fractal-north', R.pccg,     185,  9.90, true,  4, 24),
    local('loc-north-ple', 'case-fractal-north', R.ple,      175,  12,   true,  5, 24),
  ],
  'case-fractal-define7': [
    local('loc-def7-sc',  'case-fractal-define7', R.scorptec, 219,  0,    true,  3, 24),
    local('loc-def7-pg',  'case-fractal-define7', R.pccg,     225,  9.90, true,  4, 24),
    local('loc-def7-um',  'case-fractal-define7', R.umart,    215,  0,    false, 3, 24),
  ],
  'case-ncase-m1': [
    local('loc-m1-sc',  'case-ncase-m1', R.scorptec, 249,  0,    true,  3, 24),
    local('loc-m1-ple', 'case-ncase-m1', R.ple,      259,  12,   true,  5, 24),
  ],

  // ── Coolers ───────────────────────────────────────────────────────────────
  'cooler-noctua-nhd15': [
    local('loc-nhd15-sc',  'cooler-noctua-nhd15', R.scorptec, 129,  0,    true,  3, 72),
    local('loc-nhd15-pg',  'cooler-noctua-nhd15', R.pccg,     135,  9.90, true,  4, 72),
    local('loc-nhd15-um',  'cooler-noctua-nhd15', R.umart,    125,  0,    true,  3, 72),
  ],
  'cooler-noctua-nhu12a': [
    local('loc-nhu12-sc',  'cooler-noctua-nhu12a', R.scorptec, 109,  0,    true,  3, 72),
    local('loc-nhu12-pg',  'cooler-noctua-nhu12a', R.pccg,     115,  9.90, true,  4, 72),
    local('loc-nhu12-msy', 'cooler-noctua-nhu12a', R.msy,      105,  0,    true,  2, 72),
  ],
  'cooler-id-frost': [
    local('loc-frost-sc', 'cooler-id-frost', R.scorptec, 59, 0, true, 3, 24),
    local('loc-frost-um', 'cooler-id-frost', R.umart,    55, 0, true, 3, 24),
  ],

  // ── Fans ──────────────────────────────────────────────────────────────────
  'fan-noctua-nf-a12x25': [
    local('loc-nfa12-sc',  'fan-noctua-nf-a12x25', R.scorptec, 39,  0,    true,  3, 72),
    local('loc-nfa12-pg',  'fan-noctua-nf-a12x25', R.pccg,     42,  9.90, true,  4, 72),
    local('loc-nfa12-um',  'fan-noctua-nf-a12x25', R.umart,    38,  0,    true,  3, 72),
  ],
  'fan-arctic-p12': [
    local('loc-p12-sc',  'fan-arctic-p12', R.scorptec, 12,  0,    true,  3, 24),
    local('loc-p12-msy', 'fan-arctic-p12', R.msy,      11,  0,    true,  2, 24),
    local('loc-p12-um',  'fan-arctic-p12', R.umart,    10,  0,    true,  3, 24),
  ],

  // ── Additional CPUs ───────────────────────────────────────────────────────
  'cpu-r7-5700x': [
    local('loc-r75700x-sc',  'cpu-r7-5700x', R.scorptec, 179,  0,   true,  3, 36),
    local('loc-r75700x-msy', 'cpu-r7-5700x', R.msy,      175,  0,   true,  2, 36),
    local('loc-r75700x-um',  'cpu-r7-5700x', R.umart,    172,  0,   true,  3, 36),
  ],
  'cpu-r9-5900x': [
    local('loc-r95900x-sc',  'cpu-r9-5900x', R.scorptec, 299,  0,   true,  3, 36),
    local('loc-r95900x-pg',  'cpu-r9-5900x', R.pccg,     305,  9.90,true,  4, 36),
    local('loc-r95900x-ple', 'cpu-r9-5900x', R.ple,      295,  12,  true,  5, 36),
  ],
  'cpu-r7-7600x': [
    local('loc-r77600x-sc',  'cpu-r7-7600x', R.scorptec, 249,  0,   true,  3, 36),
    local('loc-r77600x-pg',  'cpu-r7-7600x', R.pccg,     255,  9.90,true,  4, 36),
    local('loc-r77600x-um',  'cpu-r7-7600x', R.umart,    245,  0,   true,  3, 36),
  ],
  'cpu-r7-7700x': [
    local('loc-r77700x-sc',  'cpu-r7-7700x', R.scorptec, 369,  0,   true,  3, 36),
    local('loc-r77700x-pg',  'cpu-r7-7700x', R.pccg,     375,  9.90,true,  4, 36),
    local('loc-r77700x-ple', 'cpu-r7-7700x', R.ple,      365,  12,  true,  5, 36),
  ],
  'cpu-r9-7900x': [
    local('loc-r97900x-sc',  'cpu-r9-7900x', R.scorptec, 429,  0,   true,  3, 36),
    local('loc-r97900x-pg',  'cpu-r9-7900x', R.pccg,     439,  9.90,true,  4, 36),
    local('loc-r97900x-um',  'cpu-r9-7900x', R.umart,    425,  0,   true,  3, 36),
  ],
  'cpu-r7-9700x': [
    local('loc-r79700x-sc',  'cpu-r7-9700x', R.scorptec, 449,  0,   true,  3, 36),
    local('loc-r79700x-pg',  'cpu-r7-9700x', R.pccg,     459,  9.90,true,  4, 36),
    local('loc-r79700x-ple', 'cpu-r7-9700x', R.ple,      445,  12,  true,  5, 36),
    local('loc-r79700x-um',  'cpu-r7-9700x', R.umart,    442,  0,   true,  3, 36),
  ],
  'cpu-r9-9900x': [
    local('loc-r99900x-sc',  'cpu-r9-9900x', R.scorptec, 549,  0,   true,  3, 36),
    local('loc-r99900x-pg',  'cpu-r9-9900x', R.pccg,     559,  9.90,true,  4, 36),
    local('loc-r99900x-ple', 'cpu-r9-9900x', R.ple,      545,  12,  true,  5, 36),
  ],
  'cpu-r9-9950x': [
    local('loc-r99950x-sc',  'cpu-r9-9950x', R.scorptec, 799,  0,   true,  3, 36),
    local('loc-r99950x-pg',  'cpu-r9-9950x', R.pccg,     819,  9.90,true,  4, 36),
    local('loc-r99950x-um',  'cpu-r9-9950x', R.umart,    795,  0,   false, 3, 36),
  ],
  'cpu-i5-13600k': [
    local('loc-i513600k-sc',  'cpu-i5-13600k', R.scorptec, 329,  0,   true,  3, 36),
    local('loc-i513600k-pg',  'cpu-i5-13600k', R.pccg,     335,  9.90,true,  4, 36),
    local('loc-i513600k-msy', 'cpu-i5-13600k', R.msy,      325,  0,   true,  2, 36),
    local('loc-i513600k-um',  'cpu-i5-13600k', R.umart,    322,  0,   true,  3, 36),
  ],
  'cpu-i7-13700k': [
    local('loc-i713700k-sc',  'cpu-i7-13700k', R.scorptec, 449,  0,   true,  3, 36),
    local('loc-i713700k-pg',  'cpu-i7-13700k', R.pccg,     459,  9.90,true,  4, 36),
    local('loc-i713700k-ple', 'cpu-i7-13700k', R.ple,      445,  12,  true,  5, 36),
  ],
  'cpu-i5-14600k': [
    local('loc-i514600k-sc',  'cpu-i5-14600k', R.scorptec, 349,  0,   true,  3, 36),
    local('loc-i514600k-pg',  'cpu-i5-14600k', R.pccg,     355,  9.90,true,  4, 36),
    local('loc-i514600k-msy', 'cpu-i5-14600k', R.msy,      345,  0,   true,  2, 36),
    local('loc-i514600k-um',  'cpu-i5-14600k', R.umart,    342,  0,   true,  3, 36),
  ],
  'cpu-i7-14700k': [
    local('loc-i714700k-sc',  'cpu-i7-14700k', R.scorptec, 499,  0,   true,  3, 36),
    local('loc-i714700k-pg',  'cpu-i7-14700k', R.pccg,     509,  9.90,true,  4, 36),
    local('loc-i714700k-ple', 'cpu-i7-14700k', R.ple,      495,  12,  false, 5, 36),
  ],
  'cpu-i9-14900k': [
    local('loc-i914900k-sc',  'cpu-i9-14900k', R.scorptec, 699,  0,   true,  3, 36),
    local('loc-i914900k-pg',  'cpu-i9-14900k', R.pccg,     715,  9.90,true,  4, 36),
    local('loc-i914900k-um',  'cpu-i9-14900k', R.umart,    695,  0,   true,  3, 36),
  ],

  // ── Additional Motherboards ───────────────────────────────────────────────
  'mb-msi-b550-gaming-plus': [
    local('loc-b550tp-sc',  'mb-msi-b550-gaming-plus', R.scorptec, 199,  0,    true,  3, 36),
    local('loc-b550tp-pg',  'mb-msi-b550-gaming-plus', R.pccg,     205,  9.90, true,  4, 36),
    local('loc-b550tp-msy', 'mb-msi-b550-gaming-plus', R.msy,      195,  0,    true,  2, 36),
  ],
  'mb-asus-x570-tuf': [
    local('loc-x570tuf-sc',  'mb-asus-x570-tuf', R.scorptec, 279,  0,    true,  3, 36),
    local('loc-x570tuf-pg',  'mb-asus-x570-tuf', R.pccg,     285,  9.90, true,  4, 36),
    local('loc-x570tuf-um',  'mb-asus-x570-tuf', R.umart,    275,  0,    true,  3, 36),
  ],
  'mb-asus-b650-plus-d4': [
    local('loc-b650plus-sc', 'mb-asus-b650-plus-d4', R.scorptec, 199,  0,    true,  3, 36),
    local('loc-b650plus-pg', 'mb-asus-b650-plus-d4', R.pccg,     205,  9.90, true,  4, 36),
    local('loc-b650plus-um', 'mb-asus-b650-plus-d4', R.umart,    195,  0,    true,  3, 36),
  ],
  'mb-gigabyte-b650e-elite': [
    local('loc-b650e-sc',  'mb-gigabyte-b650e-elite', R.scorptec, 279,  0,    true,  3, 36),
    local('loc-b650e-pg',  'mb-gigabyte-b650e-elite', R.pccg,     289,  9.90, true,  4, 36),
    local('loc-b650e-ple', 'mb-gigabyte-b650e-elite', R.ple,      275,  12,   true,  5, 36),
    local('loc-b650e-um',  'mb-gigabyte-b650e-elite', R.umart,    272,  0,    true,  3, 36),
  ],
  'mb-asus-x670e-hero': [
    local('loc-x670ehero-sc',  'mb-asus-x670e-hero', R.scorptec, 649,  0,    true,  3, 36),
    local('loc-x670ehero-pg',  'mb-asus-x670e-hero', R.pccg,     659,  9.90, true,  4, 36),
    local('loc-x670ehero-ple', 'mb-asus-x670e-hero', R.ple,      645,  12,   true,  5, 36),
  ],
  'mb-msi-x670e-apex': [
    local('loc-x670ace-sc',  'mb-msi-x670e-apex', R.scorptec, 549,  0,    true,  3, 36),
    local('loc-x670ace-pg',  'mb-msi-x670e-apex', R.pccg,     559,  9.90, true,  4, 36),
    local('loc-x670ace-um',  'mb-msi-x670e-apex', R.umart,    545,  0,    false, 3, 36),
  ],
  'mb-asus-b760m-plus': [
    local('loc-b760m-sc',  'mb-asus-b760m-plus', R.scorptec, 179,  0,    true,  3, 36),
    local('loc-b760m-pg',  'mb-asus-b760m-plus', R.pccg,     185,  9.90, true,  4, 36),
    local('loc-b760m-msy', 'mb-asus-b760m-plus', R.msy,      175,  0,    true,  2, 36),
    local('loc-b760m-um',  'mb-asus-b760m-plus', R.umart,    172,  0,    true,  3, 36),
  ],
  'mb-msi-b760-gaming-plus': [
    local('loc-b760gp-sc',  'mb-msi-b760-gaming-plus', R.scorptec, 219,  0,    true,  3, 36),
    local('loc-b760gp-pg',  'mb-msi-b760-gaming-plus', R.pccg,     225,  9.90, true,  4, 36),
    local('loc-b760gp-um',  'mb-msi-b760-gaming-plus', R.umart,    215,  0,    true,  3, 36),
  ],
  'mb-gigabyte-z790-aorus': [
    local('loc-z790ao-sc',  'mb-gigabyte-z790-aorus', R.scorptec, 379,  0,    true,  3, 36),
    local('loc-z790ao-pg',  'mb-gigabyte-z790-aorus', R.pccg,     389,  9.90, true,  4, 36),
    local('loc-z790ao-ple', 'mb-gigabyte-z790-aorus', R.ple,      375,  12,   true,  5, 36),
  ],
  'mb-asus-z790-tuf': [
    local('loc-z790tuf-sc',  'mb-asus-z790-tuf', R.scorptec, 299,  0,    true,  3, 36),
    local('loc-z790tuf-pg',  'mb-asus-z790-tuf', R.pccg,     309,  9.90, true,  4, 36),
    local('loc-z790tuf-um',  'mb-asus-z790-tuf', R.umart,    295,  0,    true,  3, 36),
  ],
  'mb-asus-rog-z790-extreme': [
    local('loc-z790ext-sc',  'mb-asus-rog-z790-extreme', R.scorptec, 899,  0,    true,  3, 36),
    local('loc-z790ext-pg',  'mb-asus-rog-z790-extreme', R.pccg,     919,  9.90, true,  4, 36),
    local('loc-z790ext-ple', 'mb-asus-rog-z790-extreme', R.ple,      895,  12,   false, 5, 36),
  ],

  // ── Additional RAM ────────────────────────────────────────────────────────
  'ram-kingston-ddr4-3200-16gb': [
    local('loc-kf3200-sc',  'ram-kingston-ddr4-3200-16gb', R.scorptec, 55,   0,    true,  3, 36),
    local('loc-kf3200-msy', 'ram-kingston-ddr4-3200-16gb', R.msy,      52,   0,    true,  2, 36),
    local('loc-kf3200-um',  'ram-kingston-ddr4-3200-16gb', R.umart,    49,   0,    true,  3, 36),
  ],
  'ram-gskill-ddr4-3600-32gb': [
    local('loc-rv3600-sc',  'ram-gskill-ddr4-3600-32gb', R.scorptec, 95,   0,    true,  3, 36),
    local('loc-rv3600-pg',  'ram-gskill-ddr4-3600-32gb', R.pccg,     99,   9.90, true,  4, 36),
    local('loc-rv3600-um',  'ram-gskill-ddr4-3600-32gb', R.umart,    92,   0,    true,  3, 36),
  ],
  'ram-corsair-ddr4-3200-64gb': [
    local('loc-cv3200-64-sc',  'ram-corsair-ddr4-3200-64gb', R.scorptec, 189,  0,    true,  3, 36),
    local('loc-cv3200-64-pg',  'ram-corsair-ddr4-3200-64gb', R.pccg,     199,  9.90, true,  4, 36),
    local('loc-cv3200-64-ple', 'ram-corsair-ddr4-3200-64gb', R.ple,      185,  12,   false, 5, 36),
  ],
  'ram-gskill-ddr5-5600-16gb': [
    local('loc-rs5600-sc',  'ram-gskill-ddr5-5600-16gb', R.scorptec, 79,   0,    true,  3, 36),
    local('loc-rs5600-msy', 'ram-gskill-ddr5-5600-16gb', R.msy,      75,   0,    true,  2, 36),
    local('loc-rs5600-um',  'ram-gskill-ddr5-5600-16gb', R.umart,    72,   0,    true,  3, 36),
  ],
  'ram-kingston-ddr5-6000-32gb': [
    local('loc-kf6000-sc',  'ram-kingston-ddr5-6000-32gb', R.scorptec, 129,  0,    true,  3, 36),
    local('loc-kf6000-pg',  'ram-kingston-ddr5-6000-32gb', R.pccg,     135,  9.90, true,  4, 36),
    local('loc-kf6000-um',  'ram-kingston-ddr5-6000-32gb', R.umart,    125,  0,    true,  3, 36),
  ],
  'ram-corsair-ddr5-6400-32gb': [
    local('loc-cd6400-sc',  'ram-corsair-ddr5-6400-32gb', R.scorptec, 229,  0,    true,  3, 36),
    local('loc-cd6400-pg',  'ram-corsair-ddr5-6400-32gb', R.pccg,     239,  9.90, true,  4, 36),
    local('loc-cd6400-ple', 'ram-corsair-ddr5-6400-32gb', R.ple,      225,  12,   true,  5, 36),
  ],
  'ram-gskill-ddr5-6000-64gb': [
    local('loc-tz6000-64-sc',  'ram-gskill-ddr5-6000-64gb', R.scorptec, 319,  0,    true,  3, 36),
    local('loc-tz6000-64-pg',  'ram-gskill-ddr5-6000-64gb', R.pccg,     329,  9.90, true,  4, 36),
    local('loc-tz6000-64-um',  'ram-gskill-ddr5-6000-64gb', R.umart,    315,  0,    false, 3, 36),
  ],

  // ── Additional GPUs ───────────────────────────────────────────────────────
  'gpu-rtx4060': [
    local('loc-4060-sc',  'gpu-rtx4060', R.scorptec, 469,  0,    true,  3, 36),
    local('loc-4060-pg',  'gpu-rtx4060', R.pccg,     479,  9.90, true,  4, 36),
    local('loc-4060-msy', 'gpu-rtx4060', R.msy,      465,  0,    true,  2, 36),
    local('loc-4060-um',  'gpu-rtx4060', R.umart,    462,  0,    true,  3, 36),
  ],
  'gpu-rtx4060ti': [
    local('loc-4060ti-sc',  'gpu-rtx4060ti', R.scorptec, 579,  0,    true,  3, 36),
    local('loc-4060ti-pg',  'gpu-rtx4060ti', R.pccg,     589,  9.90, true,  4, 36),
    local('loc-4060ti-um',  'gpu-rtx4060ti', R.umart,    575,  0,    true,  3, 36),
  ],
  'gpu-rtx4070tisuper': [
    local('loc-4070tis-sc',  'gpu-rtx4070tisuper', R.scorptec, 1049, 0,    true,  3, 36),
    local('loc-4070tis-pg',  'gpu-rtx4070tisuper', R.pccg,     1069, 9.90, true,  4, 36),
    local('loc-4070tis-ple', 'gpu-rtx4070tisuper', R.ple,      1045, 12,   true,  5, 36),
    local('loc-4070tis-um',  'gpu-rtx4070tisuper', R.umart,    1039, 0,    true,  3, 36),
  ],
  'gpu-rtx4080super': [
    local('loc-4080s-sc',  'gpu-rtx4080super', R.scorptec, 1299, 0,    true,  3, 36),
    local('loc-4080s-pg',  'gpu-rtx4080super', R.pccg,     1319, 9.90, true,  4, 36),
    local('loc-4080s-ple', 'gpu-rtx4080super', R.ple,      1295, 12,   true,  5, 36),
  ],
  'gpu-rtx4090': [
    local('loc-4090-sc',  'gpu-rtx4090', R.scorptec, 2399, 0,    true,  3, 36),
    local('loc-4090-pg',  'gpu-rtx4090', R.pccg,     2429, 9.90, true,  4, 36),
    local('loc-4090-ple', 'gpu-rtx4090', R.ple,      2395, 12,   true,  5, 36),
    local('loc-4090-um',  'gpu-rtx4090', R.umart,    2389, 0,    false, 3, 36),
  ],
  'gpu-rtx5070': [
    local('loc-5070-sc',  'gpu-rtx5070', R.scorptec, 879,  0,    true,  3, 36),
    local('loc-5070-pg',  'gpu-rtx5070', R.pccg,     899,  9.90, true,  4, 36),
    local('loc-5070-ple', 'gpu-rtx5070', R.ple,      875,  12,   true,  5, 36),
    local('loc-5070-um',  'gpu-rtx5070', R.umart,    869,  0,    true,  3, 36),
  ],
  'gpu-rtx5070ti': [
    local('loc-5070ti-sc',  'gpu-rtx5070ti', R.scorptec, 1149, 0,    true,  3, 36),
    local('loc-5070ti-pg',  'gpu-rtx5070ti', R.pccg,     1169, 9.90, true,  4, 36),
    local('loc-5070ti-um',  'gpu-rtx5070ti', R.umart,    1145, 0,    true,  3, 36),
  ],
  'gpu-rtx5080': [
    local('loc-5080-sc',  'gpu-rtx5080', R.scorptec, 1549, 0,    true,  3, 36),
    local('loc-5080-pg',  'gpu-rtx5080', R.pccg,     1579, 9.90, true,  4, 36),
    local('loc-5080-ple', 'gpu-rtx5080', R.ple,      1545, 12,   true,  5, 36),
  ],
  'gpu-rx7600': [
    local('loc-7600-sc',  'gpu-rx7600', R.scorptec, 349,  0,    true,  3, 36),
    local('loc-7600-pg',  'gpu-rx7600', R.pccg,     359,  9.90, true,  4, 36),
    local('loc-7600-msy', 'gpu-rx7600', R.msy,      345,  0,    true,  2, 36),
    local('loc-7600-um',  'gpu-rx7600', R.umart,    342,  0,    true,  3, 36),
  ],
  'gpu-rx7700xt': [
    local('loc-7700xt-sc',  'gpu-rx7700xt', R.scorptec, 469,  0,    true,  3, 36),
    local('loc-7700xt-pg',  'gpu-rx7700xt', R.pccg,     479,  9.90, true,  4, 36),
    local('loc-7700xt-um',  'gpu-rx7700xt', R.umart,    465,  0,    true,  3, 36),
  ],
  'gpu-rx7900xtx': [
    local('loc-7900xtx-sc',  'gpu-rx7900xtx', R.scorptec, 1149, 0,    true,  3, 36),
    local('loc-7900xtx-pg',  'gpu-rx7900xtx', R.pccg,     1169, 9.90, true,  4, 36),
    local('loc-7900xtx-ple', 'gpu-rx7900xtx', R.ple,      1145, 12,   true,  5, 36),
  ],
  'gpu-rx9070xt': [
    local('loc-9070xt-sc',  'gpu-rx9070xt', R.scorptec, 819,  0,    true,  3, 36),
    local('loc-9070xt-pg',  'gpu-rx9070xt', R.pccg,     839,  9.90, true,  4, 36),
    local('loc-9070xt-ple', 'gpu-rx9070xt', R.ple,      815,  12,   true,  5, 36),
    local('loc-9070xt-um',  'gpu-rx9070xt', R.umart,    809,  0,    true,  3, 36),
  ],
  'gpu-rx9070': [
    local('loc-9070-sc',  'gpu-rx9070', R.scorptec, 649,  0,    true,  3, 36),
    local('loc-9070-pg',  'gpu-rx9070', R.pccg,     659,  9.90, true,  4, 36),
    local('loc-9070-um',  'gpu-rx9070', R.umart,    645,  0,    true,  3, 36),
  ],

  // ── Additional Storage ────────────────────────────────────────────────────
  'ssd-wd-sn850x-2tb': [
    local('loc-sn850-2tb-sc',  'ssd-wd-sn850x-2tb', R.scorptec, 199,  0,    true,  3, 60),
    local('loc-sn850-2tb-pg',  'ssd-wd-sn850x-2tb', R.pccg,     209,  9.90, true,  4, 60),
    local('loc-sn850-2tb-um',  'ssd-wd-sn850x-2tb', R.umart,    195,  0,    true,  3, 60),
  ],
  'ssd-samsung-990pro-2tb': [
    local('loc-990p2-sc',  'ssd-samsung-990pro-2tb', R.scorptec, 229,  0,    true,  3, 60),
    local('loc-990p2-pg',  'ssd-samsung-990pro-2tb', R.pccg,     239,  9.90, true,  4, 60),
    local('loc-990p2-um',  'ssd-samsung-990pro-2tb', R.umart,    225,  0,    true,  3, 60),
  ],
  'ssd-crucial-t705-1tb': [
    local('loc-t705-1-sc',  'ssd-crucial-t705-1tb', R.scorptec, 149,  0,    true,  3, 60),
    local('loc-t705-1-pg',  'ssd-crucial-t705-1tb', R.pccg,     155,  9.90, true,  4, 60),
    local('loc-t705-1-msy', 'ssd-crucial-t705-1tb', R.msy,      145,  0,    true,  2, 60),
  ],
  'ssd-crucial-t705-2tb': [
    local('loc-t705-2-sc',  'ssd-crucial-t705-2tb', R.scorptec, 279,  0,    true,  3, 60),
    local('loc-t705-2-pg',  'ssd-crucial-t705-2tb', R.pccg,     289,  9.90, true,  4, 60),
    local('loc-t705-2-um',  'ssd-crucial-t705-2tb', R.umart,    275,  0,    false, 3, 60),
  ],
  'ssd-seagate-firecuda-530-2tb': [
    local('loc-fc530-sc',  'ssd-seagate-firecuda-530-2tb', R.scorptec, 219,  0,    true,  3, 60),
    local('loc-fc530-pg',  'ssd-seagate-firecuda-530-2tb', R.pccg,     229,  9.90, true,  4, 60),
    local('loc-fc530-ple', 'ssd-seagate-firecuda-530-2tb', R.ple,      215,  12,   true,  5, 60),
  ],
  'ssd-kingston-kc3000-1tb': [
    local('loc-kc3k-sc',  'ssd-kingston-kc3000-1tb', R.scorptec, 119,  0,    true,  3, 60),
    local('loc-kc3k-pg',  'ssd-kingston-kc3000-1tb', R.pccg,     125,  9.90, true,  4, 60),
    local('loc-kc3k-um',  'ssd-kingston-kc3000-1tb', R.umart,    115,  0,    true,  3, 60),
  ],
  'ssd-samsung-870evo-1tb': [
    local('loc-870evo-sc',  'ssd-samsung-870evo-1tb', R.scorptec, 99,   0,    true,  3, 60),
    local('loc-870evo-pg',  'ssd-samsung-870evo-1tb', R.pccg,     105,  9.90, true,  4, 60),
    local('loc-870evo-msy', 'ssd-samsung-870evo-1tb', R.msy,      95,   0,    true,  2, 60),
  ],
  'ssd-crucial-mx500-2tb': [
    local('loc-mx500-sc',  'ssd-crucial-mx500-2tb', R.scorptec, 119,  0,    true,  3, 60),
    local('loc-mx500-pg',  'ssd-crucial-mx500-2tb', R.pccg,     125,  9.90, true,  4, 60),
    local('loc-mx500-um',  'ssd-crucial-mx500-2tb', R.umart,    115,  0,    true,  3, 60),
  ],

  // ── Additional PSUs ───────────────────────────────────────────────────────
  'psu-corsair-rm650x': [
    local('loc-rm650-sc',  'psu-corsair-rm650x', R.scorptec, 149,  0,    true,  3, 120),
    local('loc-rm650-pg',  'psu-corsair-rm650x', R.pccg,     155,  9.90, true,  4, 120),
    local('loc-rm650-msy', 'psu-corsair-rm650x', R.msy,      145,  0,    true,  2, 120),
    local('loc-rm650-um',  'psu-corsair-rm650x', R.umart,    142,  0,    true,  3, 120),
  ],
  'psu-corsair-rm1000x': [
    local('loc-rm1000-sc',  'psu-corsair-rm1000x', R.scorptec, 259,  0,    true,  3, 120),
    local('loc-rm1000-pg',  'psu-corsair-rm1000x', R.pccg,     269,  9.90, true,  4, 120),
    local('loc-rm1000-ple', 'psu-corsair-rm1000x', R.ple,      255,  12,   true,  5, 120),
  ],
  'psu-seasonic-prime-850tx': [
    local('loc-tx850-sc',  'psu-seasonic-prime-850tx', R.scorptec, 299,  0,    true,  3, 144),
    local('loc-tx850-pg',  'psu-seasonic-prime-850tx', R.pccg,     309,  9.90, true,  4, 144),
    local('loc-tx850-um',  'psu-seasonic-prime-850tx', R.umart,    295,  0,    false, 3, 144),
  ],
  'psu-bequiet-straight-1000': [
    local('loc-bqsp12-sc',  'psu-bequiet-straight-1000', R.scorptec, 279,  0,    true,  3, 120),
    local('loc-bqsp12-pg',  'psu-bequiet-straight-1000', R.pccg,     289,  9.90, true,  4, 120),
    local('loc-bqsp12-ple', 'psu-bequiet-straight-1000', R.ple,      275,  12,   true,  5, 120),
  ],
  'psu-corsair-sf600': [
    local('loc-sf600-sc',  'psu-corsair-sf600', R.scorptec, 189,  0,    true,  3, 84),
    local('loc-sf600-pg',  'psu-corsair-sf600', R.pccg,     195,  9.90, true,  4, 84),
    local('loc-sf600-um',  'psu-corsair-sf600', R.umart,    185,  0,    true,  3, 84),
  ],
  'psu-lianli-sp850': [
    local('loc-sp850-sc',  'psu-lianli-sp850', R.scorptec, 199,  0,    true,  3, 84),
    local('loc-sp850-pg',  'psu-lianli-sp850', R.pccg,     205,  9.90, true,  4, 84),
    local('loc-sp850-ple', 'psu-lianli-sp850', R.ple,      195,  12,   false, 5, 84),
  ],

  // ── Additional Cases ──────────────────────────────────────────────────────
  'case-corsair-4000d': [
    local('loc-4000d-sc',  'case-corsair-4000d', R.scorptec, 129,  0,    true,  3, 24),
    local('loc-4000d-pg',  'case-corsair-4000d', R.pccg,     135,  9.90, true,  4, 24),
    local('loc-4000d-msy', 'case-corsair-4000d', R.msy,      125,  0,    true,  2, 24),
    local('loc-4000d-um',  'case-corsair-4000d', R.umart,    122,  0,    true,  3, 24),
  ],
  'case-phanteks-p400a': [
    local('loc-p400a-sc',  'case-phanteks-p400a', R.scorptec, 109,  0,    true,  3, 24),
    local('loc-p400a-pg',  'case-phanteks-p400a', R.pccg,     115,  9.90, true,  4, 24),
    local('loc-p400a-um',  'case-phanteks-p400a', R.umart,    105,  0,    true,  3, 24),
  ],
  'case-bequiet-pure-500dx': [
    local('loc-500dx-sc',  'case-bequiet-pure-500dx', R.scorptec, 149,  0,    true,  3, 24),
    local('loc-500dx-pg',  'case-bequiet-pure-500dx', R.pccg,     155,  9.90, true,  4, 24),
    local('loc-500dx-ple', 'case-bequiet-pure-500dx', R.ple,      145,  12,   true,  5, 24),
  ],
  'case-nzxt-h510': [
    local('loc-h510-sc',  'case-nzxt-h510', R.scorptec, 119,  0,    true,  3, 24),
    local('loc-h510-pg',  'case-nzxt-h510', R.pccg,     125,  9.90, true,  4, 24),
    local('loc-h510-msy', 'case-nzxt-h510', R.msy,      115,  0,    true,  2, 24),
  ],
  'case-lianli-lancool-216': [
    local('loc-lc216-sc',  'case-lianli-lancool-216', R.scorptec, 139,  0,    true,  3, 24),
    local('loc-lc216-pg',  'case-lianli-lancool-216', R.pccg,     145,  9.90, true,  4, 24),
    local('loc-lc216-um',  'case-lianli-lancool-216', R.umart,    135,  0,    true,  3, 24),
  ],
  'case-coolermaster-nr400': [
    local('loc-nr400-sc',  'case-coolermaster-nr400', R.scorptec, 89,   0,    true,  3, 24),
    local('loc-nr400-msy', 'case-coolermaster-nr400', R.msy,      85,   0,    true,  2, 24),
    local('loc-nr400-um',  'case-coolermaster-nr400', R.umart,    82,   0,    true,  3, 24),
  ],
  'case-coolermaster-nr200p': [
    local('loc-nr200p-sc',  'case-coolermaster-nr200p', R.scorptec, 129,  0,    true,  3, 24),
    local('loc-nr200p-pg',  'case-coolermaster-nr200p', R.pccg,     135,  9.90, true,  4, 24),
    local('loc-nr200p-um',  'case-coolermaster-nr200p', R.umart,    125,  0,    true,  3, 24),
  ],
  'case-lianli-tu150': [
    local('loc-tu150-sc',  'case-lianli-tu150', R.scorptec, 169,  0,    true,  3, 24),
    local('loc-tu150-pg',  'case-lianli-tu150', R.pccg,     175,  9.90, true,  4, 24),
    local('loc-tu150-ple', 'case-lianli-tu150', R.ple,      165,  12,   false, 5, 24),
  ],

  // ── Additional Coolers ────────────────────────────────────────────────────
  'cooler-noctua-nhd15s': [
    local('loc-nhd15s-sc',  'cooler-noctua-nhd15s', R.scorptec, 115,  0,    true,  3, 72),
    local('loc-nhd15s-pg',  'cooler-noctua-nhd15s', R.pccg,     119,  9.90, true,  4, 72),
    local('loc-nhd15s-um',  'cooler-noctua-nhd15s', R.umart,    112,  0,    true,  3, 72),
  ],
  'cooler-deepcool-ak620': [
    local('loc-ak620-sc',  'cooler-deepcool-ak620', R.scorptec, 69,   0,    true,  3, 36),
    local('loc-ak620-pg',  'cooler-deepcool-ak620', R.pccg,     72,   9.90, true,  4, 36),
    local('loc-ak620-msy', 'cooler-deepcool-ak620', R.msy,      65,   0,    true,  2, 36),
    local('loc-ak620-um',  'cooler-deepcool-ak620', R.umart,    62,   0,    true,  3, 36),
  ],
  'cooler-thermalright-pa120-se': [
    local('loc-pa120-sc',  'cooler-thermalright-pa120-se', R.scorptec, 49,   0,    true,  3, 36),
    local('loc-pa120-msy', 'cooler-thermalright-pa120-se', R.msy,      45,   0,    true,  2, 36),
    local('loc-pa120-um',  'cooler-thermalright-pa120-se', R.umart,    42,   0,    true,  3, 36),
  ],
  'cooler-bequiet-darkrock-pro4': [
    local('loc-drp4-sc',  'cooler-bequiet-darkrock-pro4', R.scorptec, 99,   0,    true,  3, 36),
    local('loc-drp4-pg',  'cooler-bequiet-darkrock-pro4', R.pccg,     105,  9.90, true,  4, 36),
    local('loc-drp4-ple', 'cooler-bequiet-darkrock-pro4', R.ple,      95,   12,   true,  5, 36),
  ],
  'cooler-arctic-lf3-240': [
    local('loc-lf3240-sc',  'cooler-arctic-lf3-240', R.scorptec, 89,   0,    true,  3, 72),
    local('loc-lf3240-pg',  'cooler-arctic-lf3-240', R.pccg,     95,   9.90, true,  4, 72),
    local('loc-lf3240-msy', 'cooler-arctic-lf3-240', R.msy,      85,   0,    true,  2, 72),
  ],
  'cooler-arctic-lf3-360': [
    local('loc-lf3360-sc',  'cooler-arctic-lf3-360', R.scorptec, 109,  0,    true,  3, 72),
    local('loc-lf3360-pg',  'cooler-arctic-lf3-360', R.pccg,     115,  9.90, true,  4, 72),
    local('loc-lf3360-um',  'cooler-arctic-lf3-360', R.umart,    105,  0,    true,  3, 72),
  ],
  'cooler-corsair-h150i-elite': [
    local('loc-h150i-sc',  'cooler-corsair-h150i-elite', R.scorptec, 249,  0,    true,  3, 60),
    local('loc-h150i-pg',  'cooler-corsair-h150i-elite', R.pccg,     259,  9.90, true,  4, 60),
    local('loc-h150i-ple', 'cooler-corsair-h150i-elite', R.ple,      245,  12,   true,  5, 60),
  ],
  'cooler-nzxt-kraken-360': [
    local('loc-krak360-sc',  'cooler-nzxt-kraken-360', R.scorptec, 209,  0,    true,  3, 36),
    local('loc-krak360-pg',  'cooler-nzxt-kraken-360', R.pccg,     219,  9.90, true,  4, 36),
    local('loc-krak360-um',  'cooler-nzxt-kraken-360', R.umart,    205,  0,    true,  3, 36),
  ],
  'cooler-deepcool-ls720': [
    local('loc-ls720-sc',  'cooler-deepcool-ls720', R.scorptec, 129,  0,    true,  3, 36),
    local('loc-ls720-pg',  'cooler-deepcool-ls720', R.pccg,     135,  9.90, true,  4, 36),
    local('loc-ls720-um',  'cooler-deepcool-ls720', R.umart,    125,  0,    true,  3, 36),
  ],

  // ── Additional Fans ───────────────────────────────────────────────────────
  'fan-noctua-nf-p14s-redux': [
    local('loc-nfp14-sc',  'fan-noctua-nf-p14s-redux', R.scorptec, 25,   0,    true,  3, 72),
    local('loc-nfp14-pg',  'fan-noctua-nf-p14s-redux', R.pccg,     28,   9.90, true,  4, 72),
    local('loc-nfp14-um',  'fan-noctua-nf-p14s-redux', R.umart,    24,   0,    true,  3, 72),
  ],
  'fan-arctic-p14': [
    local('loc-p14-sc',  'fan-arctic-p14', R.scorptec, 25,   0,    true,  3, 24),
    local('loc-p14-msy', 'fan-arctic-p14', R.msy,      22,   0,    true,  2, 24),
    local('loc-p14-um',  'fan-arctic-p14', R.umart,    19,   0,    true,  3, 24),
  ],
  'fan-corsair-ll120-3pack': [
    local('loc-ll120-sc',  'fan-corsair-ll120-3pack', R.scorptec, 79,   0,    true,  3, 24),
    local('loc-ll120-pg',  'fan-corsair-ll120-3pack', R.pccg,     85,   9.90, true,  4, 24),
    local('loc-ll120-msy', 'fan-corsair-ll120-3pack', R.msy,      75,   0,    true,  2, 24),
  ],
  'fan-lianli-uni-sl-3pack': [
    local('loc-unifan-sc',  'fan-lianli-uni-sl-3pack', R.scorptec, 79,   0,    true,  3, 24),
    local('loc-unifan-pg',  'fan-lianli-uni-sl-3pack', R.pccg,     85,   9.90, true,  4, 24),
    local('loc-unifan-ple', 'fan-lianli-uni-sl-3pack', R.ple,      75,   12,   true,  5, 24),
  ],
  'fan-bequiet-silent-wings-4': [
    local('loc-sw4-sc',  'fan-bequiet-silent-wings-4', R.scorptec, 25,   0,    true,  3, 36),
    local('loc-sw4-pg',  'fan-bequiet-silent-wings-4', R.pccg,     28,   9.90, true,  4, 36),
    local('loc-sw4-um',  'fan-bequiet-silent-wings-4', R.umart,    24,   0,    true,  3, 36),
  ],
  'fan-thermalright-tl-c12-3pack': [
    local('loc-tlc12-sc',  'fan-thermalright-tl-c12-3pack', R.scorptec, 25,   0,    true,  3, 12),
    local('loc-tlc12-msy', 'fan-thermalright-tl-c12-3pack', R.msy,      22,   0,    true,  2, 12),
    local('loc-tlc12-um',  'fan-thermalright-tl-c12-3pack', R.umart,    19,   0,    true,  3, 12),
  ],

  // ── AIB GPU variants ──────────────────────────────────────────────────────
  'gpu-msi-4090-gaming-x-trio': [
    local('loc-msi4090gx-sc',  'gpu-msi-4090-gaming-x-trio', R.scorptec, 2449, 0,    true,  3, 36),
    local('loc-msi4090gx-pg',  'gpu-msi-4090-gaming-x-trio', R.pccg,     2469, 9.90, true,  4, 36),
    local('loc-msi4090gx-ple', 'gpu-msi-4090-gaming-x-trio', R.ple,      2445, 12,   true,  5, 36),
    local('loc-msi4090gx-um',  'gpu-msi-4090-gaming-x-trio', R.umart,    2439, 0,    false, 3, 36),
  ],
  'gpu-gigabyte-4090-aorus-xtreme': [
    local('loc-gb4090ax-sc',  'gpu-gigabyte-4090-aorus-xtreme', R.scorptec, 2549, 0,    true,  3, 36),
    local('loc-gb4090ax-pg',  'gpu-gigabyte-4090-aorus-xtreme', R.pccg,     2569, 9.90, true,  4, 36),
    local('loc-gb4090ax-ple', 'gpu-gigabyte-4090-aorus-xtreme', R.ple,      2545, 12,   true,  5, 36),
  ],
  'gpu-asus-4090-tuf-gaming': [
    local('loc-asus4090tuf-sc',  'gpu-asus-4090-tuf-gaming', R.scorptec, 2499, 0,    true,  3, 36),
    local('loc-asus4090tuf-pg',  'gpu-asus-4090-tuf-gaming', R.pccg,     2519, 9.90, true,  4, 36),
    local('loc-asus4090tuf-um',  'gpu-asus-4090-tuf-gaming', R.umart,    2489, 0,    true,  3, 36),
  ],
  'gpu-msi-4080s-gaming-x-slim': [
    local('loc-msi4080slim-sc',  'gpu-msi-4080s-gaming-x-slim', R.scorptec, 1279, 0,    true,  3, 36),
    local('loc-msi4080slim-pg',  'gpu-msi-4080s-gaming-x-slim', R.pccg,     1299, 9.90, true,  4, 36),
    local('loc-msi4080slim-msy', 'gpu-msi-4080s-gaming-x-slim', R.msy,      1269, 0,    true,  2, 36),
    local('loc-msi4080slim-um',  'gpu-msi-4080s-gaming-x-slim', R.umart,    1265, 0,    true,  3, 36),
  ],
  'gpu-gigabyte-9070xt-aorus': [
    local('loc-gb9070ax-sc',  'gpu-gigabyte-9070xt-aorus', R.scorptec, 849,  0,    true,  3, 36),
    local('loc-gb9070ax-pg',  'gpu-gigabyte-9070xt-aorus', R.pccg,     869,  9.90, true,  4, 36),
    local('loc-gb9070ax-ple', 'gpu-gigabyte-9070xt-aorus', R.ple,      845,  12,   true,  5, 36),
    local('loc-gb9070ax-um',  'gpu-gigabyte-9070xt-aorus', R.umart,    839,  0,    true,  3, 36),
  ],
  'gpu-asus-9070xt-rog-strix': [
    local('loc-rog9070xt-sc',  'gpu-asus-9070xt-rog-strix', R.scorptec, 879,  0,    true,  3, 36),
    local('loc-rog9070xt-pg',  'gpu-asus-9070xt-rog-strix', R.pccg,     899,  9.90, true,  4, 36),
    local('loc-rog9070xt-ple', 'gpu-asus-9070xt-rog-strix', R.ple,      875,  12,   true,  5, 36),
  ],
  'gpu-msi-9070-mech': [
    local('loc-msi9070m-sc',  'gpu-msi-9070-mech', R.scorptec, 639,  0,    true,  3, 36),
    local('loc-msi9070m-pg',  'gpu-msi-9070-mech', R.pccg,     649,  9.90, true,  4, 36),
    local('loc-msi9070m-msy', 'gpu-msi-9070-mech', R.msy,      635,  0,    true,  2, 36),
    local('loc-msi9070m-um',  'gpu-msi-9070-mech', R.umart,    632,  0,    true,  3, 36),
  ],
  'gpu-gigabyte-5080-gaming-oc': [
    local('loc-gb5080goc-sc',  'gpu-gigabyte-5080-gaming-oc', R.scorptec, 1569, 0,    true,  3, 36),
    local('loc-gb5080goc-pg',  'gpu-gigabyte-5080-gaming-oc', R.pccg,     1589, 9.90, true,  4, 36),
    local('loc-gb5080goc-ple', 'gpu-gigabyte-5080-gaming-oc', R.ple,      1565, 12,   true,  5, 36),
    local('loc-gb5080goc-um',  'gpu-gigabyte-5080-gaming-oc', R.umart,    1559, 0,    false, 3, 36),
  ],
  'gpu-asus-5070ti-rog-strix': [
    local('loc-rog5070ti-sc',  'gpu-asus-5070ti-rog-strix', R.scorptec, 1189, 0,    true,  3, 36),
    local('loc-rog5070ti-pg',  'gpu-asus-5070ti-rog-strix', R.pccg,     1209, 9.90, true,  4, 36),
    local('loc-rog5070ti-ple', 'gpu-asus-5070ti-rog-strix', R.ple,      1185, 12,   true,  5, 36),
    local('loc-rog5070ti-um',  'gpu-asus-5070ti-rog-strix', R.umart,    1179, 0,    true,  3, 36),
  ],
  'gpu-sapphire-rx7800xt-nitro': [
    local('loc-sap7800n-sc',  'gpu-sapphire-rx7800xt-nitro', R.scorptec, 679,  0,    true,  3, 36),
    local('loc-sap7800n-pg',  'gpu-sapphire-rx7800xt-nitro', R.pccg,     689,  9.90, true,  4, 36),
    local('loc-sap7800n-ple', 'gpu-sapphire-rx7800xt-nitro', R.ple,      675,  12,   true,  5, 36),
    local('loc-sap7800n-um',  'gpu-sapphire-rx7800xt-nitro', R.umart,    669,  0,    true,  3, 36),
  ],

  // ── New PSUs ──────────────────────────────────────────────────────────────
  'psu-seasonic-focus-gx-850': [
    local('loc-ssgx850-sc',  'psu-seasonic-focus-gx-850', R.scorptec, 189,  0,    true,  3, 120),
    local('loc-ssgx850-pg',  'psu-seasonic-focus-gx-850', R.pccg,     195,  9.90, true,  4, 120),
    local('loc-ssgx850-ple', 'psu-seasonic-focus-gx-850', R.ple,      185,  12,   true,  5, 120),
    local('loc-ssgx850-um',  'psu-seasonic-focus-gx-850', R.umart,    182,  0,    true,  3, 120),
  ],
  'psu-evga-850-g6': [
    local('loc-evga850-sc',  'psu-evga-850-g6', R.scorptec, 179,  0,    true,  3, 120),
    local('loc-evga850-pg',  'psu-evga-850-g6', R.pccg,     185,  9.90, true,  4, 120),
    local('loc-evga850-msy', 'psu-evga-850-g6', R.msy,      175,  0,    true,  2, 120),
    local('loc-evga850-um',  'psu-evga-850-g6', R.umart,    172,  0,    true,  3, 120),
  ],
  'psu-bequiet-dark-power-13-1000': [
    local('loc-dp13-sc',  'psu-bequiet-dark-power-13-1000', R.scorptec, 349,  0,    true,  3, 120),
    local('loc-dp13-pg',  'psu-bequiet-dark-power-13-1000', R.pccg,     359,  9.90, true,  4, 120),
    local('loc-dp13-ple', 'psu-bequiet-dark-power-13-1000', R.ple,      345,  12,   true,  5, 120),
  ],
  'psu-corsair-hx1000i': [
    local('loc-hx1000i-sc',  'psu-corsair-hx1000i', R.scorptec, 329,  0,    true,  3, 120),
    local('loc-hx1000i-pg',  'psu-corsair-hx1000i', R.pccg,     339,  9.90, true,  4, 120),
    local('loc-hx1000i-ple', 'psu-corsair-hx1000i', R.ple,      325,  12,   true,  5, 120),
    local('loc-hx1000i-um',  'psu-corsair-hx1000i', R.umart,    322,  0,    false, 3, 120),
  ],

  // ── New Cases ─────────────────────────────────────────────────────────────
  'case-fractal-torrent': [
    local('loc-torrent-sc',  'case-fractal-torrent', R.scorptec, 199,  0,    true,  3, 24),
    local('loc-torrent-pg',  'case-fractal-torrent', R.pccg,     205,  9.90, true,  4, 24),
    local('loc-torrent-ple', 'case-fractal-torrent', R.ple,      195,  12,   true,  5, 24),
    local('loc-torrent-um',  'case-fractal-torrent', R.umart,    192,  0,    true,  3, 24),
  ],
  'case-lian-li-o11d-evo': [
    local('loc-o11evo-sc',  'case-lian-li-o11d-evo', R.scorptec, 219,  0,    true,  3, 24),
    local('loc-o11evo-pg',  'case-lian-li-o11d-evo', R.pccg,     225,  9.90, true,  4, 24),
    local('loc-o11evo-ple', 'case-lian-li-o11d-evo', R.ple,      215,  12,   true,  5, 24),
    local('loc-o11evo-msy', 'case-lian-li-o11d-evo', R.msy,      212,  0,    true,  2, 24),
    local('loc-o11evo-um',  'case-lian-li-o11d-evo', R.umart,    209,  0,    true,  3, 24),
  ],
  'case-nzxt-h9-flow': [
    local('loc-h9flow-sc',  'case-nzxt-h9-flow', R.scorptec, 229,  0,    true,  3, 24),
    local('loc-h9flow-pg',  'case-nzxt-h9-flow', R.pccg,     235,  9.90, true,  4, 24),
    local('loc-h9flow-um',  'case-nzxt-h9-flow', R.umart,    225,  0,    true,  3, 24),
  ],
  'case-antec-df800': [
    local('loc-df800-sc',  'case-antec-df800', R.scorptec, 159,  0,    true,  3, 24),
    local('loc-df800-pg',  'case-antec-df800', R.pccg,     165,  9.90, true,  4, 24),
    local('loc-df800-msy', 'case-antec-df800', R.msy,      155,  0,    true,  2, 24),
    local('loc-df800-um',  'case-antec-df800', R.umart,    152,  0,    true,  3, 24),
  ],

  // ── New 4TB Storage ───────────────────────────────────────────────────────
  'ssd-wd-sn850x-4tb': [
    local('loc-sn850-4tb-sc',  'ssd-wd-sn850x-4tb', R.scorptec, 349,  0,    true,  3, 60),
    local('loc-sn850-4tb-pg',  'ssd-wd-sn850x-4tb', R.pccg,     359,  9.90, true,  4, 60),
    local('loc-sn850-4tb-msy', 'ssd-wd-sn850x-4tb', R.msy,      345,  0,    true,  2, 60),
    local('loc-sn850-4tb-um',  'ssd-wd-sn850x-4tb', R.umart,    342,  0,    true,  3, 60),
  ],
  'ssd-samsung-990pro-4tb': [
    local('loc-990p4-sc',  'ssd-samsung-990pro-4tb', R.scorptec, 379,  0,    true,  3, 60),
    local('loc-990p4-pg',  'ssd-samsung-990pro-4tb', R.pccg,     389,  9.90, true,  4, 60),
    local('loc-990p4-um',  'ssd-samsung-990pro-4tb', R.umart,    375,  0,    true,  3, 60),
  ],
  'ssd-seagate-firecuda-530-4tb': [
    local('loc-fc530-4tb-sc',  'ssd-seagate-firecuda-530-4tb', R.scorptec, 369,  0,    true,  3, 60),
    local('loc-fc530-4tb-pg',  'ssd-seagate-firecuda-530-4tb', R.pccg,     379,  9.90, true,  4, 60),
    local('loc-fc530-4tb-ple', 'ssd-seagate-firecuda-530-4tb', R.ple,      365,  12,   true,  5, 60),
  ],
  'ssd-crucial-t705-4tb': [
    local('loc-t705-4tb-sc',  'ssd-crucial-t705-4tb', R.scorptec, 449,  0,    true,  3, 60),
    local('loc-t705-4tb-pg',  'ssd-crucial-t705-4tb', R.pccg,     459,  9.90, true,  4, 60),
    local('loc-t705-4tb-um',  'ssd-crucial-t705-4tb', R.umart,    445,  0,    false, 3, 60),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// EBAY AU LISTINGS
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_EBAY_LISTINGS: Record<string, Listing[]> = {

  'cpu-r5-5600': [
    ebay('eb-r55600-1', 'cpu-r5-5600', ebaySeller('eb-s1', 'oz_tech_deals',    4.9, 2840, 99.1), 155, 0,  'new',  4, 12),
    ebay('eb-r55600-2', 'cpu-r5-5600', ebaySeller('eb-s2', 'au_cpu_warehouse', 4.7, 920,  97.8), 148, 5,  'used', 5,  0),
  ],
  'cpu-r7-7600': [
    ebay('eb-r77600-1', 'cpu-r7-7600', ebaySeller('eb-s3', 'techbargains_au',  4.8, 1540, 98.4), 265, 0,  'new',  4, 12),
    ebay('eb-r77600-2', 'cpu-r7-7600', ebaySeller('eb-s4', 'pc_recyclers_au',  4.6, 430,  96.2), 255, 9,  'used', 6,  0),
  ],
  'cpu-r7-7800x3d': [
    ebay('eb-7800x3d-1', 'cpu-r7-7800x3d', ebaySeller('eb-s5', 'gpu_world_au',      4.9, 1120, 99.2), 530, 0,  'new',  4, 12),
    ebay('eb-7800x3d-2', 'cpu-r7-7800x3d', ebaySeller('eb-s6', 'premium_pc_parts',  4.7, 660,  97.5), 510, 0,  'used', 5,  0),
  ],

  'mb-asus-b550f': [
    ebay('eb-b550f-1', 'mb-asus-b550f', ebaySeller('eb-s7', 'mobo_deals_au', 4.8, 780, 98.1), 230, 15, 'new', 5, 12),
  ],
  'mb-msi-b650m': [
    ebay('eb-b650m-1', 'mb-msi-b650m', ebaySeller('eb-s8', 'au_board_shop', 4.7, 340, 97.2), 180, 12, 'new', 5, 12),
  ],
  'mb-gigabyte-x570': [
    ebay('eb-x570-1', 'mb-gigabyte-x570', ebaySeller('eb-s9', 'clearance_computers', 4.6, 290, 96.5), 270, 20, 'used', 6, 0),
  ],

  'ram-corsair-ddr4-3600': [
    ebay('eb-ddr4-1', 'ram-corsair-ddr4-3600', ebaySeller('eb-s10', 'memory_express_au', 4.9, 2100, 99.0), 62, 0, 'new', 4, 12),
    ebay('eb-ddr4-2', 'ram-corsair-ddr4-3600', ebaySeller('eb-s11', 'pc_parts_au',       4.6, 510,  96.8), 55, 5, 'used', 5, 0),
  ],
  'ram-gskill-ddr5-6000': [
    ebay('eb-ddr5-1', 'ram-gskill-ddr5-6000', ebaySeller('eb-s12', 'gskill_reseller_au', 4.8, 890, 98.5), 138, 0, 'new', 4, 12),
  ],

  'gpu-rtx4070': [
    ebay('eb-4070-1', 'gpu-rtx4070', ebaySeller('eb-s13', 'gpu_world_au',      4.8, 1120, 98.4), 850, 20, 'used', 5, 0),
    ebay('eb-4070-2', 'gpu-rtx4070', ebaySeller('eb-s14', 'graphics_deals_au', 4.9, 3200, 99.3), 860, 0,  'new',  4, 12),
  ],
  'gpu-rtx4070super': [
    ebay('eb-4070s-1', 'gpu-rtx4070super', ebaySeller('eb-s15', 'nvidia_resellers_au', 4.8, 740, 98.1), 780, 15, 'new',  4, 12),
    ebay('eb-4070s-2', 'gpu-rtx4070super', ebaySeller('eb-s16', 'au_tech_deals',       4.6, 360, 96.0), 749, 0,  'used', 5, 0),
  ],
  'gpu-rx7800xt': [
    ebay('eb-7800xt-1', 'gpu-rx7800xt', ebaySeller('eb-s17', 'amd_deals_au',   4.8, 920, 98.6), 620, 15, 'used', 5, 0),
    ebay('eb-7800xt-2', 'gpu-rx7800xt', ebaySeller('eb-s18', 'pc_clearance_au', 4.7, 480, 97.2), 635, 0,  'new',  4, 12),
  ],

  'ssd-wd-sn850x-1tb': [
    ebay('eb-sn850-1', 'ssd-wd-sn850x-1tb', ebaySeller('eb-s19', 'storage_deals_au', 4.9, 1840, 99.1), 115, 0, 'new', 4, 12),
    ebay('eb-sn850-2', 'ssd-wd-sn850x-1tb', ebaySeller('eb-s20', 'au_ssd_store',     4.7, 490,  97.3), 105, 5, 'used', 5, 0),
  ],
  'ssd-samsung-990pro-1tb': [
    ebay('eb-990p-1', 'ssd-samsung-990pro-1tb', ebaySeller('eb-s21', 'samsung_au_reseller', 4.8, 1220, 98.4), 138, 0, 'new', 4, 12),
  ],

  'psu-corsair-rm850x': [
    ebay('eb-rm850-1', 'psu-corsair-rm850x', ebaySeller('eb-s22', 'psu_deals_au',   4.8, 670, 98.2), 172, 15, 'new',  5, 12),
    ebay('eb-rm850-2', 'psu-corsair-rm850x', ebaySeller('eb-s23', 'au_power_depot', 4.6, 280, 96.5), 159, 0,  'used', 6, 0),
  ],
  'psu-seasonic-focus-750': [
    ebay('eb-ss750-1', 'psu-seasonic-focus-750', ebaySeller('eb-s24', 'seasonic_aus', 4.9, 530, 99.0), 165, 10, 'new', 4, 12),
  ],

  'case-lianli-o11d': [
    ebay('eb-o11d-1', 'case-lianli-o11d', ebaySeller('eb-s25', 'case_kingdom_au', 4.8, 830, 98.3), 180, 20, 'new',  5, 12),
    ebay('eb-o11d-2', 'case-lianli-o11d', ebaySeller('eb-s26', 'au_build_parts',  4.6, 310, 96.1), 165, 0,  'used', 6, 0),
  ],
  'case-fractal-north': [
    ebay('eb-north-1', 'case-fractal-north', ebaySeller('eb-s27', 'fractal_deals_au', 4.8, 540, 98.5), 162, 15, 'new', 5, 12),
  ],
  'case-ncase-m1': [
    ebay('eb-m1-1', 'case-ncase-m1', ebaySeller('eb-s28', 'sff_parts_au', 4.9, 280, 99.2), 235, 20, 'used', 5, 0),
  ],

  'cooler-noctua-nhd15': [
    ebay('eb-nhd15-1', 'cooler-noctua-nhd15', ebaySeller('eb-s29', 'noctua_au_seller', 4.9, 1200, 99.1), 118, 10, 'new', 4, 12),
    ebay('eb-nhd15-2', 'cooler-noctua-nhd15', ebaySeller('eb-s30', 'cooling_deals_au', 4.7, 360,  97.0), 109, 0,  'used', 5, 0),
  ],
  'cooler-noctua-nhu12a': [
    ebay('eb-nhu12-1', 'cooler-noctua-nhu12a', ebaySeller('eb-s31', 'cooler_express', 4.8, 790, 98.4), 98, 0, 'new', 4, 12),
  ],
  'cooler-id-frost': [
    ebay('eb-frost-1', 'cooler-id-frost', ebaySeller('eb-s32', 'budget_cooling_au', 4.7, 420, 97.5), 49, 5, 'new', 5, 12),
  ],

  'fan-noctua-nf-a12x25': [
    ebay('eb-nfa12-1', 'fan-noctua-nf-a12x25', ebaySeller('eb-s33', 'fan_deals_au', 4.8, 650, 98.2), 35, 5, 'new', 4, 12),
  ],
  'fan-arctic-p12': [
    ebay('eb-p12-1', 'fan-arctic-p12', ebaySeller('eb-s34', 'arctic_au', 4.9, 1100, 99.0), 9, 5, 'new', 4, 12),
  ],

  // ── Additional CPUs ───────────────────────────────────────────────────────
  'cpu-r7-5700x': [
    ebay('eb-r75700x-1', 'cpu-r7-5700x', ebaySeller('eb-s35', 'au_tech_deals',   4.8, 1240, 98.6), 162, 0,  'new',  4, 12),
    ebay('eb-r75700x-2', 'cpu-r7-5700x', ebaySeller('eb-s36', 'pc_recyclers_au', 4.6, 380,  96.4), 149, 5,  'used', 5,  0),
  ],
  'cpu-r9-5900x': [
    ebay('eb-r95900x-1', 'cpu-r9-5900x', ebaySeller('eb-s37', 'oz_tech_deals', 4.8, 890, 98.2), 275, 0, 'new', 4, 12),
    ebay('eb-r95900x-2', 'cpu-r9-5900x', ebaySeller('eb-s38', 'au_cpu_warehouse', 4.6, 320, 96.5), 255, 9, 'used', 5, 0),
  ],
  'cpu-r7-7600x': [
    ebay('eb-r77600x-1', 'cpu-r7-7600x', ebaySeller('eb-s39', 'techbargains_au', 4.8, 780, 98.1), 232, 0, 'new', 4, 12),
  ],
  'cpu-r7-7700x': [
    ebay('eb-r77700x-1', 'cpu-r7-7700x', ebaySeller('eb-s40', 'gpu_world_au', 4.8, 540, 98.3), 349, 0, 'new', 4, 12),
  ],
  'cpu-r9-7900x': [
    ebay('eb-r97900x-1', 'cpu-r9-7900x', ebaySeller('eb-s41', 'au_build_parts', 4.7, 410, 97.8), 409, 10, 'new', 5, 12),
  ],
  'cpu-r7-9700x': [
    ebay('eb-r79700x-1', 'cpu-r7-9700x', ebaySeller('eb-s42', 'premium_pc_parts', 4.9, 380, 99.1), 428, 0, 'new', 4, 12),
  ],
  'cpu-r9-9900x': [
    ebay('eb-r99900x-1', 'cpu-r9-9900x', ebaySeller('eb-s43', 'gpu_world_au', 4.8, 290, 98.0), 529, 0, 'new', 4, 12),
  ],
  'cpu-r9-9950x': [
    ebay('eb-r99950x-1', 'cpu-r9-9950x', ebaySeller('eb-s44', 'premium_pc_parts', 4.9, 180, 99.0), 769, 0, 'new', 4, 12),
  ],
  'cpu-i5-13600k': [
    ebay('eb-i513600k-1', 'cpu-i5-13600k', ebaySeller('eb-s45', 'intel_deals_au', 4.8, 1560, 98.5), 309, 0,  'new',  4, 12),
    ebay('eb-i513600k-2', 'cpu-i5-13600k', ebaySeller('eb-s46', 'au_cpu_shop',    4.6, 490,  96.8), 289, 5,  'used', 5,  0),
  ],
  'cpu-i7-13700k': [
    ebay('eb-i713700k-1', 'cpu-i7-13700k', ebaySeller('eb-s47', 'intel_deals_au', 4.8, 920, 98.4), 429, 0, 'new', 4, 12),
  ],
  'cpu-i5-14600k': [
    ebay('eb-i514600k-1', 'cpu-i5-14600k', ebaySeller('eb-s48', 'au_tech_deals',   4.8, 820, 98.3), 329, 0, 'new',  4, 12),
    ebay('eb-i514600k-2', 'cpu-i5-14600k', ebaySeller('eb-s49', 'pc_recyclers_au', 4.6, 240, 96.2), 309, 5, 'used', 5,  0),
  ],
  'cpu-i7-14700k': [
    ebay('eb-i714700k-1', 'cpu-i7-14700k', ebaySeller('eb-s50', 'intel_deals_au', 4.8, 650, 98.1), 479, 0, 'new', 4, 12),
  ],
  'cpu-i9-14900k': [
    ebay('eb-i914900k-1', 'cpu-i9-14900k', ebaySeller('eb-s51', 'premium_pc_parts', 4.9, 480, 99.0), 669, 0, 'new', 4, 12),
  ],

  // ── Additional Motherboards ───────────────────────────────────────────────
  'mb-msi-b550-gaming-plus': [
    ebay('eb-b550tp-1', 'mb-msi-b550-gaming-plus', ebaySeller('eb-s52', 'mobo_deals_au', 4.7, 520, 97.5), 179, 12, 'new', 5, 12),
  ],
  'mb-asus-x570-tuf': [
    ebay('eb-x570tuf-1', 'mb-asus-x570-tuf', ebaySeller('eb-s53', 'au_board_shop', 4.7, 310, 97.0), 249, 15, 'new', 5, 12),
  ],
  'mb-gigabyte-b650e-elite': [
    ebay('eb-b650e-1', 'mb-gigabyte-b650e-elite', ebaySeller('eb-s54', 'gpu_world_au', 4.8, 290, 98.0), 259, 12, 'new', 5, 12),
  ],
  'mb-asus-b760m-plus': [
    ebay('eb-b760m-1', 'mb-asus-b760m-plus', ebaySeller('eb-s55', 'intel_boards_au', 4.7, 380, 97.3), 162, 10, 'new', 5, 12),
  ],
  'mb-gigabyte-z790-aorus': [
    ebay('eb-z790ao-1', 'mb-gigabyte-z790-aorus', ebaySeller('eb-s56', 'au_build_parts', 4.8, 240, 98.1), 355, 15, 'new', 5, 12),
  ],

  // ── Additional RAM ────────────────────────────────────────────────────────
  'ram-kingston-ddr4-3200-16gb': [
    ebay('eb-kf3200-1', 'ram-kingston-ddr4-3200-16gb', ebaySeller('eb-s57', 'memory_express_au', 4.9, 1800, 99.0), 48, 0, 'new', 4, 12),
  ],
  'ram-gskill-ddr4-3600-32gb': [
    ebay('eb-rv3600-1', 'ram-gskill-ddr4-3600-32gb', ebaySeller('eb-s58', 'pc_parts_au', 4.8, 920, 98.2), 88, 0, 'new', 4, 12),
  ],
  'ram-gskill-ddr5-5600-16gb': [
    ebay('eb-rs5600-1', 'ram-gskill-ddr5-5600-16gb', ebaySeller('eb-s59', 'gskill_reseller_au', 4.8, 620, 98.0), 72, 0, 'new', 4, 12),
  ],
  'ram-kingston-ddr5-6000-32gb': [
    ebay('eb-kf6000-1', 'ram-kingston-ddr5-6000-32gb', ebaySeller('eb-s60', 'memory_express_au', 4.9, 510, 99.1), 118, 0, 'new', 4, 12),
  ],
  'ram-corsair-ddr5-6400-32gb': [
    ebay('eb-cd6400-1', 'ram-corsair-ddr5-6400-32gb', ebaySeller('eb-s61', 'pc_parts_au', 4.8, 280, 98.1), 215, 0, 'new', 4, 12),
  ],

  // ── Additional GPUs ───────────────────────────────────────────────────────
  'gpu-rtx4060': [
    ebay('eb-4060-1', 'gpu-rtx4060', ebaySeller('eb-s62', 'graphics_deals_au', 4.9, 2800, 99.0), 449, 0,  'new',  4, 12),
    ebay('eb-4060-2', 'gpu-rtx4060', ebaySeller('eb-s63', 'au_tech_deals',     4.6, 630,  96.5), 429, 15, 'used', 5,  0),
  ],
  'gpu-rtx4060ti': [
    ebay('eb-4060ti-1', 'gpu-rtx4060ti', ebaySeller('eb-s64', 'gpu_world_au', 4.8, 990, 98.3), 559, 20, 'new', 5, 12),
    ebay('eb-4060ti-2', 'gpu-rtx4060ti', ebaySeller('eb-s65', 'au_tech_deals', 4.6, 380, 96.1), 539, 0, 'used', 5, 0),
  ],
  'gpu-rtx4070tisuper': [
    ebay('eb-4070tis-1', 'gpu-rtx4070tisuper', ebaySeller('eb-s66', 'nvidia_resellers_au', 4.8, 620, 98.2), 999, 25, 'new',  5, 12),
    ebay('eb-4070tis-2', 'gpu-rtx4070tisuper', ebaySeller('eb-s67', 'au_gpu_depot',        4.6, 280, 96.0), 969, 0,  'used', 5,  0),
  ],
  'gpu-rtx4080super': [
    ebay('eb-4080s-1', 'gpu-rtx4080super', ebaySeller('eb-s68', 'graphics_deals_au', 4.8, 490, 98.1), 1249, 25, 'new', 5, 12),
  ],
  'gpu-rtx4090': [
    ebay('eb-4090-1', 'gpu-rtx4090', ebaySeller('eb-s69', 'premium_pc_parts', 4.9, 380, 99.1), 2299, 30, 'new',  5, 12),
    ebay('eb-4090-2', 'gpu-rtx4090', ebaySeller('eb-s70', 'au_gpu_depot',     4.7, 210, 97.5), 2199, 0,  'used', 6,  0),
  ],
  'gpu-rtx5070': [
    ebay('eb-5070-1', 'gpu-rtx5070', ebaySeller('eb-s71', 'nvidia_resellers_au', 4.8, 720, 98.0), 849, 20, 'new', 5, 12),
  ],
  'gpu-rtx5070ti': [
    ebay('eb-5070ti-1', 'gpu-rtx5070ti', ebaySeller('eb-s72', 'graphics_deals_au', 4.8, 480, 97.9), 1099, 25, 'new', 5, 12),
  ],
  'gpu-rtx5080': [
    ebay('eb-5080-1', 'gpu-rtx5080', ebaySeller('eb-s73', 'premium_pc_parts', 4.9, 290, 99.0), 1489, 30, 'new', 5, 12),
  ],
  'gpu-rx7600': [
    ebay('eb-7600-1', 'gpu-rx7600', ebaySeller('eb-s74', 'amd_deals_au', 4.8, 1340, 98.5), 329, 15, 'new',  4, 12),
    ebay('eb-7600-2', 'gpu-rx7600', ebaySeller('eb-s75', 'pc_clearance_au', 4.6, 480, 96.2), 309, 0, 'used', 5,  0),
  ],
  'gpu-rx7700xt': [
    ebay('eb-7700xt-1', 'gpu-rx7700xt', ebaySeller('eb-s76', 'amd_deals_au', 4.8, 820, 98.3), 449, 15, 'new',  4, 12),
    ebay('eb-7700xt-2', 'gpu-rx7700xt', ebaySeller('eb-s77', 'au_gpu_depot', 4.6, 290, 96.0), 429, 0,  'used', 5,  0),
  ],
  'gpu-rx7900xtx': [
    ebay('eb-7900xtx-1', 'gpu-rx7900xtx', ebaySeller('eb-s78', 'amd_deals_au',     4.8, 490, 98.0), 1099, 25, 'new',  5, 12),
    ebay('eb-7900xtx-2', 'gpu-rx7900xtx', ebaySeller('eb-s79', 'pc_clearance_au',  4.6, 180, 96.0), 1049, 0,  'used', 6,  0),
  ],
  'gpu-rx9070xt': [
    ebay('eb-9070xt-1', 'gpu-rx9070xt', ebaySeller('eb-s80', 'amd_deals_au', 4.8, 590, 98.2), 789, 15, 'new', 5, 12),
  ],
  'gpu-rx9070': [
    ebay('eb-9070-1', 'gpu-rx9070', ebaySeller('eb-s81', 'amd_deals_au', 4.8, 710, 98.1), 619, 15, 'new', 5, 12),
  ],

  // ── Additional Storage ────────────────────────────────────────────────────
  'ssd-wd-sn850x-2tb': [
    ebay('eb-sn850-2tb-1', 'ssd-wd-sn850x-2tb', ebaySeller('eb-s82', 'storage_deals_au', 4.9, 980, 99.0), 185, 0, 'new', 4, 12),
  ],
  'ssd-samsung-990pro-2tb': [
    ebay('eb-990p2-1', 'ssd-samsung-990pro-2tb', ebaySeller('eb-s83', 'samsung_au_reseller', 4.8, 780, 98.3), 212, 0, 'new', 4, 12),
  ],
  'ssd-crucial-t705-1tb': [
    ebay('eb-t705-1-1', 'ssd-crucial-t705-1tb', ebaySeller('eb-s84', 'storage_deals_au', 4.8, 560, 98.1), 138, 0, 'new', 4, 12),
  ],
  'ssd-seagate-firecuda-530-2tb': [
    ebay('eb-fc530-1', 'ssd-seagate-firecuda-530-2tb', ebaySeller('eb-s85', 'au_ssd_store', 4.7, 440, 97.2), 199, 0, 'new', 4, 12),
  ],
  'ssd-kingston-kc3000-1tb': [
    ebay('eb-kc3k-1', 'ssd-kingston-kc3000-1tb', ebaySeller('eb-s86', 'storage_deals_au', 4.8, 680, 98.0), 109, 0, 'new', 4, 12),
  ],
  'ssd-samsung-870evo-1tb': [
    ebay('eb-870evo-1', 'ssd-samsung-870evo-1tb', ebaySeller('eb-s87', 'au_ssd_store', 4.9, 2100, 99.1), 89, 0, 'new', 4, 12),
    ebay('eb-870evo-2', 'ssd-samsung-870evo-1tb', ebaySeller('eb-s88', 'storage_deals_au', 4.6, 490, 96.5), 79, 5, 'used', 5, 0),
  ],
  'ssd-crucial-mx500-2tb': [
    ebay('eb-mx500-1', 'ssd-crucial-mx500-2tb', ebaySeller('eb-s89', 'au_ssd_store', 4.8, 820, 98.2), 109, 0, 'new', 4, 12),
  ],

  // ── Additional PSUs ───────────────────────────────────────────────────────
  'psu-corsair-rm650x': [
    ebay('eb-rm650-1', 'psu-corsair-rm650x', ebaySeller('eb-s90', 'psu_deals_au', 4.8, 580, 98.1), 135, 10, 'new', 5, 12),
  ],
  'psu-corsair-rm1000x': [
    ebay('eb-rm1000-1', 'psu-corsair-rm1000x', ebaySeller('eb-s91', 'psu_deals_au', 4.8, 350, 98.0), 239, 15, 'new', 5, 12),
  ],
  'psu-seasonic-prime-850tx': [
    ebay('eb-tx850-1', 'psu-seasonic-prime-850tx', ebaySeller('eb-s92', 'seasonic_aus', 4.9, 280, 99.0), 279, 10, 'new', 4, 12),
  ],
  'psu-corsair-sf600': [
    ebay('eb-sf600-1', 'psu-corsair-sf600', ebaySeller('eb-s93', 'psu_deals_au', 4.7, 290, 97.5), 172, 10, 'new', 5, 12),
  ],
  'psu-lianli-sp850': [
    ebay('eb-sp850-1', 'psu-lianli-sp850', ebaySeller('eb-s94', 'sfx_psu_au', 4.8, 210, 98.0), 182, 15, 'new', 5, 12),
  ],

  // ── Additional Cases ──────────────────────────────────────────────────────
  'case-corsair-4000d': [
    ebay('eb-4000d-1', 'case-corsair-4000d', ebaySeller('eb-s95', 'case_kingdom_au', 4.8, 1120, 98.4), 115, 20, 'new',  5, 12),
    ebay('eb-4000d-2', 'case-corsair-4000d', ebaySeller('eb-s96', 'au_build_parts',  4.6, 380,  96.0), 99,  0,  'used', 6,  0),
  ],
  'case-phanteks-p400a': [
    ebay('eb-p400a-1', 'case-phanteks-p400a', ebaySeller('eb-s97', 'case_kingdom_au', 4.8, 690, 98.2), 95, 15, 'new', 5, 12),
  ],
  'case-bequiet-pure-500dx': [
    ebay('eb-500dx-1', 'case-bequiet-pure-500dx', ebaySeller('eb-s98', 'au_build_parts', 4.7, 340, 97.5), 132, 20, 'new', 5, 12),
  ],
  'case-nzxt-h510': [
    ebay('eb-h510-1', 'case-nzxt-h510', ebaySeller('eb-s99', 'case_kingdom_au', 4.7, 560, 97.8), 105, 15, 'new', 5, 12),
  ],
  'case-coolermaster-nr200p': [
    ebay('eb-nr200p-1', 'case-coolermaster-nr200p', ebaySeller('eb-s100', 'sff_parts_au', 4.8, 490, 98.3), 115, 15, 'new', 5, 12),
    ebay('eb-nr200p-2', 'case-coolermaster-nr200p', ebaySeller('eb-s101', 'au_build_parts', 4.6, 190, 96.0), 99, 0, 'used', 6, 0),
  ],

  // ── Additional Coolers ────────────────────────────────────────────────────
  'cooler-noctua-nhd15s': [
    ebay('eb-nhd15s-1', 'cooler-noctua-nhd15s', ebaySeller('eb-s102', 'noctua_au_seller', 4.9, 720, 99.1), 105, 10, 'new', 4, 12),
  ],
  'cooler-deepcool-ak620': [
    ebay('eb-ak620-1', 'cooler-deepcool-ak620', ebaySeller('eb-s103', 'cooling_deals_au', 4.8, 1380, 98.4), 62, 5, 'new', 4, 12),
  ],
  'cooler-thermalright-pa120-se': [
    ebay('eb-pa120-1', 'cooler-thermalright-pa120-se', ebaySeller('eb-s104', 'budget_cooling_au', 4.7, 890, 97.8), 42, 5, 'new', 4, 12),
  ],
  'cooler-arctic-lf3-240': [
    ebay('eb-lf3240-1', 'cooler-arctic-lf3-240', ebaySeller('eb-s105', 'cooler_express', 4.8, 680, 98.2), 82, 0, 'new', 4, 12),
  ],
  'cooler-arctic-lf3-360': [
    ebay('eb-lf3360-1', 'cooler-arctic-lf3-360', ebaySeller('eb-s106', 'cooler_express', 4.8, 490, 98.1), 99, 0, 'new', 4, 12),
  ],
  'cooler-corsair-h150i-elite': [
    ebay('eb-h150i-1', 'cooler-corsair-h150i-elite', ebaySeller('eb-s107', 'noctua_au_seller', 4.8, 580, 98.0), 229, 15, 'new', 5, 12),
  ],
  'cooler-nzxt-kraken-360': [
    ebay('eb-krak360-1', 'cooler-nzxt-kraken-360', ebaySeller('eb-s108', 'cooling_deals_au', 4.7, 390, 97.5), 189, 15, 'new', 5, 12),
  ],
  'cooler-deepcool-ls720': [
    ebay('eb-ls720-1', 'cooler-deepcool-ls720', ebaySeller('eb-s109', 'budget_cooling_au', 4.7, 340, 97.8), 115, 10, 'new', 4, 12),
  ],

  // ── Additional Fans ───────────────────────────────────────────────────────
  'fan-arctic-p14': [
    ebay('eb-p14-1', 'fan-arctic-p14', ebaySeller('eb-s110', 'arctic_au', 4.9, 780, 99.0), 22, 5, 'new', 4, 12),
  ],
  'fan-corsair-ll120-3pack': [
    ebay('eb-ll120-1', 'fan-corsair-ll120-3pack', ebaySeller('eb-s111', 'fan_deals_au', 4.8, 950, 98.3), 72, 5, 'new', 4, 12),
  ],
  'fan-lianli-uni-sl-3pack': [
    ebay('eb-unifan-1', 'fan-lianli-uni-sl-3pack', ebaySeller('eb-s112', 'lianli_au_store', 4.8, 620, 98.1), 69, 5, 'new', 4, 12),
  ],
  'fan-bequiet-silent-wings-4': [
    ebay('eb-sw4-1', 'fan-bequiet-silent-wings-4', ebaySeller('eb-s113', 'fan_deals_au', 4.8, 380, 98.0), 22, 5, 'new', 4, 12),
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// ALIEXPRESS LISTINGS
// Safe categories: cpu / cooler / case / fan
// Risky: gpu / motherboard / psu / ram / storage
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_ALIEXPRESS_LISTINGS: Record<string, Listing[]> = {

  // ── CPUs (safe) ───────────────────────────────────────────────────────────
  'cpu-r5-5600': [
    ali('ali-r55600-1', 'cpu-r5-5600', aliSeller('ali-s1', 'amd_cpu_official_store', 4.8, 8200, 24000), 129, 8, 18),
  ],
  'cpu-r7-7600': [
    ali('ali-r77600-1', 'cpu-r7-7600', aliSeller('ali-s2', 'ryzen_store_au', 4.7, 3100, 7800), 229, 10, 20),
  ],
  'cpu-r7-7800x3d': [
    ali('ali-7800x3d-1', 'cpu-r7-7800x3d', aliSeller('ali-s3', 'premium_amd_cn', 4.6, 1200, 2900), 469, 12, 22),
  ],

  // ── Coolers (safe) ────────────────────────────────────────────────────────
  'cooler-noctua-nhd15': [
    ali('ali-nhd15-1', 'cooler-noctua-nhd15', aliSeller('ali-s4', 'noctua_flagship_store', 4.9, 6800, 18000), 98, 8, 18),
  ],
  'cooler-noctua-nhu12a': [
    ali('ali-nhu12-1', 'cooler-noctua-nhu12a', aliSeller('ali-s5', 'noctua_flagship_store', 4.9, 6800, 18000), 82, 8, 18),
  ],
  'cooler-id-frost': [
    ali('ali-frost-1', 'cooler-id-frost', aliSeller('ali-s6', 'iceberg_thermal_store', 4.8, 5600, 12000), 39, 5, 18),
  ],

  // ── Cases (safe) ──────────────────────────────────────────────────────────
  'case-lianli-o11d': [
    ali('ali-o11d-1', 'case-lianli-o11d', aliSeller('ali-s7', 'lian_li_official_store', 4.9, 12000, 35000), 149, 25, 20),
  ],
  'case-fractal-north': [
    ali('ali-north-1', 'case-fractal-north', aliSeller('ali-s8', 'fractal_design_cn', 4.7, 2100, 4800), 139, 28, 25),
  ],
  'case-ncase-m1': [
    ali('ali-m1-1', 'case-ncase-m1', aliSeller('ali-s9', 'sff_cases_store', 4.6, 880, 1900), 189, 30, 28),
  ],

  // ── Fans (safe) ───────────────────────────────────────────────────────────
  'fan-noctua-nf-a12x25': [
    ali('ali-nfa12-1', 'fan-noctua-nf-a12x25', aliSeller('ali-s10', 'noctua_flagship_store', 4.9, 6800, 18000), 28, 4, 16),
  ],
  'fan-arctic-p12': [
    ali('ali-p12-1', 'fan-arctic-p12', aliSeller('ali-s11', 'arctic_official_cn', 4.8, 9400, 42000), 7, 3, 14),
  ],

  // ── GPUs (risky – shown with warning) ─────────────────────────────────────
  'gpu-rtx4070': [
    ali('ali-4070-1', 'gpu-rtx4070', aliSeller('ali-s12', 'pc_parts_cn_official', 4.2, 380, 820), 720, 30, 21),
  ],
  'gpu-rtx4070super': [
    ali('ali-4070s-1', 'gpu-rtx4070super', aliSeller('ali-s13', 'gpu_supply_cn', 4.1, 210, 490), 669, 35, 24),
  ],
  'gpu-rx7800xt': [
    ali('ali-7800xt-1', 'gpu-rx7800xt', aliSeller('ali-s14', 'amd_gpu_cn_store', 4.3, 560, 1100), 549, 30, 22),
  ],

  // ── RAM (risky) ───────────────────────────────────────────────────────────
  'ram-corsair-ddr4-3600': [
    ali('ali-ddr4-1', 'ram-corsair-ddr4-3600', aliSeller('ali-s15', 'memory_cn_store', 4.0, 290, 680), 42, 5, 20),
  ],
  'ram-gskill-ddr5-6000': [
    ali('ali-ddr5-1', 'ram-gskill-ddr5-6000', aliSeller('ali-s16', 'gskill_reseller_cn', 3.9, 140, 310), 99, 8, 25),
  ],

  // ── SSDs (risky) ──────────────────────────────────────────────────────────
  'ssd-wd-sn850x-1tb': [
    ali('ali-sn850-1', 'ssd-wd-sn850x-1tb', aliSeller('ali-s17', 'storage_cn_depot', 4.1, 1200, 3400), 89, 5, 20),
  ],
  'ssd-samsung-990pro-1tb': [
    ali('ali-990p-1', 'ssd-samsung-990pro-1tb', aliSeller('ali-s18', 'samsung_cn_official', 4.3, 8800, 22000), 99, 5, 18),
  ],

  // ── PSUs (risky) ──────────────────────────────────────────────────────────
  'psu-corsair-rm850x': [
    ali('ali-rm850-1', 'psu-corsair-rm850x', aliSeller('ali-s19', 'psu_supply_cn', 3.8, 180, 420), 129, 20, 28),
  ],
  'psu-corsair-sf750': [
    ali('ali-sf750-1', 'psu-corsair-sf750', aliSeller('ali-s20', 'sfx_psu_cn', 3.9, 95, 220), 159, 20, 30),
  ],
  'psu-seasonic-focus-750': [
    ali('ali-ss750-1', 'psu-seasonic-focus-750', aliSeller('ali-s21', 'seasonic_cn_depot', 4.0, 310, 750), 119, 18, 25),
  ],

  // ── Motherboards (risky) ──────────────────────────────────────────────────
  'mb-asus-b550f': [
    ali('ali-b550f-1', 'mb-asus-b550f', aliSeller('ali-s22', 'asus_cn_store', 4.0, 420, 980), 179, 18, 22),
  ],
  'mb-msi-b650m': [
    ali('ali-b650m-1', 'mb-msi-b650m', aliSeller('ali-s23', 'msi_board_cn', 3.8, 190, 430), 149, 18, 25),
  ],
  'mb-gigabyte-x570': [
    ali('ali-x570-1', 'mb-gigabyte-x570', aliSeller('ali-s24', 'gigabyte_cn_official', 4.1, 780, 1800), 219, 20, 22),
  ],

  // ── Additional CPUs (safe) ────────────────────────────────────────────────
  'cpu-r7-5700x': [
    ali('ali-r75700x-1', 'cpu-r7-5700x', aliSeller('ali-s25', 'amd_cpu_official_store', 4.8, 5600, 15000), 148, 8, 18),
  ],
  'cpu-r9-5900x': [
    ali('ali-r95900x-1', 'cpu-r9-5900x', aliSeller('ali-s26', 'premium_amd_cn', 4.7, 2200, 5400), 255, 10, 20),
  ],
  'cpu-r7-7600x': [
    ali('ali-r77600x-1', 'cpu-r7-7600x', aliSeller('ali-s27', 'ryzen_store_au', 4.7, 2800, 6900), 209, 10, 20),
  ],
  'cpu-r7-7700x': [
    ali('ali-r77700x-1', 'cpu-r7-7700x', aliSeller('ali-s28', 'premium_amd_cn', 4.6, 1800, 4200), 319, 12, 22),
  ],
  'cpu-r9-7900x': [
    ali('ali-r97900x-1', 'cpu-r9-7900x', aliSeller('ali-s29', 'premium_amd_cn', 4.6, 980, 2300), 375, 12, 22),
  ],
  'cpu-r7-9700x': [
    ali('ali-r79700x-1', 'cpu-r7-9700x', aliSeller('ali-s30', 'amd_cpu_official_store', 4.8, 1200, 2800), 395, 12, 22),
  ],
  'cpu-r9-9900x': [
    ali('ali-r99900x-1', 'cpu-r9-9900x', aliSeller('ali-s31', 'premium_amd_cn', 4.7, 680, 1500), 489, 12, 24),
  ],
  'cpu-i5-13600k': [
    ali('ali-i513600k-1', 'cpu-i5-13600k', aliSeller('ali-s32', 'intel_cn_official', 4.7, 6800, 18000), 279, 10, 20),
  ],
  'cpu-i7-13700k': [
    ali('ali-i713700k-1', 'cpu-i7-13700k', aliSeller('ali-s33', 'intel_cn_official', 4.7, 3200, 7800), 385, 10, 20),
  ],
  'cpu-i5-14600k': [
    ali('ali-i514600k-1', 'cpu-i5-14600k', aliSeller('ali-s34', 'intel_cn_official', 4.7, 4100, 9600), 295, 10, 20),
  ],
  'cpu-i7-14700k': [
    ali('ali-i714700k-1', 'cpu-i7-14700k', aliSeller('ali-s35', 'intel_cn_official', 4.7, 2400, 5800), 429, 10, 22),
  ],
  'cpu-i9-14900k': [
    ali('ali-i914900k-1', 'cpu-i9-14900k', aliSeller('ali-s36', 'premium_intel_cn', 4.6, 980, 2100), 589, 12, 24),
  ],

  // ── Additional Coolers (safe) ─────────────────────────────────────────────
  'cooler-noctua-nhd15s': [
    ali('ali-nhd15s-1', 'cooler-noctua-nhd15s', aliSeller('ali-s37', 'noctua_flagship_store', 4.9, 6800, 18000), 88, 8, 18),
  ],
  'cooler-deepcool-ak620': [
    ali('ali-ak620-1', 'cooler-deepcool-ak620', aliSeller('ali-s38', 'deepcool_official_store', 4.8, 12000, 38000), 52, 6, 16),
  ],
  'cooler-thermalright-pa120-se': [
    ali('ali-pa120-1', 'cooler-thermalright-pa120-se', aliSeller('ali-s39', 'thermalright_official', 4.9, 28000, 95000), 32, 5, 14),
  ],
  'cooler-bequiet-darkrock-pro4': [
    ali('ali-drp4-1', 'cooler-bequiet-darkrock-pro4', aliSeller('ali-s40', 'bequiet_cn_store', 4.7, 3200, 7800), 75, 8, 20),
  ],
  'cooler-arctic-lf3-240': [
    ali('ali-lf3240-1', 'cooler-arctic-lf3-240', aliSeller('ali-s41', 'arctic_official_cn', 4.8, 9400, 42000), 68, 6, 16),
  ],
  'cooler-arctic-lf3-360': [
    ali('ali-lf3360-1', 'cooler-arctic-lf3-360', aliSeller('ali-s42', 'arctic_official_cn', 4.8, 9400, 42000), 82, 6, 18),
  ],
  'cooler-corsair-h150i-elite': [
    ali('ali-h150i-1', 'cooler-corsair-h150i-elite', aliSeller('ali-s43', 'corsair_cn_official', 4.5, 1800, 3900), 189, 15, 24),
  ],
  'cooler-nzxt-kraken-360': [
    ali('ali-krak360-1', 'cooler-nzxt-kraken-360', aliSeller('ali-s44', 'nzxt_cn_store', 4.5, 1400, 3200), 159, 15, 24),
  ],
  'cooler-deepcool-ls720': [
    ali('ali-ls720-1', 'cooler-deepcool-ls720', aliSeller('ali-s45', 'deepcool_official_store', 4.8, 12000, 38000), 99, 8, 18),
  ],

  // ── Additional Cases (safe) ───────────────────────────────────────────────
  'case-corsair-4000d': [
    ali('ali-4000d-1', 'case-corsair-4000d', aliSeller('ali-s46', 'corsair_cn_official', 4.6, 2800, 6500), 99, 25, 22),
  ],
  'case-phanteks-p400a': [
    ali('ali-p400a-1', 'case-phanteks-p400a', aliSeller('ali-s47', 'phanteks_cn_store', 4.7, 3200, 7800), 79, 22, 22),
  ],
  'case-nzxt-h510': [
    ali('ali-h510-1', 'case-nzxt-h510', aliSeller('ali-s48', 'nzxt_cn_store', 4.6, 2100, 5000), 85, 22, 24),
  ],
  'case-coolermaster-nr200p': [
    ali('ali-nr200p-1', 'case-coolermaster-nr200p', aliSeller('ali-s49', 'coolermaster_official_cn', 4.7, 5600, 14000), 95, 25, 22),
  ],
  'case-lianli-lancool-216': [
    ali('ali-lc216-1', 'case-lianli-lancool-216', aliSeller('ali-s50', 'lian_li_official_store', 4.9, 12000, 35000), 109, 25, 20),
  ],

  // ── Additional Fans (safe) ────────────────────────────────────────────────
  'fan-arctic-p14': [
    ali('ali-p14-1', 'fan-arctic-p14', aliSeller('ali-s51', 'arctic_official_cn', 4.8, 9400, 42000), 18, 3, 14),
  ],
  'fan-corsair-ll120-3pack': [
    ali('ali-ll120-1', 'fan-corsair-ll120-3pack', aliSeller('ali-s52', 'corsair_cn_official', 4.5, 1900, 4200), 59, 5, 18),
  ],
  'fan-lianli-uni-sl-3pack': [
    ali('ali-unifan-1', 'fan-lianli-uni-sl-3pack', aliSeller('ali-s53', 'lian_li_official_store', 4.9, 12000, 35000), 59, 5, 18),
  ],
  'fan-bequiet-silent-wings-4': [
    ali('ali-sw4-1', 'fan-bequiet-silent-wings-4', aliSeller('ali-s54', 'bequiet_cn_store', 4.7, 3200, 7800), 18, 4, 18),
  ],
  'fan-thermalright-tl-c12-3pack': [
    ali('ali-tlc12-1', 'fan-thermalright-tl-c12-3pack', aliSeller('ali-s55', 'thermalright_official', 4.9, 28000, 95000), 16, 3, 14),
  ],
  'fan-noctua-nf-p14s-redux': [
    ali('ali-nfp14-1', 'fan-noctua-nf-p14s-redux', aliSeller('ali-s56', 'noctua_flagship_store', 4.9, 6800, 18000), 19, 4, 16),
  ],

  // ── Additional GPUs (risky) ───────────────────────────────────────────────
  'gpu-rtx4060': [
    ali('ali-4060-1', 'gpu-rtx4060', aliSeller('ali-s57', 'pc_parts_cn_official', 4.2, 520, 1100), 379, 25, 22),
  ],
  'gpu-rtx4060ti': [
    ali('ali-4060ti-1', 'gpu-rtx4060ti', aliSeller('ali-s58', 'gpu_supply_cn', 4.1, 310, 680), 479, 28, 24),
  ],
  'gpu-rtx4090': [
    ali('ali-4090-1', 'gpu-rtx4090', aliSeller('ali-s59', 'pc_parts_cn_official', 3.9, 180, 360), 1999, 40, 28),
  ],
  'gpu-rx7600': [
    ali('ali-7600-1', 'gpu-rx7600', aliSeller('ali-s60', 'amd_gpu_cn_store', 4.3, 890, 1900), 289, 25, 20),
  ],
  'gpu-rx7700xt': [
    ali('ali-7700xt-1', 'gpu-rx7700xt', aliSeller('ali-s61', 'amd_gpu_cn_store', 4.2, 620, 1300), 379, 28, 22),
  ],
  'gpu-rx9070xt': [
    ali('ali-9070xt-1', 'gpu-rx9070xt', aliSeller('ali-s62', 'amd_gpu_cn_store', 4.2, 290, 580), 679, 32, 26),
  ],
  'gpu-rx9070': [
    ali('ali-9070-1', 'gpu-rx9070', aliSeller('ali-s63', 'amd_gpu_cn_store', 4.2, 340, 690), 539, 30, 24),
  ],

  // ── Additional RAM (risky) ────────────────────────────────────────────────
  'ram-kingston-ddr4-3200-16gb': [
    ali('ali-kf3200-1', 'ram-kingston-ddr4-3200-16gb', aliSeller('ali-s64', 'memory_cn_store', 4.0, 380, 850), 36, 5, 18),
  ],
  'ram-gskill-ddr5-5600-16gb': [
    ali('ali-rs5600-1', 'ram-gskill-ddr5-5600-16gb', aliSeller('ali-s65', 'gskill_reseller_cn', 3.9, 220, 490), 55, 6, 22),
  ],
  'ram-kingston-ddr5-6000-32gb': [
    ali('ali-kf6000-1', 'ram-kingston-ddr5-6000-32gb', aliSeller('ali-s66', 'memory_cn_store', 4.0, 310, 680), 89, 8, 22),
  ],

  // ── Additional Motherboards (risky) ──────────────────────────────────────
  'mb-msi-b550-gaming-plus': [
    ali('ali-b550tp-1', 'mb-msi-b550-gaming-plus', aliSeller('ali-s67', 'msi_board_cn', 3.8, 320, 720), 149, 18, 22),
  ],
  'mb-gigabyte-b650e-elite': [
    ali('ali-b650e-1', 'mb-gigabyte-b650e-elite', aliSeller('ali-s68', 'gigabyte_cn_official', 4.1, 480, 1100), 219, 20, 24),
  ],
  'mb-asus-b760m-plus': [
    ali('ali-b760m-1', 'mb-asus-b760m-plus', aliSeller('ali-s69', 'asus_cn_store', 4.0, 560, 1300), 139, 18, 22),
  ],
  'mb-gigabyte-z790-aorus': [
    ali('ali-z790ao-1', 'mb-gigabyte-z790-aorus', aliSeller('ali-s70', 'gigabyte_cn_official', 4.1, 390, 880), 299, 22, 26),
  ],

  // ── Additional SSDs (risky) ───────────────────────────────────────────────
  'ssd-wd-sn850x-2tb': [
    ali('ali-sn850-2tb-1', 'ssd-wd-sn850x-2tb', aliSeller('ali-s71', 'storage_cn_depot', 4.1, 880, 2100), 149, 5, 20),
  ],
  'ssd-samsung-990pro-2tb': [
    ali('ali-990p2-1', 'ssd-samsung-990pro-2tb', aliSeller('ali-s72', 'samsung_cn_official', 4.3, 8800, 22000), 169, 5, 18),
  ],
  'ssd-crucial-t705-1tb': [
    ali('ali-t705-1', 'ssd-crucial-t705-1tb', aliSeller('ali-s73', 'storage_cn_depot', 4.0, 420, 980), 109, 5, 20),
  ],
  'ssd-kingston-kc3000-1tb': [
    ali('ali-kc3k-1', 'ssd-kingston-kc3000-1tb', aliSeller('ali-s74', 'storage_cn_depot', 4.1, 680, 1600), 85, 5, 20),
  ],
  'ssd-samsung-870evo-1tb': [
    ali('ali-870evo-1', 'ssd-samsung-870evo-1tb', aliSeller('ali-s75', 'samsung_cn_official', 4.3, 8800, 22000), 72, 5, 18),
  ],
  'ssd-crucial-mx500-2tb': [
    ali('ali-mx500-1', 'ssd-crucial-mx500-2tb', aliSeller('ali-s76', 'storage_cn_depot', 4.0, 520, 1200), 85, 5, 20),
  ],
}

