'use client'

import { useEffect, useState } from 'react'
import {
  Search,
  X,
  Cpu,
  MemoryStick,
  Monitor,
  HardDrive,
  Zap,
  Box,
  Fan,
  Thermometer,
  AlertCircle,
} from 'lucide-react'
import type { Part, BuildSlotKey } from '@/lib/types'
import { fetchParts } from '@/lib/runtime/client-data'
import PartImage from './PartImage'

const SLOT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cpu: Cpu,
  motherboard: MemoryStick,
  ram: MemoryStick,
  gpu: Monitor,
  storage: HardDrive,
  psu: Zap,
  case: Box,
  cooler: Thermometer,
  fan: Fan,
}

interface Props {
  slot: BuildSlotKey
  category: string
  filters?: Record<string, string>
  onSelect: (part: Part) => void
  onClose: () => void
}

export default function PartSelectorModal({ slot, category, filters, onSelect, onClose }: Props) {
  const [parts, setParts] = useState<Part[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const normalizedFilters = Object.fromEntries(
      Object.entries(filters ?? {}).filter(([, value]) => value != null && value !== '')
    )

    async function loadParts() {
      try {
        const data = (await fetchParts({ category, q: query || undefined, filters: normalizedFilters })) as {
          parts?: Part[]
        }
        if (!controller.signal.aborted) {
          const filteredParts = (data.parts ?? []).filter((part) => part.category?.slug === category)
          setParts(filteredParts)
          setLoading(false)
        }
      } catch {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadParts()

    return () => controller.abort()
  }, [category, filters, query])

  const Icon = SLOT_ICONS[slot] ?? Cpu
  const isFiltered = Boolean(filters && Object.keys(filters).length > 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl border border-white/15 bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <h2 className="text-lg font-semibold capitalize text-white">
              Select {slot.replace('-', ' ')}
            </h2>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-sm text-gray-400">{loading ? '...' : parts.length} parts available</p>
              {isFiltered && (
                <span className="flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                  <AlertCircle className="h-3 w-3" />
                  Filtered for compatibility
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-white/10 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              autoFocus
              type="text"
              placeholder="Search parts..."
              value={query}
              onChange={(event) => {
                setLoading(true)
                setQuery(event.target.value)
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white transition-colors placeholder:text-gray-500 focus:border-blue-500/60 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))
          ) : parts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Icon className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p>No compatible parts found</p>
              {isFiltered && (
                <p className="mt-1 text-xs text-gray-600">Try removing a part to see all options</p>
              )}
            </div>
          ) : (
            parts.map((part) => (
              <button
                key={part.id}
                onClick={() => onSelect(part)}
                className="group flex w-full items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-600/10 p-1 text-blue-400">
                  <div className="relative h-full w-full">
                    <PartImage
                      category={category}
                      imageUrl={part.imageUrl}
                      alt={part.name}
                      className="object-contain"
                      sizes="44px"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white transition-colors group-hover:text-blue-300">
                    {part.name}
                  </p>
                  {part.description && (
                    <p className="mt-0.5 truncate text-xs text-gray-500">{part.description}</p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {part.socket && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {part.socket}
                      </span>
                    )}
                    {part.ramType && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {part.ramType}
                      </span>
                    )}
                    {part.formFactor && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {part.formFactor}
                      </span>
                    )}
                    {part.capacityGb && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {part.capacityGb >= 1000 ? `${part.capacityGb / 1000}TB` : `${part.capacityGb}GB`}
                      </span>
                    )}
                    {part.psuWatts && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {part.psuWatts}W
                      </span>
                    )}
                    {part.tdpWatts && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {part.tdpWatts}W TDP
                      </span>
                    )}
                    {part.cores && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {part.cores}C/{part.threads}T
                      </span>
                    )}
                    {part.heightMm && category === 'cooler' && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {part.heightMm}mm tall
                      </span>
                    )}
                    {part.psuFormFactor && category === 'psu' && (
                      <span className="rounded bg-gray-800 px-1.5 py-0.5 text-xs text-gray-300">
                        {part.psuFormFactor}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
