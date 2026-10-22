export type Period = '7D' | '30D' | '90D'
export type Side = 'buy' | 'sell'

export interface User {
  id: string
  name: string
  email: string
  token: string
  walletAddress?: string
}

export interface Summary {
  balance: number
  balanceDeltaPct: number
  balanceCop: number
  copRate: number
  returnPct: number
  returnDeltaPct: number
  pnl: number
  totalReturnPct: number
  closedTrades: number
  winRate: number
  avgDurationHours: number
  maxDrawdownPct: number
  exposure: number
  sparks: { balance: number[]; returns: number[]; cop: number[]; pnl: number[] }
}

export interface EquityPoint {
  date: string
  value: number
}

export interface StrategyPerformance {
  id: string
  name: string
  sharePct: number
  pnl: number
  color: string
}

export interface Position {
  id: string
  pair: string
  side: Side
  size: number
  entry: number
  pnl: number
  pnlPct: number
}

export interface Trade {
  id: string
  pair: string
  strategy: string
  side: Side
  entry: number
  exit: number
  size: number
  pnl: number
  closedAt: string
}

export type MovementType = 'deposit' | 'withdrawal'
export type MovementStatus = 'completed' | 'pending' | 'failed'

export interface Movement {
  id: string
  type: MovementType
  asset: string
  network: string
  txHash: string
  amount: number
  status: MovementStatus
  date: string
}
