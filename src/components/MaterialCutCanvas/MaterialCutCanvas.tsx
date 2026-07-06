'use client'

import type { ReactElement } from 'react'
import { useMemo } from 'react'

import { MetricCanvas } from '@/components/MetricCanvas'
import { packMaterialPieces } from '@/core/utils/material-packing.utils'

import { defaultMaterialCutCanvasLabels } from './material-cut-canvas.constants'
import type { MaterialCutCanvasPiece, MaterialCutCanvasProps } from './material-cut-canvas.types'
import { PlacedMaterialPiece } from './partial/PlacedMaterialPiece/PlacedMaterialPiece'

function formatSquareMeters(valueMm2: number): string {
  return `${(valueMm2 / 1_000_000).toFixed(2)} m2`
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function getPlacedPiece(
  piecesById: ReadonlyMap<string, MaterialCutCanvasPiece>,
  id: string
): MaterialCutCanvasPiece {
  const piece = piecesById.get(id)

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
  const copy = useMemo(
    () => ({
      ...defaultMaterialCutCanvasLabels,
      ...labels
    }),
    [labels]
  )
  const materialWidthMm = materialWidthCm * 10
  const materialHeightMm = materialHeightCm * 10
  const piecesById = useMemo(
    () => new Map(pieces.map(piece => [piece.id, piece])),
    [pieces]
  )
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
            const piece = getPlacedPiece(piecesById, placement.id)

            return (
              <PlacedMaterialPiece
                defaultHoverEnabled={pieceHoverEnabled}
                defaultHoverStrokeColor={pieceHoverStrokeColor}
                defaultHoverStrokeWidth={pieceHoverStrokeWidth}
                defaultStrokeColor={pieceStrokeColor}
                defaultStrokeWidth={pieceStrokeWidth}
                key={placement.instanceId}
                labels={copy}
                piece={piece}
                pixelsPerMm={pixelsPerMm}
                placement={placement}
                showPieceBounds={showPieceBounds}
              />
            )
          })}
        </MetricCanvas>
      ) : null}
    </section>
  )
}
