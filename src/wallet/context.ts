import { createContext, useContext } from 'react'

export interface WalletState {
  address: string | null
  connectorName: string | null
  isConnected: boolean
  /** true cuando no hay VITE_WC_PROJECT_ID y se usa el modal simulado. */
  isMock: boolean
  open: () => void
  disconnect: () => void
}

export const WalletContext = createContext<WalletState | null>(null)

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet debe usarse dentro de <WalletProvider>')
  return ctx
}
