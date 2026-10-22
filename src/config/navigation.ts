import type { IconName } from '../components/Icon'

export interface NavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
  title: string
  subtitle: string
}

export const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true, title: '¡Hola, {name}!', subtitle: 'Resumen de tu actividad de trading' },
  { to: '/operaciones', label: 'Operaciones', icon: 'trades', title: 'Operaciones', subtitle: 'Historial completo de operaciones del bot' },
  { to: '/movimientos', label: 'Movimientos', icon: 'moves', title: 'Movimientos', subtitle: 'Depósitos y retiros de tu cuenta' },
  { to: '/perfil', label: 'Perfil', icon: 'profile', title: 'Perfil', subtitle: 'Tu cuenta, wallet y bot' },
]
