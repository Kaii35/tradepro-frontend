import { APP_NAME, APP_TAGLINE } from '../config'
import { Icon } from './Icon'

export function Logo({ tagline = false }: { tagline?: boolean }) {
  return (
    <div className="brand">
      <span className="brand__mark">
        <Icon name="trades" size={18} strokeWidth={2.2} />
      </span>
      <span className="brand__name">
        {APP_NAME}
        {tagline && <span className="brand__tag">{APP_TAGLINE}</span>}
      </span>
    </div>
  )
}
