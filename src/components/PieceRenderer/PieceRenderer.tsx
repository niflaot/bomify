'use client'

import type { CSSProperties, PointerEvent, ReactElement } from 'react'
import { memo } from 'react'

import { defaultLabels } from './piece-renderer.constants'
import { formatMm } from './piece-renderer.format'
import { usePieceSource } from './piece-renderer.hooks'
import type { PieceRendererProps } from './piece-renderer.types'
import { DxfPreview } from './partial/DxfPreview/DxfPreview'
import { PdfPreview } from './partial/PdfPreview/PdfPreview'

type PieceRendererStyle = CSSProperties & {
  readonly '--piece-renderer-stroke-color': string
  readonly '--piece-renderer-stroke-width': string
}

function setStrokeVariables(element: HTMLElement, color: string, width: number): void {
  element.style.setProperty('--piece-renderer-stroke-color', color)
  element.style.setProperty('--piece-renderer-stroke-width', width.toString())
}

function PieceRendererComponent(props: PieceRendererProps): ReactElement {
  const {
    ariaLabel = 'Pattern piece preview',
    className,
    framed = false,
    hoverEnabled = true,
    hoverStrokeColor,
    hoverStrokeWidth,
    labels,
    measurements,
    showMeasurements = true,
    source,
    sourceType: explicitSourceType,
    strokeColor = '#111',
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
  const figureStyle: PieceRendererStyle = {
    display: 'grid',
    gap: '0.75rem',
    margin: 0,
    ...style,
    '--piece-renderer-stroke-color': strokeColor,
    '--piece-renderer-stroke-width': strokeWidth.toString()
  }
  const applyHoverStroke = (event: PointerEvent<HTMLElement>): void => {
    if (!hoverEnabled) {
      return
    }

    setStrokeVariables(
      event.currentTarget,
      hoverStrokeColor ?? strokeColor,
      hoverStrokeWidth ?? strokeWidth
    )
  }
  const resetStroke = (event: PointerEvent<HTMLElement>): void => {
    setStrokeVariables(event.currentTarget, strokeColor, strokeWidth)
  }

  return (
    <figure
      aria-label={ariaLabel}
      className={className}
      onPointerEnter={applyHoverStroke}
      onPointerLeave={resetStroke}
      style={figureStyle}
    >
      <div
        style={{
          alignItems: 'center',
          aspectRatio,
          background: framed ? '#fff' : 'transparent',
          border: framed ? '1px solid hsl(20 10% 82%)' : 0,
          borderRadius: framed ? '0.5rem' : 0,
          color: 'var(--piece-renderer-stroke-color)',
          contain: 'layout paint',
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

/**
 * Renders a single pattern piece from a DXF or PDF source.
 *
 * @param props - Piece renderer properties.
 * @returns A measured piece preview.
 */
export const PieceRenderer = memo(PieceRendererComponent)

PieceRenderer.displayName = 'PieceRenderer'
