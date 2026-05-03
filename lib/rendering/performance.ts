// RigMate AU – Performance Estimation Engine
// Uses seeded benchmark data. NO paid APIs.
// Provides estimates only – see disclaimer.

import type { BuildState, PerformanceEstimate } from '@/lib/types'

export const PERFORMANCE_DISCLAIMER =
  'FPS estimates are approximate and based on typical settings at each resolution. ' +
  'Actual performance varies by game, driver version, and system configuration. ' +
  'RigMate AU makes no guarantee of accuracy.'

type GpuTier = 'entry' | 'mid' | 'high' | 'ultra'

/** Map GPU model keywords → tier */
const GPU_TIER_MAP: Array<{ keywords: string[]; tier: GpuTier; fps1080: number; fps1440: number; fps4k: number }> = [
  // ── RTX 5000 (Blackwell) ───────────────────────────────────────────────────
  { keywords: ['5090'],                                  tier: 'ultra', fps1080: 260, fps1440: 225, fps4k: 155 },
  { keywords: ['5080'],                                  tier: 'ultra', fps1080: 215, fps1440: 180, fps4k: 112 },
  { keywords: ['5070 ti', '5070ti'],                     tier: 'ultra', fps1080: 190, fps1440: 158, fps4k: 95  },
  { keywords: ['5070'],                                  tier: 'high',  fps1080: 165, fps1440: 138, fps4k: 78  },
  { keywords: ['5060 ti', '5060ti'],                     tier: 'high',  fps1080: 140, fps1440: 108, fps4k: 54  },
  { keywords: ['5060'],                                  tier: 'mid',   fps1080: 118, fps1440: 88,  fps4k: 44  },
  // ── RTX 4000 (Ada Lovelace) ───────────────────────────────────────────────
  { keywords: ['4090'],                                  tier: 'ultra', fps1080: 200, fps1440: 165, fps4k: 100 },
  { keywords: ['4080 super', '4080s'],                   tier: 'ultra', fps1080: 185, fps1440: 150, fps4k: 88  },
  { keywords: ['4080'],                                  tier: 'ultra', fps1080: 180, fps1440: 145, fps4k: 85  },
  { keywords: ['4070 ti super', '4070ti super'],         tier: 'high',  fps1080: 165, fps1440: 135, fps4k: 75  },
  { keywords: ['4070 ti', '4070ti'],                     tier: 'high',  fps1080: 155, fps1440: 125, fps4k: 68  },
  { keywords: ['4070 super', '4070s'],                   tier: 'high',  fps1080: 150, fps1440: 118, fps4k: 62  },
  { keywords: ['4070'],                                  tier: 'high',  fps1080: 140, fps1440: 110, fps4k: 56  },
  { keywords: ['4060 ti', '4060ti'],                     tier: 'mid',   fps1080: 120, fps1440: 88,  fps4k: 42  },
  { keywords: ['4060'],                                  tier: 'mid',   fps1080: 105, fps1440: 76,  fps4k: 36  },
  // ── RX 9000 (RDNA4) ──────────────────────────────────────────────────────
  { keywords: ['9070 xt', '9070xt'],                     tier: 'high',  fps1080: 168, fps1440: 140, fps4k: 82  },
  { keywords: ['9070'],                                  tier: 'high',  fps1080: 152, fps1440: 126, fps4k: 72  },
  { keywords: ['9060 xt', '9060xt'],                     tier: 'mid',   fps1080: 125, fps1440: 95,  fps4k: 48  },
  // ── RX 7000 (RDNA3) ──────────────────────────────────────────────────────
  { keywords: ['7900 xtx', '7900xtx'],                   tier: 'ultra', fps1080: 195, fps1440: 160, fps4k: 96  },
  { keywords: ['7900 xt', '7900xt'],                     tier: 'high',  fps1080: 175, fps1440: 142, fps4k: 82  },
  { keywords: ['7800 xt', '7800xt'],                     tier: 'high',  fps1080: 145, fps1440: 115, fps4k: 58  },
  { keywords: ['7700 xt', '7700xt'],                     tier: 'mid',   fps1080: 125, fps1440: 92,  fps4k: 44  },
  { keywords: ['7600 xt', '7600xt'],                     tier: 'mid',   fps1080: 108, fps1440: 80,  fps4k: 40  },
  { keywords: ['7600'],                                  tier: 'mid',   fps1080: 98,  fps1440: 70,  fps4k: 36  },
  // ── RX 6000 (RDNA2) ──────────────────────────────────────────────────────
  { keywords: ['6800 xt', '6800xt'],                     tier: 'high',  fps1080: 138, fps1440: 108, fps4k: 52  },
  { keywords: ['6700 xt', '6700xt'],                     tier: 'mid',   fps1080: 110, fps1440: 80,  fps4k: 38  },
  // ── RTX 3000 (Ampere) ────────────────────────────────────────────────────
  { keywords: ['3090 ti', '3090ti'],                     tier: 'high',  fps1080: 165, fps1440: 132, fps4k: 76  },
  { keywords: ['3090'],                                  tier: 'high',  fps1080: 158, fps1440: 126, fps4k: 72  },
  { keywords: ['3080 ti', '3080ti'],                     tier: 'high',  fps1080: 152, fps1440: 122, fps4k: 70  },
  { keywords: ['3080'],                                  tier: 'high',  fps1080: 142, fps1440: 112, fps4k: 60  },
  { keywords: ['3070 ti', '3070ti'],                     tier: 'mid',   fps1080: 128, fps1440: 96,  fps4k: 46  },
  { keywords: ['3070'],                                  tier: 'mid',   fps1080: 120, fps1440: 90,  fps4k: 42  },
  { keywords: ['3060 ti', '3060ti'],                     tier: 'mid',   fps1080: 112, fps1440: 80,  fps4k: 38  },
  { keywords: ['3060'],                                  tier: 'mid',   fps1080: 95,  fps1440: 68,  fps4k: 30  },
  // ── Entry fallback ────────────────────────────────────────────────────────
  { keywords: ['rx 580', 'rx580', 'rx 570'],             tier: 'entry', fps1080: 58,  fps1440: 38,  fps4k: 18  },
  { keywords: ['1060', '1660', '2060'],                  tier: 'entry', fps1080: 68,  fps1440: 44,  fps4k: 20  },
]

