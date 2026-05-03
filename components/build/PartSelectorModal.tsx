'use client'

import { useState, useEffect } from 'react'
import { Search, X, Cpu } from 'lucide-react'
import type { Part, BuildSlotKey } from '@/lib/types'

interface Props {
  slot: BuildSlotKey
  category: string
  onSelect: (part: Part) => void
  onClose: () => void
}

export default function PartSelectorModal({ slot, category, onSelect, onClose }: Props) {
  const [parts, setParts] = useState<Part[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const q = query ? `&q=${encodeURIComponent(query)}` : ''
    fetch(`/api/parts?category=${category}${q}`, { signal: controller.signal })
      .then(r => r.json())
      .then(d => { setParts(d.parts ?? []); setLoading(false) })
      .catch(() => {})
    return () => controller.abort()
  }, [category, query])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-gray-900 border border-white/15 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="font-semibold text-white text-lg capitalize">Select {slot.replace('-', ' ')}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{parts.length} parts available</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              autoFocus
              type="text"
              placeholder="Search parts…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500/60 transition-colors"
            />
          </div>
        </div>

        {/* Parts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />
            ))
          ) : parts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Cpu className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No parts found</p>
            </div>
          ) : (
            parts.map(part => (
              <button
                key={part.id}
                onClick={() => onSelect(part)}
                className="w-full flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-left group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 mt-0.5">
                  <Cpu className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">{part.name}</p>
                  {part.description && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{part.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {part.socket && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{part.socket}</span>}
                    {part.ramType && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{part.ramType}</span>}
                    {part.formFactor && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{part.formFactor}</span>}
                    {part.capacityGb && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{part.capacityGb >= 1000 ? `${part.capacityGb / 1000}TB` : `${part.capacityGb}GB`}</span>}
                    {part.psuWatts && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{part.psuWatts}W</span>}
                    {part.tdpWatts && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{part.tdpWatts}W TDP</span>}
                    {part.cores && <span className="text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-0.5">{part.cores}C/{part.threads}T</span>}
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
