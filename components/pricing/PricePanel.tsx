'use client'

import { useState, useEffect } from 'react'
import { X, Star, ShieldCheck, ShieldAlert, Truck, CheckCircle2, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PriceScore, WarrantyRisk } from '@/lib/types'
import { formatAUD } from '@/lib/utils'

interface Props {
  partId: string
  onClose: () => void
}

function WarrantyBadge({ risk }: { risk: WarrantyRisk }) {
  const map: Record<WarrantyRisk, { label: string; variant: string }> = {
    low: { label: 'Full Warranty', variant: 'success' },
    medium: { label: 'Limited Warranty', variant: 'warning' },
    high: { label: 'Warranty Risk', variant: 'danger' },
    'very-high': { label: 'No Warranty', variant: 'danger' },
  }
  const { label, variant } = map[risk]
  return <Badge variant={variant as any} className="text-xs">{label}</Badge>
}

function VerdictBadge({ verdict }: { verdict: PriceScore['verdict'] }) {
  const map = {
    excellent: { label: 'Excellent', variant: 'success' },
    good: { label: 'Good Value', variant: 'info' },
    fair: { label: 'Fair', variant: 'secondary' },
    avoid: { label: 'Avoid', variant: 'danger' },
  }
  const { label, variant } = map[verdict]
  return <Badge variant={variant as any} className="text-xs font-semibold">{label}</Badge>
}

function SourceBadge({ source }: { source: string }) {
  if (source === 'local') return <Badge variant="success" className="text-xs">AU Retailer</Badge>
  if (source === 'ebay') return <Badge variant="info" className="text-xs">eBay AU</Badge>
  return <Badge variant="warning" className="text-xs">AliExpress</Badge>
}

export default function PricePanel({ partId, onClose }: Props) {
  const [scores, setScores] = useState<PriceScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/pricing?partId=${encodeURIComponent(partId)}`)
      .then(r => r.json())
      .then(d => { setScores(d.scores ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [partId])

  return (
    <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">Price Comparison</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-white/5 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : scores.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No listings found for this part</p>
      ) : (
        <div className="space-y-2">
          {scores.map((score, i) => (
            <div
              key={score.listing.id}
              className={`relative rounded-lg border p-3 space-y-2 ${
                i === 0 ? 'border-green-500/40 bg-green-950/20' : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              {i === 0 && (
                <div className="absolute -top-2 left-3">
                  <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">Best Price</span>
                </div>
              )}
              <div className="flex items-start justify-between gap-2 mt-1">
                <div>
                  <p className="font-medium text-white text-sm">{score.listing.retailer.name}</p>
                  {score.listing.seller && (
                    <p className="text-xs text-gray-400">@{score.listing.seller.username}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{formatAUD(score.listing.price)}</p>
                  {score.listing.shipping > 0 && (
                    <p className="text-xs text-gray-400">+{formatAUD(score.listing.shipping)} shipping</p>
                  )}
                  {score.listing.shipping === 0 && (
                    <p className="text-xs text-green-400">Free shipping</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <SourceBadge source={score.listing.source} />
                <VerdictBadge verdict={score.verdict} />
                <WarrantyBadge risk={score.listing.warrantyRisk} />
                {score.listing.inStock === false && (
                  <Badge variant="danger" className="text-xs">Out of Stock</Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  {score.listing.deliveryDays && (
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {score.listing.deliveryDays} days
                    </span>
                  )}
                  {score.listing.seller?.trustScore && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      {score.listing.seller.trustScore.rating.toFixed(1)} ({score.listing.seller.trustScore.reviewCount.toLocaleString()})
                    </span>
                  )}
                </div>
                <span className="font-medium text-white/70">
                  Landed: {formatAUD(score.listing.landedCost)}
                </span>
              </div>

              {score.listing.source === 'aliexpress' && (
                <div className="flex items-start gap-1.5 bg-yellow-950/30 border border-yellow-500/20 rounded p-2">
                  <ShieldAlert className="h-3.5 w-3.5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-300">{score.summary}</p>
                </div>
              )}

              {score.listing.affiliateUrl && score.listing.affiliateUrl !== '#' && (
                <a
                  href={score.listing.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                >
                  View deal <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}

          <p className="text-xs text-gray-600 text-center pt-1">
            Prices are indicative. Verify on retailer websites.
          </p>
        </div>
      )}
    </div>
  )
}
