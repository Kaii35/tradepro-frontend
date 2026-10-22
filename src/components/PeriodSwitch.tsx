import type { Period } from '../types'

const PERIODS: Period[] = ['7D', '30D', '90D']

export function PeriodSwitch({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div className="segmented" role="tablist" aria-label="Periodo">
      {PERIODS.map((p) => (
        <button key={p} type="button" role="tab" aria-selected={value === p} className={value === p ? 'is-active' : ''} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
    </div>
  )
}
