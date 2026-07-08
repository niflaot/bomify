/**
 * Output document format for a sheet export.
 */
export type SheetExportFormat = 'pdf' | 'dxf'

/**
 * How exported sheets are bundled into files: everything in one file, one
 * file per higher-level group (e.g. material), or one file per sheet.
 */
export type SheetExportScope = 'combined' | 'perGroup' | 'perSheet'

/**
 * One piece instance nested onto an exportable sheet, positioned by the
 * packing algorithm and still pointing at its source DXF file.
 */
export type ExportablePieceInstance = {
  readonly instanceId: string
  readonly dxfUrl: string
  readonly xMm: number
  readonly yMm: number
  readonly rotated: boolean
  readonly sourceWidthMm: number
  readonly sourceHeightMm: number
}

/**
 * One material sheet ready to be exported to PDF/DXF.
 */
export type ExportableSheet = {
  readonly id: string
  readonly name: string
  readonly widthMm: number
  readonly heightMm: number
  readonly pieces: readonly ExportablePieceInstance[]
  /** Higher-level group this sheet belongs to (e.g. a production material). */
  readonly groupKey?: string
  readonly groupLabel?: string
}
