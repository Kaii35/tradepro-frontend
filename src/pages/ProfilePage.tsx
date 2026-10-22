import { Avatar } from '../components/Avatar'
import { BotStatusBadge, BotToggleButton } from '../components/BotStatus'
import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { useLogout } from '../hooks/useLogout'
import { shortAddress } from '../lib/format'
import { useWallet } from '../wallet/context'

export default function ProfilePage() {
  const { user } = useAuth()
  const wallet = useWallet()
  const logout = useLogout()

  return (
    <div className="page page--narrow">
      <Card>
        <div className="profile-head">
          <Avatar name={user?.name ?? ''} size="lg" />
          <div>
            <strong>{user?.name}</strong>
            <span className="muted">{user?.email}</span>
          </div>
        </div>
      </Card>

      <Card title="Estado del bot" action={<BotStatusBadge />}>
        <BotToggleButton block />
      </Card>

      <Card title="Wallet" subtitle={wallet.isMock ? 'Modo demo: configura VITE_WC_PROJECT_ID para WalletConnect real.' : undefined}>
        {wallet.isConnected && wallet.address ? (
          <div className="wallet-row">
            <span className="wallet-chip__icon wallet-chip__icon--lg">
              <Icon name="wallet" />
            </span>
            <div className="wallet-row__text">
              <strong>{wallet.connectorName ?? 'Wallet'}</strong>
              <span className="mono small muted">{shortAddress(wallet.address)}</span>
            </div>
            <button type="button" className="btn btn--sm btn--danger" onClick={wallet.disconnect}>
              Desconectar
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn--primary btn--block" onClick={wallet.open}>
            <Icon name="wallet" />
            Conectar wallet
          </button>
        )}
      </Card>

      <button type="button" className="btn btn--lg btn--block btn--danger" onClick={logout}>
        <Icon name="logout" size={16} />
        Cerrar sesión
      </button>
    </div>
  )
}
