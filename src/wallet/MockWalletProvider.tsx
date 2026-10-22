import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { WalletModal } from '../components/WalletModal'
import { WalletContext, type WalletState } from './context'

export function MockWalletProvider({ children }: { children: ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [account, setAccount] = useState<{ address: string; name: string } | null>(null)

  const handleConnected = useCallback((address: string, name: string) => {
    setAccount({ address, name })
    setModalOpen(false)
  }, [])

  const value = useMemo<WalletState>(
    () => ({
      address: account?.address ?? null,
      connectorName: account?.name ?? null,
      isConnected: account !== null,
      isMock: true,
      open: () => setModalOpen(true),
      disconnect: () => setAccount(null),
    }),
    [account],
  )

  return (
    <WalletContext.Provider value={value}>
      {children}
      <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} onConnected={handleConnected} />
    </WalletContext.Provider>
  )
}
