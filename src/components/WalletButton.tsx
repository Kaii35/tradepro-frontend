import { useNavigate } from 'react-router-dom'
import { shortAddress } from '../lib/format'
import { useWallet } from '../wallet/context'
import { Icon } from './Icon'

export function WalletButton() {
  const wallet = useWallet()
  const navigate = useNavigate()

  if (wallet.isConnected && wallet.address) {
    return (
      <button type="button" className="wallet-chip" onClick={() => navigate('/perfil')} title={wallet.connectorName ?? 'Wallet'}>
        <span className="wallet-chip__icon">
          <Icon name="wallet" size={14} />
        </span>
        {shortAddress(wallet.address)}
        <span className="wallet-chip__live" />
      </button>
    )
  }

  return (
    <button type="button" className="btn btn--primary btn--sm" onClick={wallet.open}>
      <Icon name="wallet" size={16} />
      <span className="hide-sm">Conectar wallet</span>
      <span className="show-sm">Wallet</span>
    </button>
  )
}
