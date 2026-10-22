import { Sparkline } from './Sparkline'

interface Props {
  label: string
  value: string
  unit?: string
  delta: string
  deltaNote: string
  color: string
  series: number[]
  tone?: 'pos' | 'neg'
}

export function KpiCard({ label, value, unit, delta, deltaNote, color, series, tone }: Props) {
  return (
    <article className="kpi">
      <span className="kpi__label">{label}</span>
      <span className={'kpi__value' + (tone ? ' ' + tone : '')}>
        {value}
        {unit && <span className="kpi__unit">{unit}</span>}
      </span>
      <span className="kpi__delta">
        <strong>{delta}</strong> {deltaNote}
      </span>
      <Sparkline className="kpi__spark" values={series} color={color} />
    </article>
  )
}
