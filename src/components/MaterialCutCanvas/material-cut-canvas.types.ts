import type { PieceRendererSourceType } from '@/components/PieceRenderer'
import type { MaterialIconKey } from '@/core/constants/material-icons.constants'

/**
 * One hover detail row shown for a placed piece.
 */
export type MaterialCutCanvasPieceTooltipRow = {
  readonly color?: string
  readonly icon: 'material' | 'piece' | 'quantity'
  readonly iconKey?: MaterialIconKey
  readonly label: string
  readonly value: string
}

/**
 * Rich hover copy shown for a placed piece.
 */
export type MaterialCutCanvasPieceTooltip = {
  readonly title: string
  readonly rows: readonly MaterialCutCanvasPieceTooltipRow[]
}

/**
 * Source-backed piece to place on a material canvas.
 */
export type MaterialCutCanvasPiece = {
  readonly id: string
  readonly name: string
  readonly source: string | File
  readonly sourceType?: PieceRendererSourceType
  readonly widthMm: number
  readonly heightMm: number
  readonly quantity?: number
  readonly allowRotation?: boolean
  readonly strokeColor?: string
  readonly hoverStrokeColor?: string
  readonly strokeWidth?: number
  readonly hoverStrokeWidth?: number
  readonly hoverEnabled?: boolean
  readonly fillColor?: string
  readonly tooltip?: string
  readonly tooltipDetails?: MaterialCutCanvasPieceTooltip
}

/**
 * Material cut canvas labels.
 */
export type MaterialCutCanvasLabels = {
  readonly efficiency: string
  readonly waste: string
  readonly used: string
  readonly unplaced: string
  readonly piece: string
  readonly width: string
  readonly height: string
  readonly loading: string
  readonly fallbackError: string
}

/**
 * Props for the material cut layout canvas.
 */
export type MaterialCutCanvasProps = {
  readonly materialWidthCm: number
  readonly materialHeightCm: number
  readonly pieces: readonly MaterialCutCanvasPiece[]
  readonly gapMm?: number
  readonly pixelsPerMm?: number
  readonly showCanvas?: boolean
  readonly showGrid?: boolean
  readonly showStats?: boolean
  readonly showPieceBounds?: boolean
  readonly backgroundColor?: string
  readonly gridColor?: string
  readonly majorGridColor?: string
  readonly borderColor?: string
  readonly pieceStrokeColor?: string
  readonly pieceHoverStrokeColor?: string
  readonly pieceStrokeWidth?: number
  readonly pieceHoverStrokeWidth?: number
  readonly pieceHoverEnabled?: boolean
  readonly labels?: Partial<MaterialCutCanvasLabels>
}
