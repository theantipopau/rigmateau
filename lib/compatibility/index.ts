// RigMate AU – Compatibility Engine
// Modular, rule-based compatibility checks for PC builds
// Returns: compatible | warning | incompatible | unknown

import type {
  BuildState,
  CompatibilityResult,
  CompatibilityReport,
  CompatibilityStatus,
  Part,
} from '@/lib/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeResult(
  status: CompatibilityStatus,
  rule: string,
  explanation: string,
  parts: string[],
  severity: 'error' | 'warning' | 'info' = 'error',
): CompatibilityResult {
  return { status, rule, explanation, severity, parts }
}

function worstStatus(statuses: CompatibilityStatus[]): CompatibilityStatus {
  if (statuses.includes('incompatible')) return 'incompatible'
  if (statuses.includes('warning')) return 'warning'
  if (statuses.includes('unknown')) return 'unknown'
  return 'compatible'
}

// ─── Individual Checks ───────────────────────────────────────────────────────

/** CPU socket must match motherboard socket */
function checkCpuSocket(cpu: Part, mb: Part): CompatibilityResult {
  if (!cpu.socket || !mb.socket) {
    return makeResult('unknown', 'CPU Socket', 'Socket information missing for CPU or motherboard.', [cpu.name, mb.name], 'warning')
  }
  if (cpu.socket !== mb.socket) {
    return makeResult(
      'incompatible',
      'CPU Socket',
      `${cpu.name} uses socket ${cpu.socket}, but ${mb.name} requires socket ${mb.socket}. These are incompatible.`,
      [cpu.name, mb.name],
    )
  }
  return makeResult('compatible', 'CPU Socket', `${cpu.name} (${cpu.socket}) is compatible with ${mb.name}.`, [cpu.name, mb.name], 'info')
}

/** RAM type must match motherboard */
function checkRamType(ram: Part, mb: Part): CompatibilityResult {
  if (!ram.ramType || !mb.ramType) {
    return makeResult('unknown', 'RAM Type', 'RAM type information missing.', [ram.name, mb.name], 'warning')
  }
  if (ram.ramType !== mb.ramType) {
    return makeResult(
      'incompatible',
      'RAM Type',
      `${ram.name} is ${ram.ramType}, but ${mb.name} supports ${mb.ramType}. RAM is physically incompatible.`,
      [ram.name, mb.name],
    )
  }
  return makeResult('compatible', 'RAM Type', `${ram.name} (${ram.ramType}) is compatible with ${mb.name}.`, [ram.name, mb.name], 'info')
}

/** Motherboard form factor must fit in case */
function checkFormFactor(mb: Part, pcCase: Part): CompatibilityResult {
  const hierarchy: Record<string, number> = { ITX: 1, mATX: 2, ATX: 3, 'E-ATX': 4 }

  if (!mb.formFactor || !pcCase.formFactor) {
    return makeResult('unknown', 'Form Factor', 'Form factor information missing.', [mb.name, pcCase.name], 'warning')
  }

  const mbLevel = hierarchy[mb.formFactor] ?? 99
  const caseLevel = hierarchy[pcCase.formFactor] ?? 99

  if (mbLevel > caseLevel) {
    return makeResult(
      'incompatible',
      'Form Factor',
      `${mb.name} (${mb.formFactor}) is too large for ${pcCase.name} (supports up to ${pcCase.formFactor}).`,
      [mb.name, pcCase.name],
    )
  }
  return makeResult('compatible', 'Form Factor', `${mb.name} (${mb.formFactor}) fits in ${pcCase.name}.`, [mb.name, pcCase.name], 'info')
}

/** GPU length must fit in case */
function checkGpuLength(gpu: Part, pcCase: Part): CompatibilityResult {
  if (!gpu.lengthMm || !pcCase.lengthMm) {
    return makeResult('unknown', 'GPU Clearance', 'GPU length or case GPU clearance not specified.', [gpu.name, pcCase.name], 'warning')
  }
  if (gpu.lengthMm > pcCase.lengthMm) {
    return makeResult(
      'incompatible',
      'GPU Clearance',
      `${gpu.name} is ${gpu.lengthMm}mm long but ${pcCase.name} only supports GPUs up to ${pcCase.lengthMm}mm.`,
      [gpu.name, pcCase.name],
    )
  }
  if (gpu.lengthMm > pcCase.lengthMm - 20) {
    return makeResult(
      'warning',
      'GPU Clearance',
      `${gpu.name} (${gpu.lengthMm}mm) is close to the ${pcCase.name} limit (${pcCase.lengthMm}mm). Check cable routing.`,
      [gpu.name, pcCase.name],
      'warning',
    )
  }
  return makeResult('compatible', 'GPU Clearance', `${gpu.name} fits in ${pcCase.name} with clearance.`, [gpu.name, pcCase.name], 'info')
}

/** CPU cooler height must fit in case */
function checkCoolerHeight(cooler: Part, pcCase: Part): CompatibilityResult {
  if (!cooler.heightMm || !pcCase.heightMm) {
    return makeResult('unknown', 'Cooler Clearance', 'Cooler height or case clearance not specified.', [cooler.name, pcCase.name], 'warning')
  }
  if (cooler.heightMm > pcCase.heightMm) {
    return makeResult(
      'incompatible',
      'Cooler Clearance',
      `${cooler.name} is ${cooler.heightMm}mm tall but ${pcCase.name} only supports coolers up to ${pcCase.heightMm}mm.`,
      [cooler.name, pcCase.name],
    )
  }
  return makeResult('compatible', 'Cooler Clearance', `${cooler.name} (${cooler.heightMm}mm) fits in ${pcCase.name}.`, [cooler.name, pcCase.name], 'info')
}

