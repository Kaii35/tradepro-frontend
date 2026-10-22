import { useMemo, useState, type ReactNode } from 'react'
import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect, useWalletInfo } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { initAppKit } from './appkit'
import { WalletContext, type WalletState } from './context'

const queryClient = new QueryClient()

export function AppKitWalletProvider({ projectId, children }: { projectId: string; children: ReactNode }) {
  const [wagmiAdapter] = useState(() => initAppKit(projectId))
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Bridge>{children}</Bridge>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

/** Traduce los hooks de AppKit al WalletState común de la app. */
function Bridge({ children }: { children: ReactNode }) {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { caipNetwork } = useAppKitNetwork()
  const { disconnect } = useDisconnect()
  const { walletInfo } = useWalletInfo()

  const value = useMemo<WalletState>(
    () => ({
      address: address ?? null,
      connectorName: walletInfo?.name ?? null,
      connectorIcon: walletInfo?.icon ?? null,
      networkName: caipNetwork?.name ?? null,
      isConnected,
      isMock: false,
      open: () => void open({ view: isConnected ? 'Account' : 'Connect' }),
      openNetworks: () => void open({ view: 'Networks' }),
      disconnect: () => void disconnect(),
    }),
    [address, isConnected, walletInfo, caipNetwork, open, disconnect],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
