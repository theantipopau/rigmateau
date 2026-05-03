'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Cpu, Monitor, HardDrive, Zap, Box, Fan, Thermometer, MemoryStick, Plus, X, ChevronRight, Shield, AlertTriangle, CheckCircle2, HelpCircle, Share2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BuildState, Part, CompatibilityReport, BuildSlotKey } from '@/lib/types'
import { formatAUD } from '@/lib/utils'
import PartSelectorModal from './PartSelectorModal'
import CompatibilityPanel from './CompatibilityPanel'
import PricePanel from '@/components/pricing/PricePanel'

const BUILD_SLOTS: Array<{
  key: BuildSlotKey
  label: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  required: boolean
}> = [
  { key: 'cpu', label: 'CPU', icon: Cpu, category: 'cpu', required: true },
  { key: 'motherboard', label: 'Motherboard', icon: MemoryStick, category: 'motherboard', required: true },
  { key: 'ram', label: 'RAM', icon: MemoryStick, category: 'ram', required: true },
  { key: 'gpu', label: 'GPU', icon: Monitor, category: 'gpu', required: false },
  { key: 'storage', label: 'Storage', icon: HardDrive, category: 'storage', required: true },
  { key: 'psu', label: 'PSU', icon: Zap, category: 'psu', required: true },
  { key: 'case', label: 'Case', icon: Box, category: 'case', required: true },
  { key: 'cooler', label: 'CPU Cooler', icon: Thermometer, category: 'cooler', required: false },
  { key: 'fan', label: 'Case Fans', icon: Fan, category: 'fan', required: false },
]

function StatusIcon({ status }: { status: CompatibilityReport['overallStatus'] }) {
  switch (status) {
    case 'compatible': return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    case 'incompatible': return <Shield className="h-5 w-5 text-red-500" />
    default: return <HelpCircle className="h-5 w-5 text-gray-400" />
  }
}

function statusColor(status: string) {
  if (status === 'compatible') return 'success'
  if (status === 'warning') return 'warning'
  if (status === 'incompatible') return 'danger'
  return 'secondary'
}