/** PSU form factor must match case */
function checkPsuFormFactor(psu: Part, pcCase: Part): CompatibilityResult {
  if (!psu.psuFormFactor || !pcCase.psuFormFactor) {
    return makeResult('unknown', 'PSU Form Factor', 'PSU or case form factor not specified.', [psu.name, pcCase.name], 'warning')
  }
  if (psu.psuFormFactor !== pcCase.psuFormFactor) {
    // SFX PSU can go in ATX case with adapter; ATX PSU cannot go in SFX case
    if (psu.psuFormFactor === 'ATX' && pcCase.psuFormFactor === 'SFX') {
      return makeResult(
        'incompatible',
        'PSU Form Factor',
        `${pcCase.name} requires an SFX PSU, but ${psu.name} is ATX. An ATX PSU will not fit.`,
        [psu.name, pcCase.name],
      )
    }
    return makeResult(
      'warning',
      'PSU Form Factor',
      `${psu.name} (${psu.psuFormFactor}) may need an adapter to fit ${pcCase.name} (${pcCase.psuFormFactor}).`,
      [psu.name, pcCase.name],
      'warning',
    )
  }
  return makeResult('compatible', 'PSU Form Factor', `${psu.name} form factor matches ${pcCase.name}.`, [psu.name, pcCase.name], 'info')
}

/** Estimate total system wattage and check against PSU */
function estimateWattage(build: BuildState): { watts: number; results: CompatibilityResult[] } {
  let watts = 75 // base system (fans, storage, MB)
  const results: CompatibilityResult[] = []

  if (build.cpu?.tdpWatts) watts += build.cpu.tdpWatts
  if (build.gpu?.tdpWatts) watts += build.gpu.tdpWatts
  if (build.ram) watts += 10
  if (build.storage) watts += 5

  const recommended = Math.ceil((watts * 1.25) / 50) * 50 // 25% headroom, round to 50W

  if (build.psu?.psuWatts) {
    const psuWatts = build.psu.psuWatts
    if (psuWatts < watts) {
      results.push(makeResult(
        'incompatible',
        'PSU Wattage',
        `Estimated system draw is ${watts}W but ${build.psu.name} is rated at only ${psuWatts}W. System will be unstable.`,
        [build.psu.name],
      ))
    } else if (psuWatts < recommended) {
      results.push(makeResult(
        'warning',
        'PSU Wattage',
        `${build.psu.name} (${psuWatts}W) is close to estimated load (${watts}W). Recommend at least ${recommended}W for headroom.`,
        [build.psu.name],
        'warning',
      ))
    } else {
      results.push(makeResult(
        'compatible',
        'PSU Wattage',
        `${build.psu.name} (${psuWatts}W) provides adequate power (estimated ${watts}W load, ${recommended}W recommended).`,
        [build.psu.name],
        'info',
      ))
    }
  }

  return { watts, results }
}

/** BIOS update warning: AM5 boards generally don't need this, but older AM4 boards do */
function checkBiosWarning(cpu: Part, mb: Part): CompatibilityResult[] {
  const results: CompatibilityResult[] = []

  if (mb.socket === 'AM4' && cpu.socket === 'AM4') {
    const ryzen5000 = ['5600', '5700', '5800', '5900', '5950'].some(m => cpu.model.includes(m))
    if (ryzen5000) {
      results.push(makeResult(
        'warning',
        'BIOS Update',
        `Some ${mb.brand} ${mb.model} boards require a BIOS update to support Ryzen 5000 series. Verify BIOS version before buying.`,
        [cpu.name, mb.name],
        'warning',
      ))
    }
  }
  return results
}

// ─── Main Compatibility Engine ───────────────────────────────────────────────

export function checkCompatibility(build: BuildState): CompatibilityReport {
  const results: CompatibilityResult[] = []

  const { cpu, motherboard: mb, ram, gpu, psu, case: pcCase, cooler } = build

  if (cpu && mb) {
    results.push(checkCpuSocket(cpu, mb))
    results.push(...checkBiosWarning(cpu, mb))
  }

  if (ram && mb) {
    results.push(checkRamType(ram, mb))
  }

  if (mb && pcCase) {
    results.push(checkFormFactor(mb, pcCase))
  }

  if (gpu && pcCase) {
    results.push(checkGpuLength(gpu, pcCase))
  }

  if (cooler && pcCase) {
    results.push(checkCoolerHeight(cooler, pcCase))
  }

  if (psu && pcCase) {
    results.push(checkPsuFormFactor(psu, pcCase))
  }

  const { watts, results: wattResults } = estimateWattage(build)
  results.push(...wattResults)

  const recommended = Math.ceil((watts * 1.25) / 50) * 50

  // Filter out unknowns from "overall" – only use definitive results
  const definitive = results.filter(r => r.status !== 'unknown')
  const overallStatus = definitive.length > 0
    ? worstStatus(definitive.map(r => r.status))
    : worstStatus(results.map(r => r.status))

  return {
    overallStatus,
    results,
    estimatedWatts: watts,
    recommendedPsuWatts: recommended,
  }
}
