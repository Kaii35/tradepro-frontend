export interface ChartPaths {
  line: string
  area: string
  points: Array<[number, number]>
  min: number
  max: number
}

/** Convierte una serie de valores en paths SVG (línea + área) dentro de un viewBox w × h. */
export function buildPaths(values: number[], w: number, h: number, pad = 0.1): ChartPaths {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const range = hi - lo || 1
  const min = lo - range * pad
  const max = hi + range * pad
  const points = values.map((v, i): [number, number] => [
    (i / Math.max(1, values.length - 1)) * w,
    h - ((v - min) / (max - min)) * h,
  ])
  const line = points.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')
  return { line, area: line + ' L' + w + ',' + h + ' L0,' + h + ' Z', points, min, max }
}
