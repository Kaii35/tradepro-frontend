import { useMemo } from 'react'
import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { MovementList } from '../components/MovementList'
import { useAsync } from '../hooks/useAsync'
import { usd } from '../lib/format'
import { api } from '../services/api'
import type { Movement } from '../types'

export default function MovementsPage() {
  const { data } = useAsync(() => api.getMovements(), [])

  const totals = useMemo(() => {
    const list = data ?? []
    const sum = (f: (m: Movement) => boolean) => list.filter(f).reduce((acc, m) => acc + Math.abs(m.amount), 0)
    return {
      deposited: sum((m) => m.type === 'deposit' && m.status === 'completed'),
      withdrawn: sum((m) => m.type === 'withdrawal' && m.status === 'completed'),
      pending: sum((m) => m.status === 'pending'),
    }
  }, [data])

  return (
    <div className="page">
      <div className="page__toolbar">
        <button type="button" className="btn btn--primary btn--sm">
          <Icon name="down" size={16} />
          Depositar
        </button>
        <button type="button" className="btn btn--sm">
          <Icon name="up" size={16} />
          Retirar
        </button>
      </div>

      <div className="grid-3">
        <div className="card stat">
          <span className="stat__label">Total depositado</span>
          <span className="stat__value">{usd(totals.deposited)}</span>
        </div>
        <div className="card stat">
          <span className="stat__label">Total retirado</span>
          <span className="stat__value">{usd(totals.withdrawn)}</span>
        </div>
        <div className="card stat">
          <span className="stat__label">Pendiente</span>
          <span className="stat__value warn">{usd(totals.pending)}</span>
        </div>
      </div>

      <Card title="Depósitos y retiros">{data ? <MovementList items={data} /> : <div className="skeleton skeleton--block" />}</Card>
    </div>
  )
}
