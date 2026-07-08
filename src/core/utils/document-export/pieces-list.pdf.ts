import { jsPDF } from 'jspdf'

import { drawDxfEntity } from '@/core/utils/document-export/draw-dxf-entity.utils'
import type { DxfGeometry } from '@/core/utils/dxf/dxf.types'
import { transformPieceEntities } from '@/core/utils/sheet-export/sheet-export.transform'

import { groupPieceMaterialRows } from './pieces-list.grouping'
import type { PieceMaterialRow, PiecesListGroupBy } from './pieces-list.types'

/**
 * Labels used to render the pieces list document.
 */
export type PiecesListPdfLabels = {
  readonly title: string
  readonly quantityLabel: string
}

/**
 * Input required to build the pieces list PDF.
 */
export type PiecesListPdfInput = {
  readonly groupBy: PiecesListGroupBy
  readonly rows: readonly PieceMaterialRow[]
  readonly showThumbnails: boolean
  readonly geometryByUrl: ReadonlyMap<string, DxfGeometry>
  readonly labels: PiecesListPdfLabels
}

const pageWidthMm = 215.9
const pageHeightMm = 279.4
const marginMm = 18
const thumbnailSizeMm = 12
const rowHeightMm = 9
const rowHeightWithThumbnailMm = thumbnailSizeMm + 3

function drawThumbnail(doc: jsPDF, row: PieceMaterialRow, x: number, y: number, geometryByUrl: ReadonlyMap<string, DxfGeometry>): void {
  doc.rect(x, y, thumbnailSizeMm, thumbnailSizeMm)

  const geometry = row.pieceDxfUrl ? geometryByUrl.get(row.pieceDxfUrl) : undefined

  if (!geometry) {
    return
  }

  const entities = transformPieceEntities(geometry, {
    dxfUrl: row.pieceDxfUrl ?? '',
    instanceId: row.pieceId,
    rotated: false,
    sourceHeightMm: thumbnailSizeMm,
    sourceWidthMm: thumbnailSizeMm,
    xMm: x,
    yMm: y
  })

  entities.forEach(entity => { drawDxfEntity(doc, entity) })
}

/**
 * Builds a multi-page PDF listing pieces grouped either by material or by
 * piece, optionally with a small rendered outline of each piece (from its
 * real DXF geometry).
 *
 * @param input - Pieces list content.
 * @returns The generated PDF as a Blob.
 */
export function buildPiecesListPdf(input: PiecesListPdfInput): Blob {
  const { geometryByUrl, groupBy, labels, rows, showThumbnails } = input
  const groups = groupPieceMaterialRows(rows, groupBy)
  const doc = new jsPDF({ format: 'letter', orientation: 'portrait', unit: 'mm' })
  const rowHeight = showThumbnails ? rowHeightWithThumbnailMm : rowHeightMm
  let cursorY = marginMm

  function ensureSpace(neededMm: number): void {
    if (cursorY + neededMm > pageHeightMm - marginMm) {
      doc.addPage()
      cursorY = marginMm
    }
  }

  doc.setFontSize(16)
  doc.text(labels.title, marginMm, cursorY)
  cursorY += 12

  groups.forEach(group => {
    ensureSpace(10)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(group.groupLabel, marginMm, cursorY)
    cursorY += 3
    doc.line(marginMm, cursorY, pageWidthMm - marginMm, cursorY)
    cursorY += 6

    group.items.forEach(item => {
      ensureSpace(rowHeight)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)

      const textX = showThumbnails ? marginMm + thumbnailSizeMm + 4 : marginMm
      const textY = showThumbnails ? cursorY + thumbnailSizeMm / 2 + 1 : cursorY

      if (showThumbnails) {
        drawThumbnail(doc, item, marginMm, cursorY, geometryByUrl)
      }

      const itemLabel = groupBy === 'material' ? item.pieceLabel : item.materialLabel

      doc.text(itemLabel, textX, textY)
      doc.text(`${labels.quantityLabel}: ${item.quantity}`, pageWidthMm - marginMm, textY, { align: 'right' })

      cursorY += rowHeight
    })

    cursorY += 4
  })

  return doc.output('blob')
}
