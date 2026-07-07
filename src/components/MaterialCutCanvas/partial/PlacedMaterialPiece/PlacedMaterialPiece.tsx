'use client'

import type { CSSProperties, ReactElement } from 'react'
import { memo } from 'react'

import { PieceRenderer } from '@/components/PieceRenderer'
import type { PackedPiece } from '@/core/utils/material-packing/material-packing.types'

import type { MaterialCutCanvasLabels, MaterialCutCanvasPiece } from '../../material-cut-canvas.types'
import { PieceHoverCard } from './PieceHoverCard'

type PlacedMaterialPieceProps = {
  readonly placement: PackedPiece
  readonly piece: MaterialCutCanvasPiece
  readonly labels: MaterialCutCanvasLabels
  readonly pixelsPerMm: number
  readonly showPieceBounds: boolean
  readonly defaultHoverEnabled: boolean
  readonly defaultHoverStrokeColor?: string
  readonly defaultHoverStrokeWidth?: number
  readonly defaultStrokeColor?: string
  readonly defaultStrokeWidth: number
}

function buildPieceStyle(
  piece: MaterialCutCanvasPiece,
  placement: PackedPiece,
  pixelsPerMm: number,
  showPieceBounds: boolean
): CSSProperties {
  return {
    backgroundColor: piece.fillColor
      ? `color-mix(in srgb, ${piece.fillColor} 14%, transparent)`
      : undefined,
    contain: 'layout',
    height: `${placement.heightMm * pixelsPerMm}px`,
    left: 0,
    outline: showPieceBounds ? '1px dashed rgba(42, 34, 28, 0.28)' : 0,
    position: 'absolute',
    top: 0,
    transform: `translate3d(${placement.xMm * pixelsPerMm}px, ${placement.yMm * pixelsPerMm}px, 0)`,
    width: `${placement.widthMm * pixelsPerMm}px`
  }
}

function PlacedMaterialPieceComponent(props: PlacedMaterialPieceProps): ReactElement {
  const {
    defaultHoverEnabled,
    defaultHoverStrokeColor,
    defaultHoverStrokeWidth,
    defaultStrokeColor,
    defaultStrokeWidth,
    labels,
    piece,
    pixelsPerMm,
    placement,
    showPieceBounds
  } = props
  const strokeColor = piece.strokeColor ?? defaultStrokeColor
  const hoverStrokeColor = piece.hoverStrokeColor ?? defaultHoverStrokeColor
  const strokeWidth = piece.strokeWidth ?? defaultStrokeWidth
  const hoverStrokeWidth = piece.hoverStrokeWidth ?? defaultHoverStrokeWidth
  const hoverEnabled = piece.hoverEnabled ?? defaultHoverEnabled

  return (
    <div
      aria-label={`${piece.name} ${placement.instanceId}`}
      className="group hover:z-50"
      style={buildPieceStyle(piece, placement, pixelsPerMm, showPieceBounds)}
    >
      <PieceRenderer
        ariaLabel={piece.name}
        hoverEnabled={hoverEnabled}
        hoverStrokeColor={hoverStrokeColor}
        hoverStrokeWidth={hoverStrokeWidth}
        labels={{
          fallbackError: labels.fallbackError,
          height: labels.height,
          loading: labels.loading,
          width: labels.width
        }}
        measurements={{
          widthMm: piece.widthMm,
          heightMm: piece.heightMm
        }}
        showMeasurements={false}
        source={piece.source}
        sourceType={piece.sourceType}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        style={{ width: '100%' }}
      />
      <PieceHoverCard fallback={piece.tooltip} tooltip={piece.tooltipDetails} />
    </div>
  )
}

/**
 * Renders one packed pattern piece inside a material canvas.
 *
 * @param props - Packed piece preview props.
 * @returns Positioned piece preview.
 */
export const PlacedMaterialPiece = memo(PlacedMaterialPieceComponent)

PlacedMaterialPiece.displayName = 'PlacedMaterialPiece'
