/**
 * One resolved piece/material pairing for the pieces list document.
 */
export type PieceMaterialRow = {
  readonly pieceId: string
  readonly pieceLabel: string
  readonly pieceDxfUrl: string | null
  readonly pieceWidthMm: number
  readonly pieceHeightMm: number
  readonly materialLabel: string
  readonly materialLabelName: string
  readonly materialColor: string
  readonly quantity: number
}

/**
 * How the pieces list groups its rows.
 */
export type PiecesListGroupBy = 'material' | 'piece'

/**
 * One group of rows sharing a material (or a piece), depending on
 * `PiecesListGroupBy`.
 */
export type PieceMaterialGroup = {
  readonly groupLabel: string
  readonly items: readonly PieceMaterialRow[]
}
