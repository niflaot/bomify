import { jsPDF } from 'jspdf'

import { sampleArc } from '@/core/utils/dxf/dxf.curves'
import type { DxfEntity, DxfGeometry, DxfPoint } from '@/core/utils/dxf/dxf.types'

import type { ExportableSheet } from './sheet-export.types'
import { transformPieceEntities } from './sheet-export.transform'

function drawSegments(doc: jsPDF, points: readonly DxfPoint[], closed: boolean): void {
  for (let index = 0; index < points.length - 1; index += 1) {
    doc.line(points[index].x, points[index].y, points[index + 1].x, points[index + 1].y)
  }

  const first = points[0]
  const last = points[points.length - 1]

  if (closed && first && last) {
    doc.line(last.x, last.y, first.x, first.y)
  }
}

function drawEntity(doc: jsPDF, entity: DxfEntity): void {
  if (entity.type === 'line') {
    doc.line(entity.start.x, entity.start.y, entity.end.x, entity.end.y)
    return
  }

  if (entity.type === 'circle') {
    doc.circle(entity.center.x, entity.center.y, entity.radius)
    return
  }

  if (entity.type === 'arc') {
    drawSegments(doc, sampleArc(entity), false)
    return
  }

  drawSegments(doc, entity.points, entity.closed)
}

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

    transformPieceEntities(geometry, piece).forEach(entity => { drawEntity(doc, entity) })
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
