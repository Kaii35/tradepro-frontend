import { pct, usd } from '../lib/format'
import type { StrategyPerformance } from '../types'

const R = 54
const C = 2 * Math.PI * R

export function StrategyDonut({ items, totalPct }: { items: StrategyPerformance[]; totalPct: number }) {
  let offset = 0
  const arcs = items.map((s) => {
    const len = (s.sharePct / 100) * C - 2
    const arc = { ...s, dash: len + ' ' + (C - len), offset: -offset }
    offset += (s.sharePct / 100) * C
    return arc
  })

  return (
    <>
      <div className="donut">
        <svg viewBox="0 0 140 140" role="img" aria-label="Distribución por estrategia">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#141C34" strokeWidth={16} />
          {arcs.map((a) => (
            <circle key={a.id} cx="70" cy="70" r={R} fill="none" stroke={a.color} strokeWidth={16} strokeDasharray={a.dash} strokeDashoffset={a.offset} />
          ))}
        </svg>
        <div className="donut__center">
          <span className="donut__value">{pct(totalPct)}</span>
          <span className="small muted">Total</span>
        </div>
      </div>
      <ul className="legend">
        {items.map((s) => (
          <li key={s.id}>
            <span className="legend__swatch" style={{ background: s.color }} />
            <span>{s.name}</span>
            <span className="mono small pos">{usd(s.pnl, { sign: true })}</span>
            <span className="mono small muted legend__share">{s.sharePct}%</span>
          </li>
        ))}
      </ul>
    </>
  )
}
