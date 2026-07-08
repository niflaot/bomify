import { jsPDF } from 'jspdf'

import { drawDxfEntity } from '@/core/utils/document-export/draw-dxf-entity.utils'
import type { DxfGeometry } from '@/core/utils/dxf/dxf.types'

import type { ExportableSheet } from './sheet-export.types'
import { transformPieceEntities } from './sheet-export.transform'

function pageOrientation(widthMm: number, heightMm: number): 'landscape' | 'portrait' {
  return widthMm >= heightMm ? 'landscape' : 'portrait'
}

function drawSheet(
  doc: jsPDF,
  sheet: ExportableSheet,
  geometryByUrl: ReadonlyMap<string, DxfGeometry>
): void {
  doc.rect(0, 0, sheet.widthMm, sheet.heightMm)

  sheet.pieces.forEach(piece => {
    const geometry = geometryByUrl.get(piece.dxfUrl)

    if (!geometry) {
      return
    }

    transformPieceEntities(geometry, piece).forEach(entity => { drawDxfEntity(doc, entity) })
  })
}

/**
 * Builds one PDF with a page per sheet, drawing each piece's real cut
 * outline scaled/rotated/translated into its packed position.
 *
 * @param sheets - Sheets to include, one per page.
 * @param geometryByUrl - Parsed source geometry for every piece's DXF URL.
 * @returns The generated PDF as a Blob.
 */
export function buildSheetsPdf(
  sheets: readonly ExportableSheet[],
  geometryByUrl: ReadonlyMap<string, DxfGeometry>
): Blob {
  const [firstSheet, ...restSheets] = sheets
  const initialSize: [number, number] = firstSheet ? [firstSheet.widthMm, firstSheet.heightMm] : [100, 100]
  const doc = new jsPDF({
    format: initialSize,
    orientation: pageOrientation(...initialSize),
    unit: 'mm'
  })

  if (firstSheet) {
    drawSheet(doc, firstSheet, geometryByUrl)
  }

  restSheets.forEach(sheet => {
    doc.addPage([sheet.widthMm, sheet.heightMm], pageOrientation(sheet.widthMm, sheet.heightMm))
    drawSheet(doc, sheet, geometryByUrl)
  })

  return doc.output('blob')
}
