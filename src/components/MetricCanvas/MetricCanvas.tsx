import type { CSSProperties, ReactElement } from 'react'

import type { MetricCanvasProps } from './metric-canvas.types'

function gridBackground(
  pixelsPerMm: number,
  gridColor: string,
  majorGridColor: string
): Pick<CSSProperties, 'backgroundImage' | 'backgroundSize'> {
  return {
    backgroundImage: `
      linear-gradient(to right, ${gridColor} 1px, transparent 1px),
      linear-gradient(to bottom, ${gridColor} 1px, transparent 1px),
      linear-gradient(to right, ${majorGridColor} 1px, transparent 1px),
      linear-gradient(to bottom, ${majorGridColor} 1px, transparent 1px)
    `,
    backgroundSize: `
      ${pixelsPerMm * 10}px ${pixelsPerMm * 10}px,
      ${pixelsPerMm * 10}px ${pixelsPerMm * 10}px,
      ${pixelsPerMm * 100}px ${pixelsPerMm * 100}px,
      ${pixelsPerMm * 100}px ${pixelsPerMm * 100}px
    `
  }
}

/**
 * Renders a measured canvas that can host arbitrary children.
 *
 * @param props - Metric canvas props.
 * @returns A measured canvas surface.
 */
export function MetricCanvas(props: MetricCanvasProps): ReactElement {
  const {
    ariaLabel,
    backgroundColor = '#fbfaf7',
    borderColor = 'hsl(20 10% 72%)',
    children,
    className,
    gridColor = 'rgba(145, 108, 69, 0.18)',
    heightMm,
    majorGridColor = 'rgba(145, 108, 69, 0.28)',
    pixelsPerMm = 0.6,
    scrollable = true,
    showGrid = true,
    style,
    surfaceStyle,
    widthMm
  } = props
  const gridStyles = showGrid
    ? gridBackground(pixelsPerMm, gridColor, majorGridColor)
    : {}

  return (
    <div
      className={className}
      style={{
        overflow: scrollable ? 'auto' : 'visible',
        ...style
      }}
    >
      <div
        aria-label={ariaLabel ?? `${widthMm} x ${heightMm} mm`}
        data-testid="metric-canvas-surface"
        style={{
          backgroundColor,
          border: `1px solid ${borderColor}`,
          height: `${heightMm * pixelsPerMm}px`,
          position: 'relative',
          width: `${widthMm * pixelsPerMm}px`,
          ...gridStyles,
          ...surfaceStyle
        }}
      >
        {children}
      </div>
    </div>
  )
}
