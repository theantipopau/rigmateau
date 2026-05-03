'use client'

import { useRef } from 'react'
import Image from 'next/image'
import {
  Cpu, Monitor, HardDrive, Zap, Box, Thermometer, MemoryStick,
  CheckCircle2, AlertTriangle, Shield, Share2, Download, ExternalLink,
  Gauge, Bolt
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { checkCompatibility } from '@/lib/compatibility'
import { estimatePerformance, PERFORMANCE_DISCLAIMER } from '@/lib/rendering/performance'
import type { Build, BuildState, Part } from '@/lib/types'
import { formatAUD } from '@/lib/utils'

interface DBBuild {
  id: string
  slug: string
  name: string
  purpose?: string | null
  isPublic: boolean
  totalPrice?: number | null
  estimatedWatts?: number | null
  buildParts: Array<{
    partId: string
    quantity: number
    part: Part & { category: { slug: string; name: string } }
  }>
}

interface Props {
  build: DBBuild
}

const SLOT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cpu: Cpu,
  motherboard: MemoryStick,
  ram: MemoryStick,
  gpu: Monitor,
  storage: HardDrive,
  psu: Zap,
  case: Box,
  cooler: Thermometer,
  fan: Gauge,
}

const FPS_TIERS: Record<string, { label: string; color: string }> = {
  ultra: { label: 'Ultra', color: 'text-purple-400' },
  high: { label: 'High', color: 'text-blue-400' },
  mid: { label: 'Mid', color: 'text-green-400' },
  entry: { label: 'Entry', color: 'text-yellow-400' },
}

export default function BuildShowcase({ build }: Props) {
  const showcaseRef = useRef<HTMLDivElement>(null)

  // Reconstruct build state
  const buildState: BuildState = {}
  for (const bp of build.buildParts) {
    const slug = bp.part.category.slug as keyof BuildState
    buildState[slug] = bp.part as any
  }

  const compatibility = checkCompatibility(buildState)
  const performance = estimatePerformance(buildState)

  function handleShare() {
    navigator.clipboard.writeText(window.location.href)
    alert('Build link copied to clipboard!')
  }

  function handlePrint() {
    window.print()
  }

  const overallColor = {
    compatible: 'text-green-400',
    warning: 'text-yellow-400',
    incompatible: 'text-red-400',
    unknown: 'text-gray-400',
  }[compatibility.overallStatus]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-gray-950/95 backdrop-blur sticky top-0 z-30 print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <Image src="/headerlogo.PNG" alt="RigMate AU" width={160} height={36} className="h-9 w-auto" priority />
          </a>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleShare} className="border-white/20 text-white hover:bg-white/10">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button size="sm" onClick={handlePrint} className="bg-orange-600 hover:bg-orange-500">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </nav>

      <div ref={showcaseRef} className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-gray-900 border border-white/10 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
          <div className="relative space-y-4">
            {build.purpose && (
              <Badge variant="info" className="text-xs uppercase tracking-wider">{build.purpose}</Badge>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{build.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <span className={`font-medium ${overallColor}`}>
                  {compatibility.overallStatus === 'compatible' ? '✓ Fully Compatible' :
                   compatibility.overallStatus === 'warning' ? '⚠ Minor Warnings' :
                   compatibility.overallStatus === 'incompatible' ? '✗ Incompatible Parts' :
                   '? Compatibility Unknown'}
                </span>
              </span>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1.5">
                <Bolt className="h-4 w-4 text-yellow-400" />
                {compatibility.estimatedWatts}W estimated
              </span>
              {build.totalPrice && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="font-semibold text-white">{formatAUD(build.totalPrice)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parts List */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-semibold text-gray-100">Components</h2>
            {build.buildParts.map(bp => {
              const Icon = SLOT_ICONS[bp.part.category.slug] ?? Cpu
              return (
                <div key={bp.partId} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{bp.part.category.name}</p>
                    <p className="font-medium text-white text-sm mt-0.5">{bp.part.name}</p>
                    {bp.part.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{bp.part.description}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0">
                    {bp.part.socket && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{bp.part.socket}</span>}
                    {bp.part.ramType && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{bp.part.ramType}</span>}
                    {bp.part.tdpWatts && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{bp.part.tdpWatts}W</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Compatibility Summary */}
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Compatibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {compatibility.results.slice(0, 6).map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {r.status === 'compatible' && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />}
                    {r.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />}
                    {r.status === 'incompatible' && <Shield className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                    <div>
                      <p className="text-xs font-medium text-gray-200">{r.rule}</p>
                      {r.status !== 'compatible' && <p className="text-xs text-gray-400">{r.explanation}</p>}
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Est. Power</span>
                    <span>{compatibility.estimatedWatts}W</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">Min PSU</span>
                    <span>{compatibility.recommendedPsuWatts}W</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            {performance && (
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Est. Performance</CardTitle>
                    <Badge variant="secondary" className={`text-xs ${FPS_TIERS[performance.tier]?.color ?? ''}`}>
                      {FPS_TIERS[performance.tier]?.label} Tier
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    { res: '1080p', fps: performance.fps1080p },
                    { res: '1440p', fps: performance.fps1440p },
                    { res: '4K', fps: performance.fps4K },
                  ].map(({ res, fps }) => fps && (
                    <div key={res}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">{res}</span>
                        <span className="font-medium text-white">~{fps} FPS</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${Math.min(100, (fps / 200) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-gray-600 pt-1">{PERFORMANCE_DISCLAIMER}</p>
                </CardContent>
              </Card>
            )}

            {/* Marketplace Trust */}
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Import Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-400 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <span>CPU, coolers, fans – safe to import from AliExpress</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                  <span>GPU, PSU, RAM, SSD – buy from AU retailers for warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400 shrink-0" />
                  <span>eBay AU – check seller rating and order count before buying</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Disclaimer (for PDF) */}
        <div className="border-t border-white/10 pt-6 text-xs text-gray-600 text-center space-y-1">
          <p>Generated by <strong className="text-gray-400">RigMate AU</strong> – Australian PC Build Platform</p>
          <p>Prices and availability are indicative only. Verify with retailers before purchasing.</p>
          <p>{PERFORMANCE_DISCLAIMER}</p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white; color: black; }
          nav { display: none !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  )
}
