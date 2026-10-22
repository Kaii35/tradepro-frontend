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

/** Tema del modal real: negro (modo oscuro por defecto de AppKit) con el acento de la app. */
export const THEME_VARIABLES: ThemeVariables = {
  '--w3m-accent': '#3B82F6',
  '--w3m-font-family': "'Plus Jakarta Sans', system-ui, sans-serif",
  '--w3m-z-index': 1000,
}

/** Enlace "¿No tienes wallet?" del modal. */
export const GET_WALLET_URL = 'https://walletguide.walletconnect.network'

/**
 * Wallets del modal simulado (sin VITE_WC_PROJECT_ID). Imita el modal real:
 * destacadas primero, luego populares, y el resto en "Todas las wallets".
 * Los íconos están en public/wallets (tomados de RainbowKit, licencia MIT).
 */
export interface DemoWallet {
  id: string
  name: string
  icon: string
  /** Identificador EIP-6963 de la extensión, para marcarla como instalada. */
  rdns?: string
  featured?: boolean
  /** Visible en la primera pantalla (si no, solo en "Todas las wallets"). */
  popular?: boolean
  qr?: boolean
}

const icon = (id: string) => `${import.meta.env.BASE_URL}wallets/${id}.svg`

export const DEMO_WALLETS: DemoWallet[] = [
  { id: 'core', name: 'Core', icon: icon('core'), rdns: 'app.core.extension', featured: true },
  { id: 'metamask', name: 'MetaMask', icon: icon('metamask'), rdns: 'io.metamask', featured: true },
  { id: 'walletconnect', name: 'WalletConnect', icon: icon('walletconnect'), popular: true, qr: true },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: icon('coinbase'), rdns: 'com.coinbase.wallet', popular: true },
  { id: 'trust', name: 'Trust Wallet', icon: icon('trust'), rdns: 'com.trustwallet.app', popular: true },
  { id: 'rabby', name: 'Rabby', icon: icon('rabby'), rdns: 'io.rabby' },
  { id: 'okx', name: 'OKX Wallet', icon: icon('okx'), rdns: 'com.okex.wallet' },
  { id: 'phantom', name: 'Phantom', icon: icon('phantom'), rdns: 'app.phantom' },
  { id: 'rainbow', name: 'Rainbow', icon: icon('rainbow'), rdns: 'me.rainbow' },
  { id: 'ledger', name: 'Ledger Live', icon: icon('ledger') },
  { id: 'brave', name: 'Brave Wallet', icon: icon('brave'), rdns: 'com.brave.wallet' },
]
