'use client'

import Link from 'next/link'
import { useState, useEffect, type ComponentType } from 'react'
import Image from 'next/image'
import { Cpu, Monitor, HardDrive, Zap, Box, Fan, Thermometer, MemoryStick, X, ChevronRight, Shield, AlertTriangle, CheckCircle2, HelpCircle, Share2, Download, ClipboardCopy, Printer, DollarSign, RotateCcw, Copy, ChevronDown, Lightbulb, Info, Sparkles, Store, PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BUILD_SLOT_KEYS, isBuildSlotKey, type BuildState, type Part, type CompatibilityReport, type BuildSlotKey, type PriceScore } from '@/lib/types'
import { formatAUD } from '@/lib/utils'
import { BUILD_TEMPLATES } from '@/lib/templates'
import type { BuildTemplate } from '@/lib/templates'
import { fetchCompatibility, fetchParts, fetchPricing, saveBuild } from '@/lib/runtime/client-data'
import { IS_GITHUB_PAGES, toAbsoluteUrl } from '@/lib/runtime/deploy'
import PartSelectorModal from './PartSelectorModal'
import PartImage from './PartImage'
import CompatibilityPanel from '@/components/build/CompatibilityPanel'
import PricePanel from '../pricing/PricePanel'

const BUILD_SLOTS: Array<{
  key: BuildSlotKey
  label: string
  icon: ComponentType<{ className?: string }>
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

function matchesSlotCategory(slot: BuildSlotKey, part: Part): boolean {
  const expectedCategory = BUILD_SLOTS.find((entry) => entry.key === slot)?.category
  if (!expectedCategory) return false
  return part.category?.slug === expectedCategory
}

function StatusIcon({ status }: { status: CompatibilityReport['overallStatus'] }) {
  switch (status) {
    case 'compatible': return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    case 'incompatible': return <Shield className="h-5 w-5 text-red-500" />
    default: return <HelpCircle className="h-5 w-5 text-gray-400" />
  }
}

function statusColor(status: CompatibilityReport['overallStatus']): NonNullable<BadgeProps['variant']> {
  if (status === 'compatible') return 'success'
  if (status === 'warning') return 'warning'
  if (status === 'incompatible') return 'danger'
  return 'secondary'
}

function getCompatibilityFilters(slot: BuildSlotKey, build: BuildState): Record<string, string> {
  const filters: Record<string, string> = {}
  const cpu = build.cpu
  const mb = build.motherboard
  const pcCase = build.case

  switch (slot) {
    case 'motherboard': {
      // Filter by CPU socket if selected
      if (cpu?.socket) filters.filterSocket = cpu.socket
      // Filter by case form factor if selected
      if (pcCase?.formFactor) filters.filterMaxFormFactor = pcCase.formFactor
      break
    }
    case 'cpu': {
      // Filter by motherboard socket if selected
      if (mb?.socket) filters.filterSocket = mb.socket
      break
    }
    case 'ram': {
      // Filter by motherboard RAM type if selected
      if (mb?.ramType) filters.filterRamType = mb.ramType
      break
    }
    case 'cooler': {
      // Filter by CPU socket if selected (coolers support comma-separated sockets)
      if (cpu?.socket) filters.filterSocket = cpu.socket
      // Filter by case cooler clearance if selected
      if (pcCase?.heightMm) filters.filterMaxHeightMm = String(pcCase.heightMm)
      break
    }
    case 'gpu': {
      // Filter by case GPU clearance if selected
      if (pcCase?.lengthMm) filters.filterMaxLengthMm = String(pcCase.lengthMm)
      break
    }
    case 'psu': {
      // Filter by case PSU form factor if selected
      if (pcCase?.psuFormFactor) filters.filterPsuFormFactor = pcCase.psuFormFactor
      break
    }
    default:
      break
  }
  return filters
}

type SlotPricing = {
  partId: string
  cheapestCost: number
  cheapestRetailer: string
  retailers: Array<{ name: string; landedCost: number }>
  totalOffers: number
  supplierCount: number
  sourceBreakdown: Record<PriceScore['listing']['source'], number>
}

function getSelectedEntries(build: BuildState): Array<[BuildSlotKey, Part]> {
  return BUILD_SLOT_KEYS.flatMap((slot) => {
    const part = build[slot]
    return part ? ([[slot, part]] as Array<[BuildSlotKey, Part]>) : []
  })
}

function countSelectedParts(build: BuildState): number {
  return getSelectedEntries(build).length
}

function isBuildCompleteState(build: BuildState): boolean {
  const requiredSlots = BUILD_SLOTS.filter((slot) => slot.required)
  return requiredSlots.every((slot) => Boolean(build[slot.key])) && countSelectedParts(build) > 0
}

function loadStoredBuild(): BuildState {
  if (typeof window === 'undefined') {
    return {}
  }

  const saved = localStorage.getItem('rigmateauBuild')
  if (!saved) {
    return {}
  }

  try {
    const parsed = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object') {
      return {}
    }

    const next: BuildState = {}
    for (const [slot, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (isBuildSlotKey(slot) && value && typeof value === 'object' && 'id' in value) {
        next[slot] = value as Part
      }
    }
    return next
  } catch {
    return {}
  }
}

function PcDiagram({ build }: { build: BuildState }) {
  const has = (slot: BuildSlotKey) => Boolean(build[slot])
  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Build Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <svg viewBox="0 0 180 240" className="w-full max-w-[200px] mx-auto block" xmlns="http://www.w3.org/2000/svg">
          {/* Case outline */}
          <rect x="10" y="5" width="130" height="230" rx="10" fill={has('case') ? '#1f2937' : '#111827'} stroke={has('case') ? '#3b82f6' : '#374151'} strokeWidth="2"/>
          {/* Front strip */}
          <rect x="10" y="5" width="130" height="22" rx="10" fill={has('case') ? '#111827' : '#0a0a0a'}/>
          <rect x="10" y="16" width="130" height="11" fill={has('case') ? '#111827' : '#0a0a0a'}/>
          {/* Power button */}
          <circle cx="28" cy="16" r="5" fill={has('psu') ? '#22c55e' : '#374151'} opacity="0.9"/>
          <circle cx="28" cy="16" r="2.5" fill={has('psu') ? '#4ade80' : '#1f2937'}/>
          {/* Tempered glass window */}
          <rect x="18" y="32" width="88" height="190" rx="4" fill="#0f172a" opacity="0.6" stroke={has('case') ? '#3b82f6' : '#1f2937'} strokeWidth="1"/>
          {/* Fan circles on right */}
          <circle cx="155" cy="65" r="14" fill={has('fan') ? '#1e1b4b' : '#111827'} stroke={has('fan') ? '#818cf8' : '#2d3748'} strokeWidth="1.5"/>
          {has('fan') && <><circle cx="155" cy="65" r="7" fill="none" stroke="#4c1d95" strokeWidth="1"/><circle cx="155" cy="65" r="2.5" fill="#818cf8"/></>}
          <circle cx="155" cy="115" r="14" fill={has('fan') ? '#1e1b4b' : '#111827'} stroke={has('fan') ? '#818cf8' : '#2d3748'} strokeWidth="1.5"/>
          {has('fan') && <><circle cx="155" cy="115" r="7" fill="none" stroke="#4c1d95" strokeWidth="1"/><circle cx="155" cy="115" r="2.5" fill="#818cf8"/></>}
          {/* GPU slot */}
          <rect x="22" y="40" width="80" height="34" rx="3" fill={has('gpu') ? '#1e3a8a' : '#1a1a2e'} stroke={has('gpu') ? '#3b82f6' : '#2d3748'} strokeWidth="1"/>
          {has('gpu') && (
            <>
              <circle cx="46" cy="57" r="10" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1"/>
              <circle cx="46" cy="57" r="4" fill="#3b82f6"/>
              <circle cx="66" cy="57" r="8" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1"/>
              <circle cx="66" cy="57" r="3" fill="#3b82f6"/>
              <text x="85" y="61" textAnchor="end" fill="#93c5fd" fontSize="7" fontFamily="sans-serif" fontWeight="bold">GPU</text>
            </>
          )}
          {!has('gpu') && <text x="62" y="61" textAnchor="middle" fill="#374151" fontSize="7" fontFamily="sans-serif">GPU Slot</text>}
          {/* Motherboard */}
          <rect x="22" y="80" width="80" height="90" rx="3" fill={has('motherboard') ? '#14532d' : '#1a1a2e'} stroke={has('motherboard') ? '#16a34a' : '#2d3748'} strokeWidth="1"/>
          {/* CPU on mobo */}
          <rect x="66" y="88" width="28" height="28" rx="2" fill={has('cpu') ? '#1e40af' : has('motherboard') ? '#1f2937' : '#111827'} stroke={has('cpu') ? '#60a5fa' : '#374151'} strokeWidth="1"/>
          {has('cpu') && (
            <>
              <rect x="68" y="90" width="24" height="24" rx="1" fill="#1d4ed8"/>
              <text x="80" y="104" textAnchor="middle" fill="#bfdbfe" fontSize="6" fontFamily="sans-serif" fontWeight="bold">CPU</text>
            </>
          )}
          {/* Cooler fan over CPU */}
          {has('cooler') && (
            <>
              <rect x="62" y="84" width="36" height="36" rx="4" fill="#065f46" opacity="0.7" stroke="#34d399" strokeWidth="1"/>
              <circle cx="80" cy="102" r="13" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="3 1.5"/>
              <circle cx="80" cy="102" r="4" fill="#10b981"/>
            </>
          )}
          {/* RAM sticks */}
          <rect x="28" y="86" width="9" height="36" rx="1" fill={has('ram') ? '#6d28d9' : has('motherboard') ? '#1f2937' : '#111827'} stroke={has('ram') ? '#a78bfa' : '#374151'} strokeWidth="1"/>
          <rect x="40" y="86" width="9" height="36" rx="1" fill={has('ram') ? '#6d28d9' : has('motherboard') ? '#1f2937' : '#111827'} stroke={has('ram') ? '#a78bfa' : '#374151'} strokeWidth="1"/>
          {has('ram') && (
            <>
              <rect x="28" y="86" width="9" height="6" rx="0.5" fill="#7c3aed"/>
              <rect x="40" y="86" width="9" height="6" rx="0.5" fill="#7c3aed"/>
            </>
          )}
          {/* Storage drive */}
          <rect x="28" y="140" width="70" height="14" rx="2" fill={has('storage') ? '#292524' : '#1a1a2e'} stroke={has('storage') ? '#78716c' : '#2d3748'} strokeWidth="1"/>
          {has('storage') && (
            <>
              <rect x="32" y="143" width="14" height="8" rx="1" fill="#44403c"/>
              <rect x="49" y="143" width="10" height="8" rx="1" fill="#44403c"/>
              <circle cx="87" cy="147" r="3" fill="#f97316"/>
            </>
          )}
          {!has('storage') && <text x="63" y="150" textAnchor="middle" fill="#374151" fontSize="6" fontFamily="sans-serif">NVMe Slot</text>}
          {/* PSU */}
          <rect x="22" y="182" width="80" height="30" rx="3" fill={has('psu') ? '#292410' : '#1a1a2e'} stroke={has('psu') ? '#ca8a04' : '#2d3748'} strokeWidth="1"/>
          {has('psu') && (
            <>
              <circle cx="55" cy="197" r="11" fill="#1c1a10" stroke="#a16207" strokeWidth="1"/>
              <line x1="55" y1="186" x2="55" y2="208" stroke="#92400e" strokeWidth="0.7"/>
              <line x1="44" y1="197" x2="66" y2="197" stroke="#92400e" strokeWidth="0.7"/>
              <circle cx="55" cy="197" r="3.5" fill="#ca8a04"/>
              <rect x="72" y="190" width="22" height="5" rx="1" fill="#854d0e"/>
              <text x="83" y="194.5" textAnchor="middle" fill="#fef08a" fontSize="4" fontFamily="sans-serif" fontWeight="bold">80+ GOLD</text>
              <text x="55" y="214" textAnchor="middle" fill="#fbbf24" fontSize="5.5" fontFamily="sans-serif">PSU</text>
            </>
          )}
          {!has('psu') && <text x="62" y="200" textAnchor="middle" fill="#374151" fontSize="6" fontFamily="sans-serif">PSU Bay</text>}
        </svg>
        <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 mt-3 text-xs">
          {BUILD_SLOTS.map(slot => {
            const selected = Boolean(build[slot.key])
            return (
              <div key={slot.key} className={`flex items-center gap-1 ${selected ? 'text-green-400' : 'text-gray-600'}`}>
                <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${selected ? 'bg-green-400' : 'bg-gray-700'}`} />
                <span className="truncate">{slot.label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function BuildEditor() {
  const [build, setBuild] = useState<BuildState>(() => loadStoredBuild())
  const [selectingSlot, setSelectingSlot] = useState<BuildSlotKey | null>(null)
  const [compatibility, setCompatibility] = useState<CompatibilityReport | null>(null)
  const [slotPricing, setSlotPricing] = useState<Partial<Record<BuildSlotKey, SlotPricing>>>({})
  const [pricingLoading, setPricingLoading] = useState(false)
  const [activePricePartId, setActivePricePartId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [readinessExpanded, setReadinessExpanded] = useState(() => !isBuildCompleteState(loadStoredBuild()))
  const [priceErrors, setPriceErrors] = useState<Set<BuildSlotKey>>(new Set())
  const [templateModalOpen, setTemplateModalOpen] = useState(false)
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null)
  const [templateCategory, setTemplateCategory] = useState<BuildTemplate['category'] | 'all'>('all')

  const selectedEntries = getSelectedEntries(build)
  const visibleSlotPricing = BUILD_SLOT_KEYS.reduce<Partial<Record<BuildSlotKey, SlotPricing>>>((acc, slot) => {
    const currentPart = build[slot]
    const pricing = slotPricing[slot]
    if (currentPart && pricing?.partId === currentPart.id) {
      acc[slot] = pricing
    }
    return acc
  }, {})
  const visiblePriceErrors = new Set([...priceErrors].filter((slot) => Boolean(build[slot])))
  const partCount = selectedEntries.length
  const totalPrice = Object.values(visibleSlotPricing).reduce((sum, pricing) => sum + (pricing?.cheapestCost ?? 0), 0)
  const requiredSlots = BUILD_SLOTS.filter(slot => slot.required)
  const missingRequiredSlots = requiredSlots.filter(slot => !build[slot.key])
  const buildComplete = missingRequiredSlots.length === 0 && partCount > 0
  const visibleTemplates = BUILD_TEMPLATES.filter(t => templateCategory === 'all' || t.category === templateCategory)
  const totalIndexedOffers = Object.values(visibleSlotPricing).reduce((sum, pricing) => sum + (pricing?.totalOffers ?? 0), 0)
  const totalSuppliers = Object.values(visibleSlotPricing).reduce((sum, pricing) => sum + (pricing?.supplierCount ?? 0), 0)
  const indexedChannels = Object.values(visibleSlotPricing).reduce((set, pricing) => {
    if (pricing?.sourceBreakdown.local) set.add('Local AU')
    if (pricing?.sourceBreakdown.ebay) set.add('eBay AU')
    if (pricing?.sourceBreakdown.aliexpress) set.add('AliExpress')
    return set
  }, new Set<string>())

  function applyBuild(nextBuild: BuildState) {
    setBuild(nextBuild)

    const nextCount = countSelectedParts(nextBuild)
    if (nextCount < 2) {
      setCompatibility(null)
    }
    if (nextCount === 0) {
      setSlotPricing({})
      setPriceErrors(new Set())
      setPricingLoading(false)
      setActivePricePartId(null)
    }
    if (isBuildCompleteState(nextBuild)) {
      setReadinessExpanded(false)
    }
  }

  useEffect(() => {
    if (selectedEntries.length < 2) {
      return
    }

    const controller = new AbortController()

    async function loadCompatibility() {
      const partIds = Object.fromEntries(selectedEntries.map(([slot, part]) => [slot, part.id]))

      try {
        const data = await fetchCompatibility(partIds)
        if (!controller.signal.aborted) {
          setCompatibility(data.report ?? null)
        }
      } catch {
        // silent fail
      }
    }

    void loadCompatibility()

    return () => {
      controller.abort()
    }
  }, [selectedEntries])

  useEffect(() => {
    const selectedEntries = getSelectedEntries(build)
    if (selectedEntries.length === 0) {
      return
    }

    let cancelled = false

    async function loadPrices() {
      setPricingLoading(true)
      const errors = new Set<BuildSlotKey>()
      try {
        const rows = await Promise.all(
          selectedEntries.map(async ([slot, part]) => {
            try {
              const data = (await fetchPricing(part.id)) as { scores?: PriceScore[] }
              const scores = data.scores ?? []
              // Only local AU listings, sorted by landed cost
              const local = scores
                .filter(s => s.listing.source === 'local')
                .sort((a, b) => a.listing.landedCost - b.listing.landedCost)
              const sourceBreakdown: Record<PriceScore['listing']['source'], number> = {
                local: 0,
                ebay: 0,
                aliexpress: 0,
              }
              for (const score of scores) {
                sourceBreakdown[score.listing.source] += 1
              }
              const allSorted = scores.sort((a, b) => a.listing.landedCost - b.listing.landedCost)
              const cheapest = allSorted[0]
              if (!cheapest) {
                errors.add(slot)
                return [slot, null] as const
              }
              const retailers = local.slice(0, 7).map(s => ({
                name: s.listing.retailer.name,
                landedCost: s.listing.landedCost,
              }))
              return [slot, {
                partId: part.id,
                cheapestCost: cheapest.listing.landedCost,
                cheapestRetailer: cheapest.listing.retailer.name,
                retailers,
                totalOffers: scores.length,
                supplierCount: new Set(scores.map((score) => score.listing.retailer.slug)).size,
                sourceBreakdown,
              }] as const
            } catch {
              errors.add(slot)
              return [slot, null] as const
            }
          }),
        )

        if (cancelled) return

        const next: Partial<Record<BuildSlotKey, SlotPricing>> = {}
        for (const [slot, p] of rows) {
          if (p) next[slot] = p
        }
        setSlotPricing(next)
        setPriceErrors(errors)
      } finally {
        if (!cancelled) setPricingLoading(false)
      }
    }

    loadPrices()

    return () => {
      cancelled = true
    }
  }, [build])

  // Persist build to localStorage
  useEffect(() => {
    if (partCount > 0) {
      localStorage.setItem('rigmateauBuild', JSON.stringify(build))
    }
  }, [build, partCount])

  function handleSelectPart(slot: BuildSlotKey, part: Part) {
    if (!matchesSlotCategory(slot, part)) {
      alert(`That part belongs in ${part.category.name}, not ${slot}. Please choose a matching part.`)
      return
    }
    applyBuild({ ...build, [slot]: part })
    setSelectingSlot(null)
  }

  function handleRemovePart(slot: BuildSlotKey) {
    const next = { ...build }
    delete next[slot]
    applyBuild(next)
  }

  function handleResetBuild() {
    applyBuild({})
    setCompatibility(null)
    setSlotPricing({})
    setActivePricePartId(null)
    setSelectingSlot(null)
    setShareUrl(null)
    setPriceErrors(new Set())
    localStorage.removeItem('rigmateauBuild')
  }

  function handleDuplicateBuild() {
    // Create a new build with same parts
    const newBuild = { ...build }
    applyBuild(newBuild)
    setShareUrl(null) // Clear share URL since this is a new build
    alert('Build duplicated! Edit and save as a new build.')
  }

  function getSlotCompatibilityHint(slot: BuildSlotKey): string | null {
    const filters = getCompatibilityFilters(slot, build)
    const hints: string[] = []
    
    if (filters.filterSocket) hints.push(`Socket: ${filters.filterSocket}`)
    if (filters.filterRamType) hints.push(`RAM: ${filters.filterRamType}`)
    if (filters.filterMaxHeightMm) hints.push(`Max height: ${filters.filterMaxHeightMm}mm`)
    if (filters.filterMaxLengthMm) hints.push(`Max length: ${filters.filterMaxLengthMm}mm`)
    if (filters.filterPsuFormFactor) hints.push(`PSU: ${filters.filterPsuFormFactor}`)
    
    return hints.length > 0 ? hints.join(', ') : null
  }

  function getPartSpecsSummary(part: Part): Array<{ label: string; value: string }> {
    const specs: Array<{ label: string; value: string }> = []
    if (part.cores) specs.push({ label: 'Cores', value: String(part.cores) })
    if (part.threads) specs.push({ label: 'Threads', value: String(part.threads) })
    if (part.boostClockMhz) specs.push({ label: 'Boost', value: `${part.boostClockMhz}MHz` })
    if (part.capacityGb) specs.push({ label: 'Capacity', value: `${part.capacityGb}GB` })
    if (part.speedMhz) specs.push({ label: 'Speed', value: `${part.speedMhz}MHz` })
    if (part.tdpWatts) specs.push({ label: 'TDP', value: `${part.tdpWatts}W` })
    if (part.psuWatts) specs.push({ label: 'Rating', value: `${part.psuWatts}W` })
    if (part.lengthMm) specs.push({ label: 'Length', value: `${part.lengthMm}mm` })
    return specs.slice(0, 3)
  }

  async function loadTemplate(template: BuildTemplate) {
    try {
      const partIds = Object.entries(template.parts).filter(([, id]) => id) as Array<[BuildSlotKey, string]>
      const partsToLoad = await Promise.all(
        partIds.map(async ([slot, partId]) => {
          try {
            const data = await fetchParts({ id: partId })
            return [slot, data.part ?? null] as const
          } catch {
            return [slot, null] as const
          }
        })
      )
      const newBuild: BuildState = {}
      for (const [slot, part] of partsToLoad) {
        if (part && matchesSlotCategory(slot, part)) {
          newBuild[slot] = part
        }
      }

      const loadedCount = Object.keys(newBuild).length
      if (loadedCount === 0) {
        alert('Template parts are currently unavailable. Please try another template.')
        return
      }

      applyBuild(newBuild)
      setTemplateModalOpen(false)
      setSelectingSlot(null)
      setHoveredPartId(null)

      if (loadedCount < partIds.length) {
        alert(`Loaded ${loadedCount}/${partIds.length} parts. Some parts are not in the active catalog yet.`)
      }
    } catch {
      alert('Template load failed. Please try again.')
    }
  }

  async function handleSaveBuild() {
    const name = prompt('Name your build:', 'My RigMate AU Build')
    if (!name) return

    const purpose = prompt('Build purpose (e.g. "1440p Gaming", "Workstation"):') ?? undefined

    const partIds = Object.fromEntries(selectedEntries.map(([slot, part]) => [slot, part.id]))

    setSaving(true)
    try {
      const data = await saveBuild({ name, purpose, partIds })
      if (data.url) {
        setShareUrl(toAbsoluteUrl(data.url))
      }
    } finally {
      setSaving(false)
    }
  }

  function buildExportText(): string {
    const lines = [
      'RigMate AU Build Export',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      'Parts:',
    ]

    for (const slot of BUILD_SLOTS) {
      const part = build[slot.key]
      if (!part) continue
      const pricing = visibleSlotPricing[slot.key]
      const priceText = pricing ? ` - ${formatAUD(pricing.cheapestCost)} (${pricing.cheapestRetailer})` : ''
      lines.push(`${slot.label}: ${part.name}${priceText}`)
      if (pricing?.retailers.length) {
        const retailerPrices = pricing.retailers.map(r => `  ${r.name}: ${formatAUD(r.landedCost)}`).join('\n')
        lines.push(retailerPrices)
      }
    }

    lines.push('')
    lines.push(`Estimated Cheapest Total: ${formatAUD(totalPrice)}`)
    if (compatibility) lines.push(`Compatibility Status: ${compatibility.overallStatus}`)
    if (shareUrl) lines.push(`Share URL: ${shareUrl}`)

    return lines.join('\n')
  }

  async function handleCopyExport() {
    await navigator.clipboard.writeText(buildExportText())
    alert('Build summary copied to clipboard')
  }

  function handlePrintExport() {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://rigmate.au'
    const rows = BUILD_SLOTS.map(slot => {
      const part = build[slot.key]
      if (!part) return ''
      const pricing = visibleSlotPricing[slot.key]
      const retailerRows = pricing?.retailers.map(r =>
        `<tr><td style="padding:2px 16px 2px 32px;color:#9ca3af;font-size:12px">${r.name}</td><td style="padding:2px 0;text-align:right;color:#6ee7b7;font-size:12px;font-weight:600">${formatAUD(r.landedCost)}</td></tr>`
      ).join('') ?? ''
      return `<tr style="border-top:1px solid #374151"><td style="padding:8px 16px 4px;color:#9ca3af;font-size:13px;white-space:nowrap">${slot.label}</td><td style="padding:8px 16px 4px;color:#f3f4f6;font-size:13px">${part.name}</td><td style="padding:8px 0 4px;text-align:right;color:#34d399;font-weight:700">${pricing ? formatAUD(pricing.cheapestCost) : '—'}</td></tr>${retailerRows}`
    }).filter(Boolean).join('')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>RigMate AU Build</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#030712;color:#f3f4f6;padding:40px}h1{font-size:22px;font-weight:700;color:#fff;margin-bottom:4px}h2{font-size:13px;color:#6b7280;font-weight:400;margin-bottom:32px}table{width:100%;border-collapse:collapse}th{padding:8px 16px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;border-bottom:2px solid #374151}th:last-child{text-align:right}.total{margin-top:24px;border-top:2px solid #374151;padding-top:16px;display:flex;justify-content:space-between;align-items:center}.total-label{font-size:14px;color:#9ca3af}.total-price{font-size:24px;font-weight:700;color:#34d399}.meta{margin-top:32px;font-size:11px;color:#4b5563}.compat{display:inline-block;margin-top:8px;padding:3px 10px;border-radius:9999px;font-size:11px;font-weight:600}@media print{body{padding:24px}}</style></head><body><h1>RigMate AU — PC Build</h1><h2>Generated ${new Date().toLocaleString('en-AU', { dateStyle: 'long', timeStyle: 'short' })}</h2><table><thead><tr><th>Component</th><th>Part</th><th style="text-align:right">Best Price (AU)</th></tr></thead><tbody>${rows}</tbody></table><div class="total"><span class="total-label">Estimated Build Total (cheapest per part)</span><span class="total-price">${formatAUD(totalPrice)}</span></div><div class="meta">${compatibility ? `<span>Compatibility: </span><span class="compat" style="background:${compatibility.overallStatus==='compatible'?'#14532d':compatibility.overallStatus==='warning'?'#422006':'#450a0a'};color:${compatibility.overallStatus==='compatible'?'#4ade80':compatibility.overallStatus==='warning'?'#fb923c':'#f87171'}">${compatibility.overallStatus.toUpperCase()}</span>` : ''}<br><br>Prices are indicative. Verify at each retailer before purchasing. RigMate AU — ${origin}</div></body></html>`
    const w = window.open('', '_blank', 'width=900,height=700')
    if (!w) return
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 400)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center">
                <Image src="/icon.PNG" alt="RigMate AU" width={36} height={36} className="h-9 w-auto" />
              </Link>
            <div className="h-5 w-px bg-white/20 mx-1" />
            <span className="text-sm text-gray-400">Build Editor</span>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3">
            {compatibility && (
              <div className="flex items-center gap-2">
                <StatusIcon status={compatibility.overallStatus} />
                <Badge variant={statusColor(compatibility.overallStatus)} className="capitalize">
                  {compatibility.overallStatus}
                </Badge>
              </div>
            )}
            <span className="text-sm text-gray-400">{partCount} / {BUILD_SLOTS.length} parts</span>
            {partCount > 0 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDuplicateBuild}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleResetBuild}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </>
            )}
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
                {saving ? 'Saving...' : 'Save & Share'}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTemplateModalOpen(true)}
              className="border-white/20 text-white hover:bg-white/10"
              title="Load a pre-built template"
            >
              <Lightbulb className="h-4 w-4" />
              Templates
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyExport}
              disabled={partCount === 0}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ClipboardCopy className="h-4 w-4" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrintExport}
              disabled={partCount === 0}
              className="border-white/20 text-white hover:bg-white/10"
              title="Print or save as PDF"
            >
              <Printer className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:pb-8">
        {IS_GITHUB_PAGES && (
          <section className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Static mode is active. Save and Share creates a URL-encoded showcase link instead of server-side build storage.
          </section>
        )}

        <section className="mb-6 overflow-hidden rounded-2xl border border-cyan-500/20 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_90%_5%,rgba(59,130,246,0.2),transparent_35%),linear-gradient(180deg,rgba(17,24,39,0.94),rgba(3,7,18,0.94))] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-300/80">
                <PackageSearch className="h-3.5 w-3.5" />
                Offers Indexed
              </div>
              <p className="text-2xl font-semibold text-white">{totalIndexedOffers}</p>
              <p className="text-xs text-gray-400">Across selected components</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-300/80">
                <Store className="h-3.5 w-3.5" />
                Supplier Reach
              </div>
              <p className="text-2xl font-semibold text-white">{totalSuppliers}</p>
              <p className="text-xs text-gray-400">Retailers and marketplaces</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-blue-300/80">
                <Sparkles className="h-3.5 w-3.5" />
                Market Channels
              </div>
              <p className="text-2xl font-semibold text-white">{indexedChannels.size}</p>
              <p className="text-xs text-gray-400">{indexedChannels.size > 0 ? Array.from(indexedChannels).join(' | ') : 'Select parts to compare channels'}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-violet-300/80">
                <DollarSign className="h-3.5 w-3.5" />
                Est. Cheapest Total
              </div>
              <p className="text-2xl font-semibold text-white">{formatAUD(totalPrice)}</p>
              <p className="text-xs text-gray-400">Live and projected AU pricing</p>
            </div>
          </div>
        </section>

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
                  className={`group relative flex flex-col items-start gap-3 rounded-xl border p-4 transition-all cursor-pointer sm:flex-row sm:items-center sm:gap-4
                    ${selectedPart
                      ? 'border-white/20 bg-white/5 hover:border-blue-500/50'
                      : 'border-dashed border-white/10 hover:border-white/30 hover:bg-white/[0.02]'
                    }`}
                  onClick={() => !selectedPart && setSelectingSlot(slot.key)}
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg p-1
                    ${selectedPart ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
                    {selectedPart ? (
                      <div className="relative h-10 w-10">
                        <PartImage
                          category={slot.category}
                          imageUrl={selectedPart.imageUrl}
                          alt={selectedPart.name}
                          className="rounded object-contain"
                          sizes="40px"
                        />
                      </div>
                    ) : null}
                    <Icon className={`h-5 w-5 ${selectedPart ? 'hidden' : ''}`} />
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
                      <div className="relative mt-0.5 min-w-0" onMouseLeave={() => setHoveredPartId((current) => current === selectedPart.id ? null : current)}>
                        <div className="flex items-center gap-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{selectedPart.name}</p>
                          {getPartSpecsSummary(selectedPart).length > 0 && (
                            <button
                              type="button"
                              onMouseEnter={() => setHoveredPartId(selectedPart.id)}
                              onClick={(e) => {
                                e.stopPropagation()
                                setHoveredPartId((current) => current === selectedPart.id ? null : selectedPart.id)
                              }}
                              className="shrink-0 rounded p-0.5 text-blue-300/80 hover:bg-white/10 hover:text-blue-200"
                              title="Show key specs"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        {hoveredPartId === selectedPart.id && getPartSpecsSummary(selectedPart).length > 0 && (
                          <div className="absolute left-0 top-6 z-20 w-52 rounded-md border border-white/15 bg-gray-900/95 p-2 shadow-xl backdrop-blur">
                            <p className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">Quick Specs</p>
                            <div className="space-y-1">
                              {getPartSpecsSummary(selectedPart).map((spec) => (
                                <div key={spec.label} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-400">{spec.label}</span>
                                  <span className="text-gray-100">{spec.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {visibleSlotPricing[slot.key]?.retailers.length ? (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {visibleSlotPricing[slot.key]!.retailers.map((r, i) => (
                              <span key={i} className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                i === 0
                                  ? 'bg-green-950/50 border border-green-500/40 text-green-300'
                                  : 'bg-white/[0.04] border border-white/10 text-gray-400'
                              }`}>
                                {r.name.replace(' Technology', '').replace(' Computers', '').replace(' Australia', '').replace('PC Case Gear', 'PCCaseGear')} {formatAUD(r.landedCost)}
                              </span>
                            ))}
                          </div>
                        ) : visibleSlotPricing[slot.key]?.totalOffers ? (
                          <p className="text-xs text-sky-300 mt-1">
                            {visibleSlotPricing[slot.key]!.totalOffers} offers from {visibleSlotPricing[slot.key]!.supplierCount} suppliers
                          </p>
                        ) : visiblePriceErrors.has(slot.key) ? (
                          <p className="text-xs text-red-400 mt-1">
                            Price lookup failed
                          </p>
                        ) : visibleSlotPricing[slot.key]?.cheapestCost ? (
                          <p className="text-xs text-emerald-400 mt-1">
                            {formatAUD(visibleSlotPricing[slot.key]!.cheapestCost)} at {visibleSlotPricing[slot.key]!.cheapestRetailer}
                          </p>
                        ) : pricingLoading ? (
                          <p className="text-xs text-gray-600 mt-1 animate-pulse">Fetching prices...</p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-0.5 space-y-1">
                        <p className="text-sm text-gray-500">Click to select a {slot.label}</p>
                        {!selectedPart && getSlotCompatibilityHint(slot.key) && (
                          <p className="text-xs text-blue-400/70 italic">{getSlotCompatibilityHint(slot.key)}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedPart ? (
                    <div className="flex w-full flex-wrap items-center justify-end gap-2 shrink-0 sm:w-auto">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActivePricePartId(activePricePartId === selectedPart.id ? null : selectedPart.id) }}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded border border-blue-500/30 hover:border-blue-500/60 transition-colors"
                        title="See all retailer prices including eBay"
                      >
                        <DollarSign className="h-3 w-3" />
                        All Prices
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

          {/* Sidebar: PC Diagram + Compatibility + Summary */}
          <div className="space-y-4">
            {/* PC Diagram */}
            <PcDiagram build={build} />

            {readinessExpanded ? (
              <Card className="bg-white/5 border-white/10 text-white">
                <CardHeader className="pb-3 cursor-pointer hover:bg-white/[0.02]" onClick={() => setReadinessExpanded(false)}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Build Readiness</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                {requiredSlots.map(slot => {
                  const isReady = Boolean(build[slot.key])
                  return (
                    <div key={slot.key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {isReady ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                        )}
                        <span className={isReady ? 'text-gray-200' : 'text-gray-400'}>{slot.label}</span>
                      </div>
                      {!isReady && (
                        <button
                          onClick={() => setSelectingSlot(slot.key)}
                          className="shrink-0 rounded border border-blue-500/30 px-2 py-1 text-xs text-blue-300 transition-colors hover:border-blue-500/60 hover:text-blue-200"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  )
                })}

                <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-400">
                  {missingRequiredSlots.length === 0
                    ? 'All required core parts are selected.'
                    : `${missingRequiredSlots.length} required ${missingRequiredSlots.length === 1 ? 'slot is' : 'slots are'} still missing.`}
                </div>
              </CardContent>
            </Card>
            ) : (
              <Card className="bg-white/5 border-white/10 text-white cursor-pointer hover:border-white/30 transition-colors" onClick={() => setReadinessExpanded(true)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Build Readiness</CardTitle>
                    <ChevronDown className="h-4 w-4 text-gray-400 rotate-180" />
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-gray-400">
                  {buildComplete ? 'All set! Ready to save.' : `${missingRequiredSlots.length} required parts missing.`}
                </CardContent>
              </Card>
            )}

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
                <div className="pt-3 border-t border-white/10 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cheapest Build Total</span>
                    <span className="text-white font-semibold">{formatAUD(totalPrice)}</span>
                  </div>
                  {pricingLoading && (
                    <p className="text-xs text-gray-500 animate-pulse">Fetching AU retailer prices...</p>
                  )}
                </div>
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
                  <Link href={shareUrl} className="block">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-500">
                      <Download className="h-4 w-4" />
                      View Full Showcase
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-gray-950/95 p-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTemplateModalOpen(true)}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            <Lightbulb className="h-4 w-4" />
            Templates
          </Button>
          {shareUrl ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => { navigator.clipboard.writeText(shareUrl); alert('Link copied!') }}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSaveBuild}
              disabled={partCount < 2 || saving}
              className="flex-1 bg-orange-600 hover:bg-orange-500"
            >
              {saving ? 'Saving...' : 'Save Build'}
            </Button>
          )}
        </div>
      </div>

      {/* Part Selector Modal */}
      {selectingSlot && (
        <PartSelectorModal
          slot={selectingSlot}
          category={BUILD_SLOTS.find(s => s.key === selectingSlot)!.category}
          filters={getCompatibilityFilters(selectingSlot, build)}
          onSelect={(part) => handleSelectPart(selectingSlot, part)}
          onClose={() => setSelectingSlot(null)}
        />
      )}

      {/* Template Modal */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="h-[95vh] w-full max-w-3xl overflow-hidden bg-gray-900 border-white/20 sm:h-auto sm:max-h-[90vh]">
            <CardHeader className="sticky top-0 bg-gray-900 border-b border-white/10 flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                Build Templates
              </CardTitle>
              <button type="button" onClick={() => setTemplateModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="max-h-[calc(95vh-72px)] overflow-y-auto p-4 sm:max-h-[75vh] space-y-4">
              <div className="flex flex-wrap gap-2">
                {(['all', 'gaming', 'workstation', 'content-creation', 'streaming', 'budget'] as const).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setTemplateCategory(category)}
                    className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
                      templateCategory === category
                        ? 'border-blue-500/70 bg-blue-500/20 text-blue-200'
                        : 'border-white/15 bg-white/[0.02] text-gray-400 hover:border-white/30 hover:text-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {visibleTemplates.map(template => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => loadTemplate(template)}
                  className="w-full text-left rounded-lg border border-white/10 bg-white/[0.03] hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm">{template.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                    </div>
                    <Badge variant={template.category === 'budget' ? 'secondary' : template.category === 'gaming' ? 'info' : 'success'} className="shrink-0 text-xs capitalize">
                      {template.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Est. {formatAUD(template.estimatedPrice)}</span>
                    {template.performance && <span className="text-blue-400">{template.performance}</span>}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
