import { useEffect, useState } from 'react'

export interface InstalledWallet {
  rdns: string
  name: string
  icon: string
}

interface AnnounceEvent extends Event {
  detail?: { info?: { rdns?: string; name?: string; icon?: string } }
}

/** Extensiones de wallet instaladas en el navegador, detectadas con EIP-6963. */
export function useInstalledWallets(active: boolean): InstalledWallet[] {
  const [wallets, setWallets] = useState<InstalledWallet[]>([])

  useEffect(() => {
    if (!active) return
    const onAnnounce = (e: Event) => {
      const info = (e as AnnounceEvent).detail?.info
      if (!info?.rdns || !info.name || !info.icon) return
      const wallet = { rdns: info.rdns, name: info.name, icon: info.icon }
      setWallets((prev) => (prev.some((w) => w.rdns === wallet.rdns) ? prev : [...prev, wallet]))
    }
    window.addEventListener('eip6963:announceProvider', onAnnounce)
    window.dispatchEvent(new Event('eip6963:requestProvider'))
    return () => window.removeEventListener('eip6963:announceProvider', onAnnounce)
  }, [active])

  return wallets
}
