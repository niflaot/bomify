import type { MaterialCutCanvasPiece } from '@/components/MaterialCutCanvas'
import type { PackedPiece } from '@/core/utils/material-packing/material-packing.types'

import type { ExportablePieceInstance, ExportableSheet } from './sheet-export.types'

/**
 * A generic packed sheet shape shared by production and despiece views.
 */
export type PackedMaterialSheet = {
  readonly id: string
  readonly name: string
  readonly widthCm: number
  readonly heightCm: number
  readonly pieces: readonly MaterialCutCanvasPiece[]
  readonly placements: readonly PackedPiece[]
}

/**
 * Higher-level group a sheet belongs to (e.g. a production material),
 * used to bundle several sheets into one file when exporting "per group".
 */
export type ExportableSheetGroup = {
  readonly key: string
  readonly label: string
}

function toExportablePiece(
  placement: PackedPiece,
  piecesById: ReadonlyMap<string, MaterialCutCanvasPiece>
): ExportablePieceInstance | null {
  const piece = piecesById.get(placement.id)

  if (!piece || typeof piece.source !== 'string' || piece.source.length === 0) {
    return null
  }

  return {
    dxfUrl: piece.source,
    instanceId: placement.instanceId,
    rotated: placement.rotated,
    sourceHeightMm: piece.heightMm,
    sourceWidthMm: piece.widthMm,
    xMm: placement.xMm,
    yMm: placement.yMm
  }
}

function resolveSheetSizeMm(
  sheet: PackedMaterialSheet,
  nominalWidthMm: number,
  nominalHeightMm: number
): { readonly widthMm: number; readonly heightMm: number } {
  const oversizedPiece = sheet.pieces.find(piece =>
    piece.widthMm > nominalWidthMm || piece.heightMm > nominalHeightMm
  )

  if (!oversizedPiece) {
    return { heightMm: nominalHeightMm, widthMm: nominalWidthMm }
  }

  return {
    heightMm: Math.max(oversizedPiece.heightMm, nominalHeightMm),
    widthMm: Math.max(oversizedPiece.widthMm, nominalWidthMm)
  }
}

/**
 * Converts a packed material sheet (production or despiece) into the
 * shared exportable shape consumed by the DXF/PDF builders.
 *
 * `sheet.widthCm/heightCm` reports the nominal sheet size even when it
 * physically packed a single oversized ("de largo") piece that exceeds it
 * (see `despiece-view.utils.ts`'s oversized fallback), so the real document
 * size is derived from the largest piece instead of trusted blindly.
 *
 * @param sheet - Packed sheet as rendered on screen.
 * @param group - Higher-level group this sheet belongs to (e.g. its
 * production material), used later to bundle sheets "per group".
 * @returns The exportable sheet, or `null` if it has no exportable pieces.
 */
export function toExportableSheet(
  sheet: PackedMaterialSheet,
  group?: ExportableSheetGroup
): ExportableSheet | null {
  const piecesById = new Map(sheet.pieces.map(piece => [piece.id, piece]))
  const pieces = sheet.placements
    .map(placement => toExportablePiece(placement, piecesById))
    .filter((piece): piece is ExportablePieceInstance => piece !== null)

  if (pieces.length === 0) {
    return null
  }

  const { heightMm, widthMm } = resolveSheetSizeMm(sheet, sheet.widthCm * 10, sheet.heightCm * 10)

  return {
    groupKey: group?.key,
    groupLabel: group?.label,
    heightMm,
    id: sheet.id,
    name: sheet.name,
    pieces,
    widthMm
  }
}

/**
 * Converts every packed sheet in a view (production material or despiece)
 * into the shared exportable shape, dropping sheets with nothing to export.
 *
 * @param sheets - Packed sheets as rendered on screen.
 * @param group - Higher-level group every sheet in this list belongs to.
 * @returns Exportable sheets, in the same order.
 */
export function toExportableSheets(
  sheets: readonly PackedMaterialSheet[],
  group?: ExportableSheetGroup
): ExportableSheet[] {
  return sheets
    .map(sheet => toExportableSheet(sheet, group))
    .filter((sheet): sheet is ExportableSheet => sheet !== null)
}
