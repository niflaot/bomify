import type { CSSProperties, ReactNode } from 'react'

/**
 * Props for a measured canvas surface.
 */
export type MetricCanvasProps = {
  readonly widthMm: number
  readonly heightMm: number
  readonly children?: ReactNode
  readonly pixelsPerMm?: number
  readonly showGrid?: boolean
  readonly backgroundColor?: string
  readonly gridColor?: string
  readonly majorGridColor?: string
  readonly borderColor?: string
  readonly scrollable?: boolean
  readonly ariaLabel?: string
  readonly className?: string
  readonly style?: CSSProperties
  readonly surfaceStyle?: CSSProperties
}
