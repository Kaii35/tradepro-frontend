import { pct, price, tone, usd } from '../lib/format'
import type { Position } from '../types'
import { SideBadge } from './Badges'

export function PositionsList({ positions }: { positions: Position[] }) {
  return (
    <ul className="positions">
      {positions.map((p) => (
        <li key={p.id} className="position">
          <span className="position__pair">
            {p.pair} <SideBadge side={p.side} />
          </span>
          <span className={'position__pnl ' + tone(p.pnl)}>{usd(p.pnl, { sign: true })}</span>
          <span className="position__meta">
            {p.size.toFixed(2)} lot @ {price(p.entry)}
          </span>
          <span className={'position__meta num ' + tone(p.pnl)}>{pct(p.pnlPct)}</span>
        </li>
      ))}
    </ul>
  )
}
