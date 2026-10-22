import { useId, useMemo, useState, type PointerEvent } from 'react'
import { buildPaths } from '../lib/chart'
import { compactUsd, shortDate, usd } from '../lib/format'
import type { EquityPoint } from '../types'

const W = 800
const H = 260

interface Props {
  data: EquityPoint[]
  title: string
  subtitle?: string
}

export function EquityChart({ data, title, subtitle }: Props) {
  const [hover, setHover] = useState<number | null>(null)
  const gradientId = 'eq' + useId().replace(/:/g, '')
  const paths = useMemo(() => (data.length > 1 ? buildPaths(data.map((d) => d.value), W, H, 0.12) : null), [data])

  if (!paths) return <div className="skeleton skeleton--chart" />

  const ticks = [0, 1, 2, 3].map((k) => {
    const f = (k + 0.5) / 4
    return { top: f * 100, label: compactUsd(paths.max - (paths.max - paths.min) * f) }
  })
  const xLabels = [0, 0.25, 0.5, 0.75, 1].map((f) => shortDate(data[Math.round(f * (data.length - 1))].date))
  const active = hover ?? data.length - 1
  const [px, py] = paths.points[active]

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - rect.left) / rect.width) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, i)))
  }

  return (
    <>
      <div className="equity__head">
        <div>
          <h2 className="card__title">{title}</h2>
          {subtitle && <p className="card__sub">{subtitle}</p>}
        </div>
        <div className="equity__readout">
          <span className="equity__value">{usd(data[active].value)}</span>
          <span className="small muted">{hover === null ? 'Hoy, ' + shortDate(data[active].date) : shortDate(data[active].date)}</span>
        </div>
      </div>
      <div className="equity__grid">
        <div className="equity__y" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t.top} style={{ top: t.top + '%' }}>
              {t.label}
            </span>
          ))}
        </div>
        <div className="equity__body">
          <div className="equity__plot" onPointerMove={handleMove} onPointerLeave={() => setHover(null)} role="img" aria-label={'Evolución del capital: ' + usd(data[data.length - 1].value)}>
            {ticks.map((t) => (
              <div key={t.top} className="equity__gridline" style={{ top: t.top + '%' }} />
            ))}
            <svg className="equity__svg" viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none">
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="1" stopColor="#7C5CFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={paths.area} fill={'url(#' + gradientId + ')'} />
              <path d={paths.line} fill="none" stroke="#5B93FF" strokeWidth={2.2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
            {hover !== null && (
              <>
                <div className="equity__cursor" style={{ left: (px / W) * 100 + '%' }} />
                <div className="equity__dot" style={{ left: (px / W) * 100 + '%', top: (py / H) * 100 + '%' }} />
              </>
            )}
          </div>
          <div className="equity__x">
            {xLabels.map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
