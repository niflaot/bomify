import { getSheetMarginMm } from '@/core/config/production-cut.config'
import type { DxfEntity, DxfGeometry } from '@/core/utils/dxf/dxf.types'
import { serializeDxfDocument } from '@/core/utils/dxf-writer/dxf-writer.utils'
import type { DxfLayerGroup } from '@/core/utils/dxf-writer/dxf-writer.types'

import type { ExportableSheet } from './sheet-export.types'
import { transformPieceEntities } from './sheet-export.transform'

const invalidDxfLayerChars = /[^A-Z0-9_]+/g

function toDxfLayerName(name: string, index: number): string {
  const sanitized = name.toUpperCase().replace(invalidDxfLayerChars, '_').replace(/^_+|_+$/g, '')

  return sanitized.length > 0 ? sanitized : `HOJA_${index + 1}`
}

function buildBoundaryEntities(widthMm: number, heightMm: number, offsetYMm: number): DxfEntity[] {
  const corners = [
    { x: 0, y: offsetYMm },
    { x: widthMm, y: offsetYMm },
    { x: widthMm, y: offsetYMm + heightMm },
    { x: 0, y: offsetYMm + heightMm }
  ]

  return corners.map((start, index) => ({
    end: corners[(index + 1) % corners.length],
    start,
    type: 'line' as const
  }))
}

function buildSheetLayer(
  sheet: ExportableSheet,
  index: number,
  offsetYMm: number,
  geometryByUrl: ReadonlyMap<string, DxfGeometry>
): DxfLayerGroup {
  const layer = toDxfLayerName(sheet.name, index)
  const pieceEntities = sheet.pieces.flatMap(piece => {
    const geometry = geometryByUrl.get(piece.dxfUrl)

    return geometry ? transformPieceEntities(geometry, piece, 0, offsetYMm) : []
  })

  return {
    entities: [...buildBoundaryEntities(sheet.widthMm, sheet.heightMm, offsetYMm), ...pieceEntities],
    layer
  }
}

/**
 * Builds one DXF document containing every given sheet, stacked vertically
 * (each on its own named layer) so a single file can hold several sheets —
 * used both for "combine all sheets" exports and for a single-sheet file.
 *
 * @param sheets - Sheets to include, in stacking order.
 * @param geometryByUrl - Parsed source geometry for every piece's DXF URL.
 * @returns DXF document text.
 */
export function buildSheetsDxf(
  sheets: readonly ExportableSheet[],
  geometryByUrl: ReadonlyMap<string, DxfGeometry>
): string {
  const gapMm = getSheetMarginMm()
  let offsetYMm = 0
  const layers: DxfLayerGroup[] = []

  sheets.forEach((sheet, index) => {
    layers.push(buildSheetLayer(sheet, index, offsetYMm, geometryByUrl))
    offsetYMm += sheet.heightMm + gapMm
  })

  return serializeDxfDocument(layers)
}
