import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { api } from '../services/api'

interface BotState {
  running: boolean
  pending: boolean
  toggle: () => void
}

const BotContext = createContext<BotState | null>(null)

export function BotProvider({ children }: { children: ReactNode }) {
  const [running, setRunning] = useState(true)
  const [pending, setPending] = useState(false)

  const toggle = useCallback(async () => {
    setPending(true)
    try {
      setRunning(await api.setBotRunning(!running))
    } finally {
      setPending(false)
    }
  }, [running])

  const value = useMemo(() => ({ running, pending, toggle }), [running, pending, toggle])
  return <BotContext.Provider value={value}>{children}</BotContext.Provider>
}

export function useBot(): BotState {
  const ctx = useContext(BotContext)
  if (!ctx) throw new Error('useBot debe usarse dentro de <BotProvider>')
  return ctx
}
