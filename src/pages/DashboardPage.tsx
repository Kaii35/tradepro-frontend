import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { EquityChart } from '../components/EquityChart'
import { KpiCard } from '../components/KpiCard'
import { PeriodSwitch } from '../components/PeriodSwitch'
import { PositionsList } from '../components/PositionsList'
import { StrategyDonut } from '../components/StrategyDonut'
import { TradesTable } from '../components/TradesTable'
import { SHOW_COP } from '../config'
import { useAsync } from '../hooks/useAsync'
import { cop, pct, usd } from '../lib/format'
import { api } from '../services/api'
import { PERIOD_DAYS } from '../services/mock'
import type { Period } from '../types'

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('30D')
  const summary = useAsync(() => api.getSummary(period), [period])
  const equity = useAsync(() => api.getEquity(period), [period])
  const strategies = useAsync(() => api.getStrategies(), [])
  const positions = useAsync(() => api.getPositions(), [])
  const trades = useAsync(() => api.getTrades(), [])
  const s = summary.data

  return (
    <div className="page">
      <div className="page__toolbar">
        <PeriodSwitch value={period} onChange={setPeriod} />
      </div>

      <div className="grid-kpi">
        {s ? (
          <>
            <KpiCard label="Saldo actual" value={usd(s.balance)} unit="USD" delta={pct(s.balanceDeltaPct)} deltaNote="vs. periodo anterior" color="#5B93FF" series={s.sparks.balance} />
            <KpiCard label="Rendimiento del periodo" value={pct(s.returnPct)} delta={pct(s.returnDeltaPct)} deltaNote="vs. periodo anterior" color="#34D399" series={s.sparks.returns} tone="pos" />
            {SHOW_COP ? (
              <KpiCard label="Equivalente en COP" value={cop(s.balanceCop)} unit="COP" delta={pct(s.balanceDeltaPct)} deltaNote={'TRM ' + s.copRate.toFixed(2)} color="#8B6CFF" series={s.sparks.cop} />
            ) : (
              <KpiCard label="Tasa de acierto" value={s.winRate + '%'} delta="+3.1%" deltaNote="vs. periodo anterior" color="#8B6CFF" series={s.sparks.cop} />
            )}
            <KpiCard label="Ganancia / Pérdida" value={usd(s.pnl, { sign: true })} unit="USD" delta={String(s.closedTrades)} deltaNote="operaciones cerradas" color="#F5B83D" series={s.sparks.pnl} tone={s.pnl >= 0 ? 'pos' : 'neg'} />
          </>
        ) : (
          [0, 1, 2, 3].map((i) => <div key={i} className="kpi skeleton" />)
        )}
      </div>

      <div className="row">
        <Card className="col-2">
          <EquityChart data={equity.data ?? []} title="Evolución del capital" subtitle={'Últimos ' + PERIOD_DAYS[period] + ' días' + (s ? ' · ' + pct(s.returnPct) : '')} />
        </Card>
        <Card className="col-1" title="Rendimiento por estrategia">
          {strategies.data ? <StrategyDonut items={strategies.data} totalPct={s?.totalReturnPct ?? 0} /> : <div className="skeleton skeleton--block" />}
        </Card>
      </div>

      <div className="row">
        <Card className="col-1" title="Posiciones abiertas" action={<span className="mono small muted">Exposición {s ? usd(s.exposure) : '—'}</span>}>
          {positions.data ? <PositionsList positions={positions.data} /> : <div className="skeleton skeleton--block" />}
        </Card>
        <Card className="col-2" title="Últimas operaciones" action={<Link className="link-btn" to="/operaciones">Ver todas →</Link>}>
          {trades.data ? <TradesTable trades={trades.data.slice(0, 5)} compact /> : <div className="skeleton skeleton--block" />}
        </Card>
      </div>

      {s && (
        <Card>
          <div className="stats">
            <Stat label="Operaciones ganadoras" value={s.winRate + '%'} className="pos" />
            <Stat label="Operaciones perdedoras" value={100 - s.winRate + '%'} className="neg" />
            <Stat label="Total de operaciones" value={String(s.closedTrades)} />
            <Stat label="Tiempo promedio" value={s.avgDurationHours + 'h'} />
            <Stat label="Drawdown máximo" value={pct(s.maxDrawdownPct, 1)} className="warn" />
          </div>
        </Card>
      )}
    </div>
  )
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <span className={'stat__value' + (className ? ' ' + className : '')}>{value}</span>
    </div>
  )
}
