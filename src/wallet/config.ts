/**
 * Configuración de WalletConnect (Reown AppKit) en un solo lugar.
 * Redes, wallets destacadas, tema y metadatos se editan aquí.
 *
 * Docs: https://docs.walletconnect.com · https://docs.reown.com/appkit/react/core/options
 */
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  mainnet,
  optimism,
  polygon,
  type AppKitNetwork,
} from '@reown/appkit/networks'
import type { ThemeVariables } from '@reown/appkit/react'
import { APP_NAME } from '../config'

export const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID ?? ''

/** Redes disponibles. La primera es la red por defecto. */
export const NETWORKS: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  avalanche,
  polygon,
  arbitrum,
  base,
  optimism,
  bsc,
]

/**
 * IDs del registro de WalletConnect (https://walletguide.walletconnect.network).
 * En Reown Cloud → Wallets List, al hacer clic en una wallet se copia su ID.
 */
export const WALLET_IDS = {
  core: 'f323633c1f67055a45aac84e321af6ffe46322da677ffdd32f9bc1e33bafe29c',
  metamask: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
  trust: '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
  okx: '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
  ledger: '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927',
} as const

/** Wallets que aparecen primero en el modal, en este orden. */
export const FEATURED_WALLET_IDS = [WALLET_IDS.core, WALLET_IDS.metamask]

export const METADATA = {
  name: APP_NAME,
  description: 'Panel del bot de trading',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost',
  icons: [typeof window !== 'undefined' ? `${window.location.origin}/logo.svg` : ''],
}

/** Tema del modal, alineado con los tokens de src/styles/global.css. */
export const THEME_VARIABLES: ThemeVariables = {
  '--w3m-accent': '#3B82F6',
  '--w3m-color-mix': '#060A16',
  '--w3m-color-mix-strength': 25,
  '--w3m-font-family': "'Plus Jakarta Sans', system-ui, sans-serif",
  '--w3m-border-radius-master': '3px',
  '--w3m-z-index': 1000,
}

/**
 * Lista del modal simulado (sin VITE_WC_PROJECT_ID). Imita el orden del modal real:
 * destacadas primero y luego otras populares.
 */
export interface DemoWallet {
  name: string
  initial: string
  color: string
  note?: string
  featured?: boolean
}

export const DEMO_WALLETS: DemoWallet[] = [
  { name: 'Core', initial: 'C', color: '#E84142', note: 'Avalanche', featured: true },
  { name: 'MetaMask', initial: 'M', color: '#E2761B', note: 'Extensión', featured: true },
  { name: 'WalletConnect', initial: 'W', color: '#3B99FC', note: 'QR · Móvil' },
  { name: 'Coinbase Wallet', initial: 'C', color: '#0052FF' },
  { name: 'Trust Wallet', initial: 'T', color: '#3375BB', note: 'Móvil' },
  { name: 'Rabby', initial: 'R', color: '#7084FF', note: 'Extensión' },
  { name: 'OKX Wallet', initial: 'O', color: '#1B1B1B' },
]
