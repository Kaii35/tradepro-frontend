import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { FEATURED_WALLET_IDS, METADATA, NETWORKS, THEME_VARIABLES } from './config'

let adapter: WagmiAdapter | null = null

/** Crea AppKit una sola vez y devuelve el adaptador de wagmi. */
export function initAppKit(projectId: string): WagmiAdapter {
  if (adapter) return adapter

  adapter = new WagmiAdapter({ networks: NETWORKS, projectId })

  createAppKit({
    adapters: [adapter],
    networks: NETWORKS,
    defaultNetwork: NETWORKS[0],
    projectId,
    metadata: METADATA,

    // Wallets: Core y MetaMask primero; el resto del registro (500+) en "Todas las wallets".
    featuredWalletIds: FEATURED_WALLET_IDS,
    allWallets: 'SHOW',
    enableWalletConnect: true, // QR para wallets móviles
    enableInjected: true, // extensiones detectadas en el navegador (EIP-6963)
    enableCoinbase: true,
    enableWalletGuide: true,

    // Solo conexión con wallet: sin email, redes sociales, swaps ni compra.
    features: {
      analytics: false,
      email: false,
      socials: false,
      swaps: false,
      onramp: false,
      send: false,
      history: false,
      connectMethodsOrder: ['wallet'],
    },

    themeMode: 'dark',
    themeVariables: THEME_VARIABLES,
  })

  return adapter
}
