import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

const WALLETS = [
  { name: 'MetaMask', initial: 'M', color: '#E2761B', note: 'Extensión' },
  { name: 'WalletConnect', initial: 'W', color: '#3B99FC', note: 'QR · Móvil' },
  { name: 'Coinbase Wallet', initial: 'C', color: '#0052FF', note: '' },
  { name: 'Trust Wallet', initial: 'T', color: '#3375BB', note: 'Móvil' },
]

const DEMO_ADDRESS = '0x7a3F2b91c4D8e5A6f0B1c2D3e4F5a6B7c8D99c21'

interface Props {
  open: boolean
  onClose: () => void
  onConnected: (address: string, walletName: string) => void
}

/** Modal simulado. Con VITE_WC_PROJECT_ID se usa el modal oficial de WalletConnect. */
export function WalletModal({ open, onClose, onConnected }: Props) {
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    if (!pending) return
    const t = setTimeout(() => {
      onConnected(DEMO_ADDRESS, pending)
      setPending(null)
    }, 1600)
    return () => clearTimeout(t)
  }, [pending, onConnected])

  useEffect(() => {
    if (!open) {
      setPending(null)
      return
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="wallet-title" onClick={(e) => e.stopPropagation()}>
        <span className="modal__grip" />
        <div className="modal__head">
          <h2 id="wallet-title">Conectar wallet</h2>
          <button type="button" className="icon-btn icon-btn--ghost" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={16} />
          </button>
        </div>
        {pending ? (
          <div className="connecting">
            <span className="spinner" />
            <strong>Esperando aprobación en {pending}</strong>
            <span className="small muted">Confirma la conexión en tu wallet.</span>
          </div>
        ) : (
          <>
            <ul className="wallet-list">
              {WALLETS.map((w) => (
                <li key={w.name}>
                  <button type="button" className="wallet-option" onClick={() => setPending(w.name)}>
                    <span className="wallet-option__logo" style={{ background: w.color }}>
                      {w.initial}
                    </span>
                    <span className="wallet-option__name">{w.name}</span>
                    <span className="wallet-option__note">{w.note}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="modal__note">Solo se solicita permiso de lectura y firma. El bot nunca tiene acceso a tu frase semilla.</p>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
