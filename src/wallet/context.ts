import { createContext, useContext } from 'react'

export interface WalletState {
  address: string | null
  connectorName: string | null
  /** Logo de la wallet conectada (data URL o https), si el SDK lo expone. */
  connectorIcon: string | null
  networkName: string | null
  isConnected: boolean
  /** true cuando no hay VITE_WC_PROJECT_ID y se usa el modal simulado. */
  isMock: boolean
  /** Abre el modal: lista de wallets si no hay conexión, o la cuenta si ya la hay. */
  open: () => void
  /** Abre el selector de red. */
  openNetworks: () => void
  disconnect: () => void
}

export const WalletContext = createContext<WalletState | null>(null)

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet debe usarse dentro de <WalletProvider>')
  return ctx
}
