const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const usdFmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const copFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

export function usd(v: number, opts: { sign?: boolean } = {}): string {
  const s = '$' + usdFmt.format(Math.abs(v))
  if (opts.sign) return (v >= 0 ? '+' : '−') + s
  return (v < 0 ? '−' : '') + s
}

export function cop(v: number): string {
  return '$' + copFmt.format(v)
}

export function pct(v: number, digits = 2, sign = true): string {
  const s = Math.abs(v).toFixed(digits) + '%'
  if (sign) return (v >= 0 ? '+' : '−') + s
  return (v < 0 ? '−' : '') + s
}

export function price(v: number): string {
  return v < 10 ? v.toFixed(4) : usdFmt.format(v)
}

export function compactUsd(v: number): string {
  return '$' + (v / 1000).toFixed(1) + 'k'
}

export function shortDate(iso: string): string {
  const d = new Date(iso)
  return d.getDate() + ' ' + MONTHS[d.getMonth()]
}

export function dateTime(iso: string): string {
  const d = new Date(iso)
  return shortDate(iso) + ', ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}

export function shortAddress(a: string): string {
  return a.slice(0, 6) + '…' + a.slice(-4)
}

export function tone(v: number): 'pos' | 'neg' {
  return v >= 0 ? 'pos' : 'neg'
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
