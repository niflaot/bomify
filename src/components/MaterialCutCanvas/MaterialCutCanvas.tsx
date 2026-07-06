'use client'

import type { ReactElement } from 'react'
import { useMemo } from 'react'

import { MetricCanvas } from '@/components/MetricCanvas'
import { PieceRenderer } from '@/components/PieceRenderer'
import { packMaterialPieces } from '@/core/utils/material-packing.utils'

import { defaultMaterialCutCanvasLabels } from './material-cut-canvas.constants'
import type { MaterialCutCanvasPiece, MaterialCutCanvasProps } from './material-cut-canvas.types'

function formatSquareMeters(valueMm2: number): string {
  return `${(valueMm2 / 1_000_000).toFixed(2)} m2`
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function findPiece(pieces: readonly MaterialCutCanvasPiece[], id: string): MaterialCutCanvasPiece {
  const piece = pieces.find(candidate => candidate.id === id)

  if (!piece) {
    throw new Error(`Missing piece ${id}`)
  }

  return piece
}

/**
 * Renders a measured material sheet and arranges pattern pieces inside it.
 *
 * @param props - Material cut canvas props.
 * @returns A packed material layout preview.
 */
export function MaterialCutCanvas(props: MaterialCutCanvasProps): ReactElement {
  const {
    backgroundColor,
    borderColor,
    gapMm = 5,
    gridColor,
    labels,
    majorGridColor,
    materialHeightCm,
    materialWidthCm,
    pieceHoverEnabled = true,
    pieceHoverStrokeColor,
    pieceHoverStrokeWidth,
    pieceStrokeColor,
    pieceStrokeWidth = 1,
    pieces,
    pixelsPerMm = 0.6,
    showCanvas = true,
    showGrid = true,
    showPieceBounds = false,
    showStats = true
  } = props
  const copy = {
    ...defaultMaterialCutCanvasLabels,
    ...labels
  }
  const materialWidthMm = materialWidthCm * 10
  const materialHeightMm = materialHeightCm * 10
  const result = useMemo(
    () => packMaterialPieces(
      materialWidthMm,
      materialHeightMm,
      pieces.map(piece => ({
        id: piece.id,
        widthMm: piece.widthMm,
        heightMm: piece.heightMm,
        quantity: piece.quantity,
        allowRotation: piece.allowRotation
      })),
      gapMm
    ),
    [gapMm, materialHeightMm, materialWidthMm, pieces]
  )

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      {showStats ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <strong>{copy.efficiency}: {formatPercent(result.stats.efficiency)}</strong>
          <span>{copy.used}: {formatSquareMeters(result.stats.usedAreaMm2)}</span>
          <span>{copy.waste}: {formatSquareMeters(result.stats.wasteAreaMm2)}</span>
          {result.unplaced.length > 0 ? (
            <span>{copy.unplaced}: {result.unplaced.length}</span>
          ) : null}
        </div>
      ) : null}

      {showCanvas ? (
        <MetricCanvas
          aria-label={`${materialWidthCm} x ${materialHeightCm} cm`}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          gridColor={gridColor}
          heightMm={materialHeightMm}
          majorGridColor={majorGridColor}
          pixelsPerMm={pixelsPerMm}
          showGrid={showGrid}
          widthMm={materialWidthMm}
        >
          {result.placed.map(placement => {
            const piece = findPiece(pieces, placement.id)
            const strokeColor = piece.strokeColor ?? pieceStrokeColor
            const hoverStrokeColor = piece.hoverStrokeColor ?? pieceHoverStrokeColor
            const strokeWidth = piece.strokeWidth ?? pieceStrokeWidth
            const hoverStrokeWidth = piece.hoverStrokeWidth ?? pieceHoverStrokeWidth
            const hoverEnabled = piece.hoverEnabled ?? pieceHoverEnabled

            return (
              <div
                aria-label={`${piece.name} ${placement.instanceId}`}
                key={placement.instanceId}
                style={{
                  height: `${placement.heightMm * pixelsPerMm}px`,
                  left: `${placement.xMm * pixelsPerMm}px`,
                  outline: showPieceBounds ? '1px dashed rgba(42, 34, 28, 0.28)' : 0,
                  position: 'absolute',
                  top: `${placement.yMm * pixelsPerMm}px`,
                  width: `${placement.widthMm * pixelsPerMm}px`
                }}
                title={`${piece.name} · ${copy.width}: ${piece.widthMm} mm · ${copy.height}: ${piece.heightMm} mm`}
              >
                <PieceRenderer
                  ariaLabel={piece.name}
                  labels={{
                    fallbackError: copy.fallbackError,
                    height: copy.height,
                    loading: copy.loading,
                    width: copy.width
                  }}
                  measurements={{
                    widthMm: piece.widthMm,
                    heightMm: piece.heightMm
                  }}
                  showMeasurements={false}
                  source={piece.source}
                  sourceType={piece.sourceType}
                  hoverEnabled={hoverEnabled}
                  hoverStrokeColor={hoverStrokeColor}
                  hoverStrokeWidth={hoverStrokeWidth}
                  strokeColor={strokeColor}
                  strokeWidth={strokeWidth}
                  style={{ width: '100%' }}
                />
              </div>
            )
          })}
        </MetricCanvas>
      ) : null}
    </section>
  )
}
