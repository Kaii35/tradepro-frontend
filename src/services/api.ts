import type { EquityPoint, Movement, Period, Position, StrategyPerformance, Summary, Trade, User } from '../types'
import { mockEquity, mockMovements, mockPositions, mockStrategies, mockSummary, mockTrades } from './mock'

/**
 * Capa de datos de la app.
 * Hoy cada método devuelve datos simulados. Para conectar tu backend,
 * reemplaza el cuerpo por la llamada a request() que aparece comentada.
 */

const API_URL = import.meta.env.VITE_API_URL ?? ''
export const SESSION_KEY = 'tradepro.session'

const delay = (ms = 350) => new Promise<void>((resolve) => setTimeout(resolve, ms))

function token(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User).token : null
  } catch {
    return null
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const t = token()
  const res = await fetch(API_URL + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: 'Bearer ' + t } : {}),
      ...(init.headers as Record<string, string> | undefined),
    },
  })
  if (!res.ok) throw new Error((await res.text()) || 'Error ' + res.status)
  return (await res.json()) as T
}

export const api = {
  async login(email: string, password: string): Promise<User> {
    // return request<User>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    await delay(600)
    if (!email.includes('@') || password.length < 4) throw new Error('Correo o contraseña inválidos.')
    return { id: 'u_1', name: 'Juan Pérez', email, token: 'demo-token' }
  },

  /** En producción: firma SIWE (Sign-In with Ethereum) y verificación en el backend. */
  async loginWithWallet(address: string): Promise<User> {
    // return request<User>('/auth/wallet', { method: 'POST', body: JSON.stringify({ address, signature }) })
    await delay(400)
    return { id: 'u_1', name: 'Juan Pérez', email: 'juan@ejemplo.com', token: 'demo-token', walletAddress: address }
  },

  async getSummary(period: Period): Promise<Summary> {
    // return request<Summary>('/summary?period=' + period)
    await delay()
    return mockSummary(period)
  },

  async getEquity(period: Period): Promise<EquityPoint[]> {
    // return request<EquityPoint[]>('/equity?period=' + period)
    await delay()
    return mockEquity(period)
  },

  async getStrategies(): Promise<StrategyPerformance[]> {
    await delay()
    return mockStrategies
  },

  async getPositions(): Promise<Position[]> {
    await delay()
    return mockPositions
  },

  async getTrades(): Promise<Trade[]> {
    await delay()
    return mockTrades()
  },

  async getMovements(): Promise<Movement[]> {
    await delay()
    return mockMovements
  },

  async setBotRunning(running: boolean): Promise<boolean> {
    // return request<{ running: boolean }>('/bot', { method: 'PATCH', body: JSON.stringify({ running }) }).then((r) => r.running)
    await delay(500)
    return running
  },
}
