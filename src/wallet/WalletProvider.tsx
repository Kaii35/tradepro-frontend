import type { ReactNode } from 'react'
import { AppKitWalletProvider } from './AppKitWalletProvider'
import { MockWalletProvider } from './MockWalletProvider'

const projectId = import.meta.env.VITE_WC_PROJECT_ID

/**
 * Con VITE_WC_PROJECT_ID usa WalletConnect real (Reown AppKit + wagmi).
 * Sin él, usa un modal simulado para desarrollar la UI sin configuración.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  if (projectId) return <AppKitWalletProvider projectId={projectId}>{children}</AppKitWalletProvider>
  return <MockWalletProvider>{children}</MockWalletProvider>
}
