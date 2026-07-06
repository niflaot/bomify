'use client'

import type { ReactElement } from 'react'

import { defaultLabels } from './piece-renderer.constants'
import { formatMm } from './piece-renderer.format'
import { usePieceSource } from './piece-renderer.hooks'
import type { PieceRendererProps } from './piece-renderer.types'
import { DxfPreview } from './partial/DxfPreview/DxfPreview'
import { PdfPreview } from './partial/PdfPreview/PdfPreview'

/**
 * Renders a single pattern piece from a DXF or PDF source.
 *
 * @param props - Piece renderer properties.
 * @returns A measured piece preview.
 */
export function PieceRenderer(props: PieceRendererProps): ReactElement {
  const {
    ariaLabel = 'Pattern piece preview',
    className,
    framed = false,
    labels,
    measurements,
    showMeasurements = true,
    source,
    sourceType: explicitSourceType,
    strokeWidth = 1,
    style,
    unitScale = 1
  } = props
  const copy = {
    ...defaultLabels,
    ...labels
  }
  const currentState = usePieceSource({
    explicitSourceType,
    fallbackError: copy.fallbackError,
    measurements,
    source,
    unitScale
  })
  const aspectRatio = currentState.status === 'ready' && currentState.measurements
    ? `${currentState.measurements.widthMm} / ${currentState.measurements.heightMm}`
    : '16 / 9'

  return (
    <figure
      aria-label={ariaLabel}
      className={className}
      style={{
        display: 'grid',
        gap: '0.75rem',
        margin: 0,
        ...style
      }}
    >
      <div
        style={{
          alignItems: 'center',
          aspectRatio,
          background: framed ? '#fff' : 'transparent',
          border: framed ? '1px solid hsl(20 10% 82%)' : 0,
          borderRadius: framed ? '0.5rem' : 0,
          color: '#111',
          display: 'flex',
          justifyContent: 'center',
          minHeight: framed ? '180px' : 0,
          overflow: framed ? 'hidden' : 'visible',
          padding: framed ? '1rem' : 0
        }}
      >
        {currentState.status === 'loading' ? <span>{copy.loading}</span> : null}
        {currentState.status === 'error' ? <span>{currentState.message}</span> : null}
        {currentState.status === 'ready' && currentState.sourceType === 'dxf' && currentState.dxfGeometry ? (
          <DxfPreview geometry={currentState.dxfGeometry} strokeWidth={strokeWidth} />
        ) : null}
        {currentState.status === 'ready' && currentState.sourceType === 'pdf' && currentState.pdfBuffer ? (
          <PdfPreview
            ariaLabel={ariaLabel}
            buffer={currentState.pdfBuffer}
            fallbackError={copy.fallbackError}
          />
        ) : null}
      </div>

      {showMeasurements && currentState.status === 'ready' && currentState.measurements ? (
        <figcaption
          style={{
            color: 'hsl(20 10% 32%)',
            display: 'flex',
            flexWrap: 'wrap',
            fontSize: '0.875rem',
            gap: '0.75rem'
          }}
        >
          <span>{copy.width}: {formatMm(currentState.measurements.widthMm)}</span>
          <span>{copy.height}: {formatMm(currentState.measurements.heightMm)}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}
