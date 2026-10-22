import { initials } from '../lib/format'

export function Avatar({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  return <span className={'avatar' + (size === 'lg' ? ' avatar--lg' : '')}>{initials(name)}</span>
}
