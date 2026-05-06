'use client'

import { CheckCircle2, AlertTriangle, Shield, HelpCircle, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import type { CompatibilityReport, CompatibilityResult } from '@/lib/types'

interface Props {
  report: CompatibilityReport
}

function ResultIcon({ status }: { status: CompatibilityResult['status'] }) {
  switch (status) {
    case 'compatible': return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
    case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
    case 'incompatible': return <Shield className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
    default: return <HelpCircle className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
  }
}

function overallBadgeVariant(status: CompatibilityReport['overallStatus']): NonNullable<BadgeProps['variant']> {
  if (status === 'compatible') return 'success'
  if (status === 'warning') return 'warning'
  if (status === 'incompatible') return 'danger'
  return 'secondary'
}

export default function CompatibilityPanel({ report }: Props) {
  const issues = report.results.filter(r => r.status !== 'compatible')
  const passes = report.results.filter(r => r.status === 'compatible')

  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Compatibility</CardTitle>
          <Badge variant={overallBadgeVariant(report.overallStatus)} className="capitalize">
            {report.overallStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {/* Power estimate */}
        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
          <Zap className="h-4 w-4 text-yellow-400" />
          <div>
            <p className="font-medium text-white">{report.estimatedWatts}W estimated draw</p>
            <p className="text-xs text-gray-400">Recommend ≥{report.recommendedPsuWatts}W PSU</p>
          </div>
        </div>

        {/* Issues / Warnings */}
        {issues.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Issues</p>
            {issues.map((result, i) => (
              <div key={i} className="flex gap-2 p-2.5 rounded-lg bg-white/[0.03]">
                <ResultIcon status={result.status} />
                <div>
                  <p className="text-xs font-medium text-gray-200">{result.rule}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{result.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Passes */}
        {passes.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Passed</p>
            {passes.map((result, i) => (
              <div key={i} className="flex gap-2 items-start p-2 rounded-lg">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400">{result.rule}</p>
              </div>
            ))}
          </div>
        )}

        {report.results.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-2">Add more parts to check compatibility</p>
        )}
      </CardContent>
    </Card>
  )
}
