import { useMemo } from 'react'
import { buildPaths } from '../lib/chart'

export function Sparkline({ values, color, className }: { values: number[]; color: string; className?: string }) {
  const p = useMemo(() => buildPaths(values, 120, 36, 0.3), [values])
  return (
    <svg className={className} viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden="true">
      <path d={p.area} fill={color} fillOpacity={0.14} />
      <path d={p.line} fill="none" stroke={color} strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
