import { NavLink } from 'react-router-dom'
import { NAV } from '../../config/navigation'
import { useAuth } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useLogout'
import { Avatar } from '../Avatar'
import { BotStatusCard } from '../BotStatus'
import { Icon } from '../Icon'
import { Logo } from '../Logo'

export function Sidebar() {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <aside className="sidebar">
      <Logo />
      <nav className="nav" aria-label="Principal">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => 'nav__item' + (isActive ? ' is-active' : '')}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">
        <BotStatusCard />
        <div className="user-chip">
          <Avatar name={user?.name ?? ''} />
          <div className="user-chip__text">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
          <button type="button" className="icon-btn icon-btn--ghost" onClick={logout} title="Cerrar sesión" aria-label="Cerrar sesión">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
