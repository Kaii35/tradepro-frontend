import { useMemo, useState, type ReactNode } from 'react'
import { createAppKit, useAppKit, useAppKitAccount, useDisconnect, useWalletInfo } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { arbitrum, bsc, mainnet, polygon, type AppKitNetwork } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { APP_NAME } from '../config'
import { WalletContext, type WalletState } from './context'

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, polygon, arbitrum, bsc]
const queryClient = new QueryClient()
let adapter: WagmiAdapter | null = null

function init(projectId: string): WagmiAdapter {
  if (adapter) return adapter
  adapter = new WagmiAdapter({ networks, projectId })
  createAppKit({
    adapters: [adapter],
    networks,
    projectId,
    metadata: {
      name: APP_NAME,
      description: 'Panel del bot de trading',
      url: window.location.origin,
      icons: [],
    },
    themeMode: 'dark',
    themeVariables: { '--w3m-accent': '#3B82F6', '--w3m-border-radius-master': '2px' },
    features: { analytics: false, email: false, socials: false },
  })
  return adapter
}

export function AppKitWalletProvider({ projectId, children }: { projectId: string; children: ReactNode }) {
  const [wagmiAdapter] = useState(() => init(projectId))
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Bridge>{children}</Bridge>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function Bridge({ children }: { children: ReactNode }) {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const { walletInfo } = useWalletInfo()

  const value = useMemo<WalletState>(
    () => ({
      address: address ?? null,
      connectorName: walletInfo?.name ?? null,
      isConnected,
      isMock: false,
      open: () => void open(),
      disconnect: () => void disconnect(),
    }),
    [address, isConnected, walletInfo, open, disconnect],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
