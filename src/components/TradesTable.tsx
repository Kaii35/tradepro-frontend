import { dateTime, price, tone, usd } from '../lib/format'
import type { Trade } from '../types'
import { SideBadge } from './Badges'

/** Tabla en escritorio; tarjetas en móvil (se alterna por CSS). */
export function TradesTable({ trades, compact = false }: { trades: Trade[]; compact?: boolean }) {
  if (!trades.length) return <p className="empty">No hay operaciones para este filtro.</p>

  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Instrumento</th>
              <th>Tipo</th>
              <th>Estrategia</th>
              {!compact && (
                <>
                  <th className="num">Entrada</th>
                  <th className="num">Salida</th>
                  <th className="num">Tamaño</th>
                </>
              )}
              <th className="num">Resultado</th>
              <th className="num">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t.id}>
                <td className="strong">{t.pair}</td>
                <td>
                  <SideBadge side={t.side} />
                </td>
                <td className="text-3">{t.strategy}</td>
                {!compact && (
                  <>
                    <td className="num text-2">{price(t.entry)}</td>
                    <td className="num text-2">{price(t.exit)}</td>
                    <td className="num muted">{t.size.toFixed(2)} lot</td>
                  </>
                )}
                <td className={'num strong ' + tone(t.pnl)}>{usd(t.pnl, { sign: true })}</td>
                <td className="num muted small">{dateTime(t.closedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="trade-cards">
        {trades.map((t) => (
          <li key={t.id} className="trade-card">
            <div className="trade-card__top">
              <span className="position__pair">
                {t.pair} <SideBadge side={t.side} />
              </span>
              <span className={'mono strong ' + tone(t.pnl)}>{usd(t.pnl, { sign: true })}</span>
            </div>
            {compact ? (
              <div className="trade-card__meta">
                <span>{t.strategy}</span>
                <span className="mono">{dateTime(t.closedAt)}</span>
              </div>
            ) : (
              <div className="trade-card__grid">
                <div>
                  <span>Entrada</span>
                  <strong>{price(t.entry)}</strong>
                </div>
                <div>
                  <span>Salida</span>
                  <strong>{price(t.exit)}</strong>
                </div>
                <div className="num">
                  <span>{t.strategy}</span>
                  <strong>{dateTime(t.closedAt)}</strong>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
