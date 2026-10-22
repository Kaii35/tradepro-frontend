import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DEMO_WALLETS, type DemoWallet } from '../wallet/config'
import { Icon } from './Icon'

const DEMO_ADDRESS = '0x7a3F2b91c4D8e5A6f0B1c2D3e4F5a6B7c8D99c21'

interface Props {
  open: boolean
  onClose: () => void
  onConnected: (address: string, walletName: string) => void
}

/** Modal simulado. Con VITE_WC_PROJECT_ID se usa el modal oficial de WalletConnect. */
export function WalletModal({ open, onClose, onConnected }: Props) {
  const [pending, setPending] = useState<DemoWallet | null>(null)

  useEffect(() => {
    if (!pending) return
    const t = setTimeout(() => {
      onConnected(DEMO_ADDRESS, pending.name)
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

  const featured = DEMO_WALLETS.filter((w) => w.featured)
  const others = DEMO_WALLETS.filter((w) => !w.featured)

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="wallet-title" onClick={(e) => e.stopPropagation()}>
        <span className="modal__grip" />
        <div className="modal__head">
          {pending ? (
            <button type="button" className="icon-btn icon-btn--ghost" onClick={() => setPending(null)} aria-label="Volver">
              <Icon name="back" size={16} />
            </button>
          ) : (
            <span className="modal__head-spacer" />
          )}
          <h2 id="wallet-title">{pending ? pending.name : 'Conectar wallet'}</h2>
          <button type="button" className="icon-btn icon-btn--ghost" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={16} />
          </button>
        </div>

        {pending ? (
          <div className="connecting">
            <span className="connecting__ring">
              <WalletLogo wallet={pending} size="lg" />
            </span>
            <strong>Esperando aprobación en {pending.name}</strong>
            <span className="small muted">Confirma la conexión en tu wallet.</span>
          </div>
        ) : (
          <>
            <section className="wallet-group">
              <h3 className="wallet-group__title">Recomendadas</h3>
              <ul className="wallet-list">
                {featured.map((w) => (
                  <WalletRow key={w.name} wallet={w} onSelect={setPending} />
                ))}
              </ul>
            </section>

            <section className="wallet-group">
              <h3 className="wallet-group__title">Otras wallets</h3>
              <ul className="wallet-list">
                {others.map((w) => (
                  <WalletRow key={w.name} wallet={w} onSelect={setPending} />
                ))}
                <li>
                  <div className="wallet-option wallet-option--all" aria-disabled="true">
                    <span className="wallet-option__grid">
                      {others.slice(0, 4).map((w) => (
                        <span key={w.name} style={{ background: w.color }} />
                      ))}
                    </span>
                    <span className="wallet-option__name">Todas las wallets</span>
                    <span className="wallet-option__tag">500+</span>
                  </div>
                </li>
              </ul>
            </section>

            <p className="modal__note">
              <Icon name="shield" size={14} />
              Solo se solicita permiso de lectura y firma. El bot nunca tiene acceso a tu frase semilla.
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}

function WalletRow({ wallet, onSelect }: { wallet: DemoWallet; onSelect: (w: DemoWallet) => void }) {
  return (
    <li>
      <button
        type="button"
        className={`wallet-option${wallet.featured ? ' wallet-option--featured' : ''}`}
        onClick={() => onSelect(wallet)}
      >
        <WalletLogo wallet={wallet} />
        <span className="wallet-option__name">{wallet.name}</span>
        {wallet.featured ? (
          <span className="wallet-option__tag wallet-option__tag--accent">Recomendada</span>
        ) : (
          wallet.note && <span className="wallet-option__note">{wallet.note}</span>
        )}
      </button>
    </li>
  )
}

function WalletLogo({ wallet, size }: { wallet: DemoWallet; size?: 'lg' }) {
  return (
    <span className={`wallet-option__logo${size ? ' wallet-option__logo--lg' : ''}`} style={{ background: wallet.color }}>
      {wallet.initial}
    </span>
  )
}
