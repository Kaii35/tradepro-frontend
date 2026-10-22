import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { api, SESSION_KEY } from '../services/api'
import type { User } from '../types'

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithWallet: (address: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

function readSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession)

  const persist = useCallback((u: User | null) => {
    setUser(u)
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u))
    else localStorage.removeItem(SESSION_KEY)
  }, [])

  const login = useCallback(async (email: string, password: string) => persist(await api.login(email, password)), [persist])
  const loginWithWallet = useCallback(async (address: string) => persist(await api.loginWithWallet(address)), [persist])
  const logout = useCallback(() => persist(null), [persist])

  const value = useMemo(() => ({ user, login, loginWithWallet, logout }), [user, login, loginWithWallet, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
