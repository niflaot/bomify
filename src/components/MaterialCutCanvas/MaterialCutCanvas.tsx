'use client'

import type { ReactElement } from 'react'
import { useMemo } from 'react'

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
    gapMm = 5,
    labels,
    materialHeightCm,
    materialWidthCm,
    pieces,
    pixelsPerMm = 0.6,
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

      <div style={{ overflow: 'auto' }}>
        <div
          aria-label={`${materialWidthCm} x ${materialHeightCm} cm`}
          style={{
            backgroundColor: '#fbfaf7',
            backgroundImage: `
              linear-gradient(to right, rgba(145, 108, 69, 0.18) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(145, 108, 69, 0.18) 1px, transparent 1px),
              linear-gradient(to right, rgba(145, 108, 69, 0.28) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(145, 108, 69, 0.28) 1px, transparent 1px)
            `,
            backgroundSize: `
              ${pixelsPerMm * 10}px ${pixelsPerMm * 10}px,
              ${pixelsPerMm * 10}px ${pixelsPerMm * 10}px,
              ${pixelsPerMm * 100}px ${pixelsPerMm * 100}px,
              ${pixelsPerMm * 100}px ${pixelsPerMm * 100}px
            `,
            border: '1px solid hsl(20 10% 72%)',
            height: `${materialHeightMm * pixelsPerMm}px`,
            position: 'relative',
            width: `${materialWidthMm * pixelsPerMm}px`
          }}
        >
          {result.placed.map(placement => {
            const piece = findPiece(pieces, placement.id)

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
                  strokeWidth={1}
                  style={{ width: '100%' }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
