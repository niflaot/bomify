import type { ReactElement } from 'react'

import { MetricCanvas } from '@/components/MetricCanvas'
import type { MaterialCutCanvasLabels } from '@/components/MaterialCutCanvas'
import { PlacedMaterialPiece } from '@/components/MaterialCutCanvas/partial/PlacedMaterialPiece/PlacedMaterialPiece'

import type { ProductWorkspaceLabels } from '@/views/ProductWorkspace/types/product-workspace.types'
import type { DespieceMaterialSheet } from './utils/despiece-view.utils'

type DespieceSheetProps = {
  readonly labels: ProductWorkspaceLabels
  readonly pixelsPerMm: number
  readonly sheet: DespieceMaterialSheet
}

function toMaterialLabels(labels: ProductWorkspaceLabels): MaterialCutCanvasLabels {
  return {
    efficiency: labels.canvasEfficiency,
    fallbackError: labels.canvasFallbackError,
    height: labels.pieceHeightLabel,
    loading: labels.canvasLoadingPiece,
    piece: labels.pieces,
    unplaced: labels.canvasUnplaced,
    used: labels.canvasUsed,
    waste: labels.canvasWaste,
    width: labels.pieceWidthLabel
  }
}

/**
 * Renders one pliego surface with the already packed despiece pieces.
 *
 * @param props - Despiece sheet props.
 * @returns Pliego metric canvas.
 */
export function DespieceSheet(props: DespieceSheetProps): ReactElement {
  const { labels, pixelsPerMm, sheet } = props
  const piecesById = new Map(sheet.pieces.map(piece => [piece.id, piece]))
  const materialLabels = toMaterialLabels(labels)

  return (
    <MetricCanvas
      ariaLabel={sheet.name}
      backgroundColor="#ffffff"
      borderColor="#111111"
      className="overflow-visible"
      gridColor="rgba(17, 17, 17, 0.12)"
      heightMm={sheet.heightCm * 10}
      majorGridColor="rgba(17, 17, 17, 0.24)"
      pixelsPerMm={pixelsPerMm}
      scrollable={false}
      surfaceStyle={{
        overflow: 'visible'
      }}
      widthMm={sheet.widthCm * 10}
    >
      {sheet.placements.map(placement => {
        const piece = piecesById.get(placement.id)

        if (!piece) {
          return null
        }

        return (
          <PlacedMaterialPiece
            defaultHoverEnabled
            defaultStrokeWidth={0.9}
            key={placement.instanceId}
            labels={materialLabels}
            piece={piece}
            pixelsPerMm={pixelsPerMm}
            placement={placement}
            showPieceBounds={false}
          />
        )
      })}
    </MetricCanvas>
  )
}
