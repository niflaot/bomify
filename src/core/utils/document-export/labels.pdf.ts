import { jsPDF } from 'jspdf'

import { hexToRgb } from './hex-color.utils'
import { rasterizeLogo } from './logo.utils'
import type { RasterizedLogo } from './logo.utils'
import { computeStickerLayout, paginateStickers } from './sticker-layout.utils'

/**
 * One material row shown on a label.
 */
export type LabelStickerItem = {
  readonly materialLabel: string
  readonly materialColor: string
  readonly quantity: number
}

/**
 * One label (one sticker per piece).
 */
export type LabelSticker = {
  readonly pieceLabel: string
  readonly items: readonly LabelStickerItem[]
}

/**
 * Input required to build the labels PDF.
 */
export type LabelsPdfInput = {
  readonly productName: string
  readonly stickers: readonly LabelSticker[]
  readonly gapMm: number
}

export const labelsPageWidthMm = 215.9
export const labelsPageHeightMm = 279.4
export const labelsPageMarginMm = 8
export const stickerWidthMm = 100
export const stickerHeightMm = 60

function drawSticker(
  doc: jsPDF,
  sticker: LabelSticker,
  x: number,
  y: number,
  productName: string,
  logo: RasterizedLogo | null
): void {
  const paddingMm = 5

  doc.setDrawColor(0, 0, 0)
  doc.rect(x, y, stickerWidthMm, stickerHeightMm)

  if (logo) {
    const logoHeightMm = 9
    const logoWidthMm = logoHeightMm * (logo.width / logo.height)

    doc.addImage(
      logo.dataUrl,
      'PNG',
      x + stickerWidthMm - paddingMm - logoWidthMm,
      y + paddingMm - 1,
      logoWidthMm,
      logoHeightMm
    )
  }

  let cursorY = y + paddingMm + 5

  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(sticker.pieceLabel, x + paddingMm, cursorY)
  cursorY += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(productName, x + paddingMm, cursorY)
  cursorY += 5
  doc.line(x + paddingMm, cursorY, x + stickerWidthMm - paddingMm, cursorY)
  cursorY += 6

  sticker.items.forEach(item => {
    const [red, green, blue] = hexToRgb(item.materialColor)

    doc.setFillColor(red, green, blue)
    doc.circle(x + paddingMm + 1.5, cursorY - 1.3, 1.5, 'F')
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(item.materialLabel, x + paddingMm + 6, cursorY)
    doc.text(`×${item.quantity}`, x + stickerWidthMm - paddingMm, cursorY, { align: 'right' })
    cursorY += 7
  })
}

/**
 * Builds a multi-page PDF of printable piece labels, one sticker per
 * piece, using the exact same grid math as the on-screen preview so the
 * two never drift apart.
 *
 * @param input - Labels content and layout options.
 * @returns The generated PDF as a Blob.
 */
export async function buildLabelsPdf(input: LabelsPdfInput): Promise<Blob> {
  const { gapMm, productName, stickers } = input
  const layout = computeStickerLayout({
    gapMm,
    marginMm: labelsPageMarginMm,
    pageHeightMm: labelsPageHeightMm,
    pageWidthMm: labelsPageWidthMm,
    stickerHeightMm,
    stickerWidthMm
  })
  const pages = paginateStickers(stickers, layout.capacity)
  const doc = new jsPDF({ format: 'letter', orientation: 'portrait', unit: 'mm' })
  const logo = await rasterizeLogo()

  pages.forEach((page, pageIndex) => {
    if (pageIndex > 0) {
      doc.addPage()
    }

    page.forEach((sticker, index) => {
      const column = index % layout.columns
      const row = Math.floor(index / layout.columns)
      const x = labelsPageMarginMm + column * (stickerWidthMm + gapMm)
      const y = labelsPageMarginMm + row * (stickerHeightMm + gapMm)

      drawSticker(doc, sticker, x, y, productName, logo)
    })
  })

  return doc.output('blob')
}
