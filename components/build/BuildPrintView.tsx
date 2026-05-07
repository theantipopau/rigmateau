import type { BuildExportSnapshot } from '@/lib/builds/export'
import type { SavedBuild } from '@/lib/types'
import { formatAUD } from '@/lib/utils'
import { PERFORMANCE_DISCLAIMER } from '@/lib/rendering/performance'
import MonetizationDisclosure from '@/components/common/MonetizationDisclosure'

interface Props {
  build: SavedBuild
  snapshot: BuildExportSnapshot
}

export default function BuildPrintView({ build, snapshot }: Props) {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="border-b border-slate-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
            RigMate AU
          </p>
          <h1 className="mt-2 text-4xl font-bold">{build.name}</h1>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
            {build.purpose && <span>{build.purpose}</span>}
            <span>Compatibility: {snapshot.compatibility.overallStatus}</span>
            <span>Estimated system draw: {snapshot.compatibility.estimatedWatts}W</span>
            <span>Generated for PDF export</span>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Best Overall Total
            </p>
            <p className="mt-2 text-3xl font-bold">{formatAUD(snapshot.bestOverallTotal)}</p>
            <p className="mt-1 text-sm text-slate-500">Cheapest landed combination across all sources.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              AU Retail Total
            </p>
            <p className="mt-2 text-3xl font-bold">
              {snapshot.bestLocalTotal ? formatAUD(snapshot.bestLocalTotal) : 'Partial'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {snapshot.hasCompleteLocalCoverage
                ? 'Best local-AU option for every part.'
                : 'Not every part has a local-AU listing yet.'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Performance
            </p>
            <p className="mt-2 text-3xl font-bold">
              {snapshot.performance ? snapshot.performance.tier.toUpperCase() : 'N/A'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {snapshot.performance
                ? `1080p ~${snapshot.performance.fps1080p ?? '-'} FPS / 1440p ~${snapshot.performance.fps1440p ?? '-'} FPS`
                : 'Add a GPU to unlock performance estimates.'}
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Selected Part</th>
                <th className="px-4 py-3">Best Overall</th>
                <th className="px-4 py-3">Best AU Retailer</th>
              </tr>
            </thead>
            <tbody>
              {snapshot.parts.map((item) => (
                <tr key={item.part.id} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-600">{item.slotLabel}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{item.part.name}</p>
                    {item.part.description && (
                      <p className="mt-1 text-sm text-slate-500">{item.part.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {item.bestOverall ? (
                      <>
                        <p className="font-semibold">
                          {formatAUD(item.bestOverall.listing.landedCost)}
                        </p>
                        <p className="text-slate-500">
                          {item.bestOverall.listing.retailer.name}
                          {item.bestOverall.listing.coverage === 'projected' ? ' (projected)' : ''}
                        </p>
                      </>
                    ) : (
                      <span className="text-slate-400">No price data</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {item.bestLocal ? (
                      <>
                        <p className="font-semibold">
                          {formatAUD(item.bestLocal.listing.landedCost)}
                        </p>
                        <p className="text-slate-500">
                          {item.bestLocal.listing.retailer.name}
                          {item.bestLocal.listing.coverage === 'projected' ? ' (projected)' : ''}
                        </p>
                      </>
                    ) : (
                      <span className="text-slate-400">No local listing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold">Compatibility Notes</h2>
            <div className="mt-4 space-y-3">
              {snapshot.compatibility.results.slice(0, 8).map((result, index) => (
                <div key={`${result.rule}-${index}`} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">{result.rule}</p>
                  <p className="mt-1 text-sm text-slate-600">{result.explanation}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold">Buying Guidance</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>Use AU retailers first for GPUs, PSUs, RAM, storage, and monitors where warranty risk is highest.</p>
              <p>AliExpress is better reserved for lower-risk categories such as coolers, fans, and some cases.</p>
              <p>eBay AU can bridge price gaps, but seller feedback and return history still matter.</p>
              <p>
                {PERFORMANCE_DISCLAIMER}
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-500">
          <p>RigMate AU export view. Prices and availability are indicative only and should be verified before purchase.</p>
          <MonetizationDisclosure className="mt-2 text-xs text-slate-500" />
        </footer>
      </div>
    </main>
  )
}
