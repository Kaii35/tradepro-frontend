import type { MovementStatus, Side } from '../types'

export function SideBadge({ side }: { side: Side }) {
  return <span className={'badge ' + (side === 'buy' ? 'badge--pos' : 'badge--neg')}>{side === 'buy' ? 'Compra' : 'Venta'}</span>
}

const STATUS: Record<MovementStatus, [string, string]> = {
  completed: ['Completado', 'badge--pos'],
  pending: ['Pendiente', 'badge--warn'],
  failed: ['Fallido', 'badge--neg'],
}

export function StatusBadge({ status }: { status: MovementStatus }) {
  const [label, cls] = STATUS[status]
  return <span className={'badge ' + cls}>{label}</span>
}
