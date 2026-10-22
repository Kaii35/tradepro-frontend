import { useMemo, useState } from 'react'
import { Card } from '../components/Card'
import { TradesTable } from '../components/TradesTable'
import { useAsync } from '../hooks/useAsync'
import { tone, usd } from '../lib/format'
import { api } from '../services/api'

type Filter = 'all' | 'win' | 'loss'

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'win', label: 'Ganadoras' },
  { id: 'loss', label: 'Perdedoras' },
]

export default function TradesPage() {
  const { data, loading } = useAsync(() => api.getTrades(), [])
  const [filter, setFilter] = useState<Filter>('all')

  const groups = useMemo(() => {
    const all = data ?? []
    return { all, win: all.filter((t) => t.pnl >= 0), loss: all.filter((t) => t.pnl < 0) }
  }, [data])

  const list = groups[filter]
  const total = list.reduce((acc, t) => acc + t.pnl, 0)

  return (
    <div className="page">
      <Card>
        <div className="page__toolbar page__toolbar--between">
          <div className="chips" role="tablist" aria-label="Filtrar operaciones">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" role="tab" aria-selected={filter === f.id} className={'chip' + (filter === f.id ? ' is-active' : '')} onClick={() => setFilter(f.id)}>
                {f.label}
                <span className="chip__count">{groups[f.id].length}</span>
              </button>
            ))}
          </div>
          <span className="small muted">
            {'P&L filtrado '}
            <strong className={'mono ' + tone(total)}>{usd(total, { sign: true })}</strong>
          </span>
        </div>
        {loading ? <div className="skeleton skeleton--block" /> : <TradesTable trades={list} />}
      </Card>
    </div>
  )
}
