import type { EquityPoint, Movement, Period, Position, Side, StrategyPerformance, Summary, Trade } from '../types'

// Datos de ejemplo deterministas. Elimínalos cuando conectes el backend real.

const END = new Date('2026-10-20T18:00:00')
const BALANCE = 42785.32
const COP_RATE = 4219.8

export const PERIOD_DAYS: Record<Period, number> = { '7D': 7, '30D': 30, '90D': 90 }
const PERIOD_POINTS: Record<Period, number> = { '7D': 28, '30D': 30, '90D': 45 }
const PERIOD_START: Record<Period, number> = { '7D': 40850, '30D': 38000, '90D': 31200 }

function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function walk(n: number, seed: number, start: number, end: number, vol: number): number[] {
  const r = rng(seed)
  const v = [start]
  for (let i = 1; i < n; i++) v.push(v[i - 1] * (1 + (r() - 0.45) * vol))
  const drift = end - v[n - 1]
  return v.map((x, i) => x + drift * (i / (n - 1)))
}

const spark = (seed: number) => walk(20, seed, 80, 100, 0.05)

export function mockEquity(period: Period): EquityPoint[] {
  const days = PERIOD_DAYS[period]
  const n = PERIOD_POINTS[period]
  return walk(n, days * 7 + 3, PERIOD_START[period], BALANCE, 0.028).map((value, i) => ({
    date: new Date(END.getTime() - (1 - i / (n - 1)) * days * 864e5).toISOString(),
    value,
  }))
}

export function mockSummary(period: Period): Summary {
  const start = PERIOD_START[period]
  return {
    balance: BALANCE,
    balanceDeltaPct: 8.24,
    balanceCop: BALANCE * COP_RATE,
    copRate: COP_RATE,
    returnPct: ((BALANCE - start) / start) * 100,
    returnDeltaPct: 2.71,
    pnl: BALANCE - start,
    totalReturnPct: 12.47,
    closedTrades: 124,
    winRate: 86,
    avgDurationHours: 1.8,
    maxDrawdownPct: -4.2,
    exposure: 8420,
    sparks: { balance: spark(11), returns: spark(22), cop: spark(33), pnl: spark(44) },
  }
}

export const mockStrategies: StrategyPerformance[] = [
  { id: 'gold', name: 'Estrategia Oro', sharePct: 32.1, pnl: 1536, color: '#F5B83D' },
  { id: 'us100', name: 'Estrategia US100', sharePct: 28.7, pnl: 1373, color: '#3B82F6' },
  { id: 'us500', name: 'Estrategia US500', sharePct: 24.5, pnl: 1172, color: '#8B6CFF' },
  { id: 'eurusd', name: 'Estrategia EURUSD', sharePct: 14.7, pnl: 704, color: '#22C55E' },
]

export const mockPositions: Position[] = [
  { id: 'p1', pair: 'XAUUSD', side: 'buy', size: 0.5, entry: 2396.4, pnl: 182.4, pnlPct: 0.76 },
  { id: 'p2', pair: 'US100', side: 'sell', size: 0.3, entry: 19912, pnl: -46.1, pnlPct: -0.23 },
  { id: 'p3', pair: 'EURUSD', side: 'buy', size: 1, entry: 1.0858, pnl: 64, pnlPct: 0.59 },
]

const PAIRS: Array<[string, string, number, number]> = [
  ['XAUUSD', 'Estrategia Oro', 2380, 2410],
  ['US100', 'Estrategia US100', 19820, 19950],
  ['US500', 'Estrategia US500', 5730, 5760],
  ['EURUSD', 'Estrategia EURUSD', 1.0842, 1.0871],
]

export function mockTrades(): Trade[] {
  const r = rng(7)
  return Array.from({ length: 18 }, (_, i): Trade => {
    const p = PAIRS[Math.floor(r() * PAIRS.length)]
    const side: Side = r() > 0.45 ? 'buy' : 'sell'
    const win = r() > 0.18
    const entry = p[2] + (p[3] - p[2]) * r()
    const move = (p[3] - p[2]) * (0.05 + r() * 0.2) * (win ? 1 : -1) * (side === 'buy' ? 1 : -1)
    const pnl = (win ? 1 : -1) * (40 + r() * 320)
    const size = p[2] < 10 ? 1 : Math.round((0.1 + r()) * 100) / 100
    return {
      id: 't' + (i + 1),
      pair: p[0],
      strategy: p[1],
      side,
      entry,
      exit: entry + move,
      size,
      pnl,
      closedAt: new Date(END.getTime() - i * 5.3 * 36e5 - 2 * 36e5).toISOString(),
    }
  })
}

export const mockMovements: Movement[] = [
  { id: 'm1', type: 'deposit', asset: 'USDT', network: 'BNB Chain', txHash: '0x4c19a8f2', amount: 2500, status: 'pending', date: '2026-10-20T11:03:00' },
  { id: 'm2', type: 'deposit', asset: 'USDT', network: 'Ethereum', txHash: '0x8f2a41c9', amount: 5000, status: 'completed', date: '2026-10-18T09:14:00' },
  { id: 'm3', type: 'withdrawal', asset: 'USDC', network: 'Polygon', txHash: '0x1b77e0d3', amount: -1250, status: 'completed', date: '2026-10-12T17:42:00' },
  { id: 'm4', type: 'deposit', asset: 'USDC', network: 'Arbitrum', txHash: '0xd9307b11', amount: 10000, status: 'completed', date: '2026-10-02T08:30:00' },
  { id: 'm5', type: 'withdrawal', asset: 'USDT', network: 'Ethereum', txHash: '0x62ee0f4a', amount: -800, status: 'failed', date: '2026-09-27T15:20:00' },
  { id: 'm6', type: 'deposit', asset: 'USDT', network: 'Ethereum', txHash: '0xa0c493d7', amount: 20000, status: 'completed', date: '2026-09-15T10:05:00' },
]
