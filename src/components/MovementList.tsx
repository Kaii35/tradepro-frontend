import { dateTime, usd } from '../lib/format'
import type { Movement } from '../types'
import { StatusBadge } from './Badges'
import { Icon } from './Icon'

export function MovementList({ items }: { items: Movement[] }) {
  return (
    <ul className="moves">
      {items.map((m) => {
        const deposit = m.type === 'deposit'
        return (
          <li key={m.id} className="move">
            <span className={'move__icon ' + (deposit ? 'move__icon--in' : 'move__icon--out')}>
              <Icon name={deposit ? 'down' : 'up'} strokeWidth={2.2} />
            </span>
            <div className="move__body">
              <span className="move__title">
                {deposit ? 'Depósito' : 'Retiro'} · {m.asset}
              </span>
              <span className="move__meta">
                {m.network} · {m.txHash} · {dateTime(m.date)}
              </span>
            </div>
            <div className="move__right">
              <span className={'move__amount' + (deposit ? ' pos' : '')}>{usd(m.amount, { sign: true })}</span>
              <StatusBadge status={m.status} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
