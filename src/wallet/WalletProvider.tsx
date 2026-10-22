import type { ReactNode } from 'react'
import { AppKitWalletProvider } from './AppKitWalletProvider'
import { WC_PROJECT_ID } from './config'
import { MockWalletProvider } from './MockWalletProvider'

/**
 * Con VITE_WC_PROJECT_ID usa WalletConnect real (Reown AppKit + wagmi).
 * Sin él, usa un modal simulado para desarrollar la UI sin configuración.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  if (WC_PROJECT_ID) return <AppKitWalletProvider projectId={WC_PROJECT_ID}>{children}</AppKitWalletProvider>
  return <MockWalletProvider>{children}</MockWalletProvider>
}
