import { useBot } from '../context/BotContext'
import { Icon } from './Icon'

export function BotStatusBadge() {
  const { running } = useBot()
  return (
    <span className={'status ' + (running ? 'status--on' : 'status--off')}>
      <span className="status__dot" />
      {running ? 'Activo' : 'Pausado'}
    </span>
  )
}

export function BotToggleButton({ block = false }: { block?: boolean }) {
  const { running, pending, toggle } = useBot()
  return (
    <button type="button" className={'btn btn--sm' + (block ? ' btn--block' : '')} onClick={toggle} disabled={pending}>
      {pending ? <span className="spinner spinner--sm" /> : <Icon name={running ? 'pause' : 'play'} size={14} />}
      {running ? 'Pausar bot' : 'Reanudar bot'}
    </button>
  )
}

export function BotStatusCard() {
  return (
    <div className="bot-card">
      <div className="bot-card__row">
        <span className="eyebrow">Bot</span>
        <BotStatusBadge />
      </div>
      <BotToggleButton block />
    </div>
  )
}
