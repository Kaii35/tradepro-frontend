import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { DEMO_WALLETS, GET_WALLET_URL, type DemoWallet } from '../wallet/config'
import { useInstalledWallets } from '../wallet/useInstalledWallets'
import { Icon } from './Icon'

const DEMO_ADDRESS = '0x7a3F2b91c4D8e5A6f0B1c2D3e4F5a6B7c8D99c21'

type View = { name: 'list' } | { name: 'all' } | { name: 'help' } | { name: 'connecting'; wallet: DemoWallet }

interface Props {
  open: boolean
  onClose: () => void
  onConnected: (address: string, walletName: string) => void
}

/** Modal simulado con el estilo del modal de WalletConnect. Con VITE_WC_PROJECT_ID se usa el oficial. */
export function WalletModal({ open, onClose, onConnected }: Props) {
  const [view, setView] = useState<View>({ name: 'list' })
  const [attempt, setAttempt] = useState(0)
  const installed = useInstalledWallets(open)

  // Simula la aprobación en la wallet.
  useEffect(() => {
    if (view.name !== 'connecting') return
    const t = setTimeout(() => onConnected(DEMO_ADDRESS, view.wallet.name), 2200)
    return () => clearTimeout(t)
  }, [view, attempt, onConnected])

  useEffect(() => {
    if (!open) {
      setView({ name: 'list' })
      return
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /** Wallets conocidas + extensiones detectadas que no están en la lista. */
  const wallets = useMemo(() => {
    const known = new Set(DEMO_WALLETS.map((w) => w.rdns).filter(Boolean))
    const extra: DemoWallet[] = installed
      .filter((p) => !known.has(p.rdns))
      .map((p) => ({ id: p.rdns, name: p.name, icon: p.icon, rdns: p.rdns, popular: true }))
    return [...DEMO_WALLETS, ...extra]
  }, [installed])

  const isInstalled = (w: DemoWallet) => !!w.rdns && installed.some((p) => p.rdns === w.rdns)

  if (!open) return null

  const connect = (wallet: DemoWallet) => setView({ name: 'connecting', wallet })
  const title =
    view.name === 'connecting' ? view.wallet.name : view.name === 'all' ? 'Todas las wallets' : view.name === 'help' ? '¿Qué es una wallet?' : 'Conectar wallet'

  return createPortal(
    <div className="wm-backdrop" onClick={onClose}>
      <div className="wm" role="dialog" aria-modal="true" aria-labelledby="wm-title" onClick={(e) => e.stopPropagation()}>
        <span className="wm__grip" />
        <header className="wm__head">
          {view.name === 'list' ? (
            <button type="button" className="wm__icon-btn" onClick={() => setView({ name: 'help' })} aria-label="Ayuda">
              <Icon name="help" size={18} />
            </button>
          ) : (
            <button type="button" className="wm__icon-btn" onClick={() => setView({ name: 'list' })} aria-label="Volver">
              <Icon name="back" size={18} />
            </button>
          )}
          <h2 id="wm-title">{title}</h2>
          <button type="button" className="wm__icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="wm__body">
          {view.name === 'list' && (
            <MainList wallets={wallets} isInstalled={isInstalled} onSelect={connect} onAll={() => setView({ name: 'all' })} />
          )}
          {view.name === 'all' && <AllWallets wallets={wallets} onSelect={connect} />}
          {view.name === 'help' && <Help />}
          {view.name === 'connecting' && (
            <Connecting wallet={view.wallet} key={attempt} onRetry={() => setAttempt((n) => n + 1)} />
          )}
        </div>

        {view.name === 'list' && (
          <footer className="wm__foot">
            <span>
              ¿No tienes wallet?{' '}
              <a href={GET_WALLET_URL} target="_blank" rel="noreferrer">
                Empieza aquí
              </a>
            </span>
            <span className="wm__secure">
              <Icon name="shield" size={12} />
              Solo lectura y firma. Nunca pedimos tu frase semilla.
            </span>
          </footer>
        )}
      </div>
    </div>,
    document.body,
  )
}

function MainList({
  wallets,
  isInstalled,
  onSelect,
  onAll,
}: {
  wallets: DemoWallet[]
  isInstalled: (w: DemoWallet) => boolean
  onSelect: (w: DemoWallet) => void
  onAll: () => void
}) {
  const featured = wallets.filter((w) => w.featured)
  // Las instaladas suben primero dentro de las populares.
  const popular = wallets.filter((w) => w.popular).sort((a, b) => Number(isInstalled(b)) - Number(isInstalled(a)))
  const rest = wallets.filter((w) => !w.featured && !w.popular)

  return (
    <>
      <ul className="wm__list">
        {featured.map((w) => (
          <WalletItem key={w.id} wallet={w} onSelect={onSelect} tag={isInstalled(w) ? 'installed' : 'recommended'} />
        ))}
      </ul>
      <div className="wm__divider">o</div>
      <ul className="wm__list">
        {popular.map((w) => (
          <WalletItem key={w.id} wallet={w} onSelect={onSelect} tag={w.qr ? 'qr' : isInstalled(w) ? 'installed' : undefined} />
        ))}
        <li>
          <button type="button" className="wm-item" onClick={onAll}>
            <span className="wm-grid">
              {rest.slice(0, 4).map((w) => (
                <img key={w.id} src={w.icon} alt="" />
              ))}
            </span>
            <span className="wm-item__name">Todas las wallets</span>
            <span className="wm-tag wm-tag--count">500+</span>
          </button>
        </li>
      </ul>
    </>
  )
}

const TAGS = {
  qr: { className: 'wm-tag--qr', label: 'QR' },
  installed: { className: 'wm-tag--installed', label: 'Instalada' },
  recommended: { className: 'wm-tag--recommended', label: 'Recomendada' },
} as const

function WalletItem({ wallet, onSelect, tag }: { wallet: DemoWallet; onSelect: (w: DemoWallet) => void; tag?: keyof typeof TAGS }) {
  return (
    <li>
      <button type="button" className="wm-item" onClick={() => onSelect(wallet)}>
        <WalletLogo wallet={wallet} />
        <span className="wm-item__name">{wallet.name}</span>
        {tag && <span className={`wm-tag ${TAGS[tag].className}`}>{TAGS[tag].label}</span>}
      </button>
    </li>
  )
}

function AllWallets({ wallets, onSelect }: { wallets: DemoWallet[]; onSelect: (w: DemoWallet) => void }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const list = q ? wallets.filter((w) => w.name.toLowerCase().includes(q)) : wallets

  return (
    <>
      <label className="wm-search">
        <Icon name="search" size={16} />
        <input autoFocus={window.matchMedia("(min-width: 900px)").matches} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar wallet" aria-label="Buscar wallet" />
      </label>
      {list.length ? (
        <ul className="wm-tiles">
          {list.map((w) => (
            <li key={w.id}>
              <button type="button" className="wm-tile" onClick={() => onSelect(w)} title={w.name}>
                <WalletLogo wallet={w} />
                <span>{w.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="wm-empty">No encontramos “{query}”.</p>
      )}
    </>
  )
}

function Connecting({ wallet, onRetry }: { wallet: DemoWallet; onRetry: () => void }) {
  return (
    <div className="wm-connecting">
      <span className="wm-loader">
        <svg viewBox="0 0 96 96" aria-hidden="true">
          <rect x="1.5" y="1.5" width="93" height="93" rx="30" />
        </svg>
        <WalletLogo wallet={wallet} size="lg" />
      </span>
      <strong>Continúa en {wallet.name}</strong>
      <span>Acepta la solicitud de conexión en tu wallet.</span>
      <button type="button" className="wm-retry" onClick={onRetry}>
        <Icon name="refresh" size={14} />
        Reintentar
      </button>
    </div>
  )
}

function Help() {
  const items = [
    { icon: 'wallet', title: 'Tu llave al mundo cripto', text: 'Una wallet guarda tus activos y te permite iniciar sesión en apps sin usuario ni contraseña.' },
    { icon: 'shield', title: 'Tú tienes el control', text: 'TradePro solo ve tu dirección pública. Cada acción la apruebas tú desde la wallet.' },
    { icon: 'qr', title: 'Desde el celular', text: 'Con WalletConnect escaneas un código QR y conectas cualquier wallet móvil.' },
  ] as const
  return (
    <div className="wm-help">
      {items.map((it) => (
        <div key={it.title} className="wm-help__item">
          <Icon name={it.icon} size={18} />
          <div>
            <strong>{it.title}</strong>
            <p>{it.text}</p>
          </div>
        </div>
      ))}
      <a className="wm-retry" href={GET_WALLET_URL} target="_blank" rel="noreferrer" style={{ alignSelf: 'center' }}>
        Conseguir una wallet
      </a>
    </div>
  )
}

function WalletLogo({ wallet, size }: { wallet: DemoWallet; size?: 'lg' }) {
  return (
    <span className={`wm-logo${size ? ' wm-logo--lg' : ''}`}>
      <img src={wallet.icon} alt="" draggable={false} />
    </span>
  )
}
