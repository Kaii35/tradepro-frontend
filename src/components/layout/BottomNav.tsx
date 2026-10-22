import { NavLink } from 'react-router-dom'
import { NAV } from '../../config/navigation'
import { Icon } from '../Icon'

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Principal">
      {NAV.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => 'bottom-nav__item' + (isActive ? ' is-active' : '')}>
          <Icon name={item.icon} size={22} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