/** Adjust FPS based on CPU tier (rough multiplier) */
function cpuMultiplier(cpuModel: string): number {
  const model = cpuModel.toLowerCase()
  if (model.includes('7950x') || model.includes('7900x')) return 1.05
  if (model.includes('7800x3d') || model.includes('7700x')) return 1.04
  if (model.includes('7600x') || model.includes('7600')) return 1.02
  if (model.includes('5800x3d')) return 1.03
  if (model.includes('5900x') || model.includes('5800x')) return 1.02
  if (model.includes('5600x') || model.includes('5600')) return 1.00
  if (model.includes('12900k') || model.includes('13900k') || model.includes('14900k')) return 1.05
  if (model.includes('12700k') || model.includes('13700k') || model.includes('14700k')) return 1.03
  if (model.includes('12600k') || model.includes('13600k') || model.includes('14600k')) return 1.01
  return 1.0
}

export function estimatePerformance(build: BuildState): PerformanceEstimate | null {
  const gpu = build.gpu
  if (!gpu) return null

  const name = `${gpu.brand} ${gpu.model}`.toLowerCase()

  // Check for seeded exact values first
  if (gpu.fps1080p && gpu.fps1440p && gpu.fps4K) {
    const tier = getTierFromFps(gpu.fps1080p)
    return {
      fps1080p: gpu.fps1080p,
      fps1440p: gpu.fps1440p,
      fps4K: gpu.fps4K,
      tier,
      disclaimer: PERFORMANCE_DISCLAIMER,
    }
  }

  // Fall back to keyword matching
  const match = GPU_TIER_MAP.find(entry =>
    entry.keywords.some(kw => name.includes(kw))
  )

  if (!match) return null

  const mult = build.cpu ? cpuMultiplier(`${build.cpu.brand} ${build.cpu.model}`) : 1.0

  return {
    fps1080p: Math.round(match.fps1080 * mult),
    fps1440p: Math.round(match.fps1440 * mult),
    fps4K: Math.round(match.fps4k * mult),
    tier: match.tier,
    disclaimer: PERFORMANCE_DISCLAIMER,
  }
}

function getTierFromFps(fps: number): GpuTier {
  if (fps >= 160) return 'ultra'
  if (fps >= 120) return 'high'
  if (fps >= 80) return 'mid'
  return 'entry'
}
