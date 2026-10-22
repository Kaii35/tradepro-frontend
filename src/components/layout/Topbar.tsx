import { useLocation } from 'react-router-dom'
import { NAV } from '../../config/navigation'
import { useAuth } from '../../context/AuthContext'
import { Icon } from '../Icon'
import { Logo } from '../Logo'
import { WalletButton } from '../WalletButton'

export function Topbar() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const item = NAV.find((n) => n.to === pathname) ?? NAV[0]
  const firstName = user?.name.split(' ')[0] ?? ''

  return (
    <header className="topbar">
      <div className="topbar__mobile-brand">
        <Logo />
      </div>
      <div className="topbar__title">
        <h1>{item.title.replace('{name}', firstName)}</h1>
        <p>{item.subtitle}</p>
      </div>
      <div className="topbar__actions">
        <button type="button" className="icon-btn" aria-label="Notificaciones">
          <Icon name="bell" size={17} />
          <span className="icon-btn__dot" />
        </button>
        <WalletButton />
      </div>
    </header>
  )
}