export default function BuildEditor() {
  const [build, setBuild] = useState<BuildState>({})
  const [selectingSlot, setSelectingSlot] = useState<BuildSlotKey | null>(null)
  const [compatibility, setCompatibility] = useState<CompatibilityReport | null>(null)
  const [activePricePartId, setActivePricePartId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const partCount = Object.values(build).filter(Boolean).length

  const totalPrice = Object.values(build).reduce((sum, part) => {
    // Estimated price from seed (would come from cheapest local listing in real app)
    return sum
  }, 0)

  // Check compatibility whenever build changes
  const checkCompatibility = useCallback(async () => {
    const partIds: Record<string, string> = {}
    for (const [slot, part] of Object.entries(build)) {
      if (part) partIds[slot] = part.id
    }
    if (Object.keys(partIds).length < 2) {
      setCompatibility(null)
      return
    }
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partIds }),
      })
      const data = await res.json()
      setCompatibility(data.report)
    } catch {
      // silent fail
    }
  }, [build])

  useEffect(() => {
    checkCompatibility()
  }, [checkCompatibility])

  function handleSelectPart(slot: BuildSlotKey, part: Part) {
    setBuild(prev => ({ ...prev, [slot]: part }))
    setSelectingSlot(null)
  }

  function handleRemovePart(slot: BuildSlotKey) {
    setBuild(prev => {
      const next = { ...prev }
      delete next[slot]
      return next
    })
  }

  async function handleSaveBuild() {
    const name = prompt('Name your build:', 'My RigMate AU Build')
    if (!name) return

    const purpose = prompt('Build purpose (e.g. "1440p Gaming", "Workstation"):') ?? undefined

    const partIds: Record<string, string> = {}
    for (const [slot, part] of Object.entries(build)) {
      if (part) partIds[slot] = part.id
    }

    setSaving(true)
    try {
      const res = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, purpose, partIds }),
      })
      const data = await res.json()
      if (data.url) {
        setShareUrl(`${window.location.origin}${data.url}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
              <a href="/" className="flex items-center">
                <Image src="/icon.PNG" alt="RigMate AU" width={36} height={36} className="h-9 w-auto" />
              </a>
            <div className="h-5 w-px bg-white/20 mx-1" />
            <span className="text-sm text-gray-400">Build Editor</span>
          </div>
          <div className="flex items-center gap-3">
            {compatibility && (
              <div className="flex items-center gap-2">
                <StatusIcon status={compatibility.overallStatus} />
                <Badge variant={statusColor(compatibility.overallStatus) as any} className="capitalize">
                  {compatibility.overallStatus}
                </Badge>
              </div>
            )}
            <span className="text-sm text-gray-400">{partCount} / {BUILD_SLOTS.length} parts</span>
            {shareUrl ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied!') }}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSaveBuild}
                disabled={partCount < 2 || saving}
                className="bg-orange-600 hover:bg-orange-500"
              >
                {saving ? 'Saving…' : 'Save & Share'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Build Slots */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Your Build</h2>
            {BUILD_SLOTS.map(slot => {
              const selectedPart = build[slot.key]
              const Icon = slot.icon
              return (
                <div
                  key={slot.key}
                  className={`group relative flex items-center gap-4 rounded-xl border p-4 transition-all cursor-pointer
                    ${selectedPart
                      ? 'border-white/20 bg-white/5 hover:border-blue-500/50'
                      : 'border-dashed border-white/10 hover:border-white/30 hover:bg-white/[0.02]'
                    }`}
                  onClick={() => !selectedPart && setSelectingSlot(slot.key)}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                    ${selectedPart ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium uppercase tracking-wider
                        ${selectedPart ? 'text-blue-400' : 'text-gray-500'}`}>
                        {slot.label}
                        {slot.required && !selectedPart && <span className="text-red-400 ml-0.5">*</span>}
                      </span>
                    </div>
                    {selectedPart ? (
                      <p className="text-sm font-medium text-white truncate mt-0.5">{selectedPart.name}</p>
                    ) : (
                      <p className="text-sm text-gray-500 mt-0.5">Click to select a {slot.label}</p>
                    )}
                  </div>

                  {selectedPart ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActivePricePartId(activePricePartId === selectedPart.id ? null : selectedPart.id) }}
                        className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-blue-500/30 hover:border-blue-500/60 transition-colors"
                      >
                        Prices
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectingSlot(slot.key) }}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
                      >
                        Change
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemovePart(slot.key) }}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                  )}
                </div>
              )
            })}

            {/* Price Panel */}
            {activePricePartId && (
              <PricePanel partId={activePricePartId} onClose={() => setActivePricePartId(null)} />
            )}
          </div>

          {/* Sidebar: Compatibility + Summary */}
          <div className="space-y-4">
            {/* Build Summary Card */}
            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Build Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {BUILD_SLOTS.map(slot => {
                  const part = build[slot.key]
                  if (!part) return null
                  return (
                    <div key={slot.key} className="flex items-start justify-between gap-2">
                      <span className="text-gray-400 shrink-0">{slot.label}</span>
                      <span className="text-right text-gray-200 truncate max-w-[160px]" title={part.name}>
                        {part.brand} {part.model}
                      </span>
                    </div>
                  )
                })}
                {partCount === 0 && (
                  <p className="text-gray-500 text-center py-4">Start adding parts to your build</p>
                )}
                {compatibility && (
                  <div className="pt-3 border-t border-white/10 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Est. Power Draw</span>
                      <span className="text-white font-medium">{compatibility.estimatedWatts}W</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Recommended PSU</span>
                      <span className="text-white font-medium">{compatibility.recommendedPsuWatts}W</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compatibility Panel */}
            {compatibility && <CompatibilityPanel report={compatibility} />}

            {/* Build Showcase CTA */}
            {partCount >= 4 && shareUrl && (
              <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30 text-white">
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm font-medium">Your build is saved!</p>
                  <p className="text-xs text-gray-300">View the premium Build Showcase page with full performance data and export options.</p>
                  <a href={shareUrl} className="block">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500">
                      <Download className="h-4 w-4" />
                      View Full Showcase
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Part Selector Modal */}
      {selectingSlot && (
        <PartSelectorModal
          slot={selectingSlot}
          category={BUILD_SLOTS.find(s => s.key === selectingSlot)!.category}
          onSelect={(part) => handleSelectPart(selectingSlot, part)}
          onClose={() => setSelectingSlot(null)}
        />
      )}
    </div>
  )
}
