'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Cpu,
  Monitor,
  HardDrive,
  Zap,
  Box,
  Thermometer,
  MemoryStick,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Share2,
  Download,
  Gauge,
  Bolt,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { checkCompatibility } from '@/lib/compatibility'
import { estimatePerformance, PERFORMANCE_DISCLAIMER } from '@/lib/rendering/performance'
import { isBuildSlotKey, type BuildState, type SavedBuild } from '@/lib/types'
import { formatAUD } from '@/lib/utils'

interface Props {
  build: SavedBuild
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

  const buildState: BuildState = {}
  for (const buildPart of build.buildParts) {
    if (isBuildSlotKey(buildPart.part.category.slug)) {
      buildState[buildPart.part.category.slug] = buildPart.part
    }
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

  const compatibilityLabel = {
    compatible: 'Fully Compatible',
    warning: 'Minor Warnings',
    incompatible: 'Incompatible Parts',
    unknown: 'Compatibility Unknown',
  }[compatibility.overallStatus]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="sticky top-0 z-30 border-b border-white/10 bg-gray-950/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/headerlogo.PNG"
              alt="RigMate AU"
              width={160}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              className="border-white/20 text-white hover:bg-white/10"
            >
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

      <div ref={showcaseRef} className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-gray-900 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
          <div className="relative space-y-4">
            {build.purpose && (
              <Badge variant="info" className="text-xs uppercase tracking-wider">
                {build.purpose}
              </Badge>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{build.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className={`font-medium ${overallColor}`}>{compatibilityLabel}</span>
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <h2 className="font-semibold text-gray-100">Components</h2>
            {build.buildParts.map((buildPart) => {
              const Icon = SLOT_ICONS[buildPart.part.category.slug] ?? Cpu
              return (
                <div
                  key={buildPart.partId}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      {buildPart.part.category.name}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-white">{buildPart.part.name}</p>
                    {buildPart.part.description && (
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {buildPart.part.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1">
                    {buildPart.part.socket && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {buildPart.part.socket}
                      </span>
                    )}
                    {buildPart.part.ramType && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {buildPart.part.ramType}
                      </span>
                    )}
                    {buildPart.part.tdpWatts && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {buildPart.part.tdpWatts}W
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-4">
            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Compatibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {compatibility.results.slice(0, 6).map((result, index) => (
                  <div key={index} className="flex items-start gap-2">
                    {result.status === 'compatible' && (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    )}
                    {result.status === 'warning' && (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                    )}
                    {result.status === 'incompatible' && (
                      <Shield className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-200">{result.rule}</p>
                      {result.status !== 'compatible' && (
                        <p className="text-xs text-gray-400">{result.explanation}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Est. Power</span>
                    <span>{compatibility.estimatedWatts}W</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-gray-400">Min PSU</span>
                    <span>{compatibility.recommendedPsuWatts}W</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {performance && (
              <Card className="border-white/10 bg-white/5 text-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Est. Performance</CardTitle>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${FPS_TIERS[performance.tier]?.color ?? ''}`}
                    >
                      {FPS_TIERS[performance.tier]?.label} Tier
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {[
                    { res: '1080p', fps: performance.fps1080p },
                    { res: '1440p', fps: performance.fps1440p },
                    { res: '4K', fps: performance.fps4K },
                  ].map(
                    ({ res, fps }) =>
                      fps && (
                        <div key={res}>
                          <div className="mb-1 flex justify-between">
                            <span className="text-gray-400">{res}</span>
                            <span className="font-medium text-white">~{fps} FPS</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                              style={{ width: `${Math.min(100, (fps / 200) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )
                  )}
                  <p className="pt-1 text-xs text-gray-600">{PERFORMANCE_DISCLAIMER}</p>
                </CardContent>
              </Card>
            )}

            <Card className="border-white/10 bg-white/5 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Import Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  <span>CPU, coolers, fans - safe to import from AliExpress</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500" />
                  <span>GPU, PSU, RAM, SSD - buy from AU retailers for warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 shrink-0 text-blue-400" />
                  <span>eBay AU - check seller rating and order count before buying</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-1 border-t border-white/10 pt-6 text-center text-xs text-gray-600">
          <p>
            Generated by <strong className="text-gray-400">RigMate AU</strong> - Australian PC
            Build Platform
          </p>
          <p>Prices and availability are indicative only. Verify with retailers before purchasing.</p>
          <p>{PERFORMANCE_DISCLAIMER}</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white;
            color: black;
          }
          nav {
            display: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
