import { jsPDF } from 'jspdf'

import { formatCop } from '@/core/utils/currency/currency.utils'

import { rasterizeLogo } from './logo.utils'

/**
 * One material row in the materials list document.
 */
export type MaterialsListRow = {
  readonly materialName: string
  readonly lengthMeters: number
  readonly costCop: number | null
}

/**
 * Labels used to render the materials list document.
 */
export type MaterialsListPdfLabels = {
  readonly title: string
  readonly referenceLabel: string
  readonly combinationLabel: string
  readonly materialColumnLabel: string
  readonly metersColumnLabel: string
  readonly costColumnLabel: string
  readonly noCombination: string
}

/**
 * Input required to build the materials list PDF.
 */
export type MaterialsListPdfInput = {
  readonly productName: string
  readonly combinationName: string | null
  readonly rows: readonly MaterialsListRow[]
  readonly labels: MaterialsListPdfLabels
}

const pageWidthMm = 215.9
const marginMm = 18
const contentWidthMm = pageWidthMm - marginMm * 2

function formatMeters(value: number): string {
  return `${value.toFixed(2)} m`
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString('es-CO', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Builds a one-page PDF listing meters (and cost, when priced) used per
 * material for the current combination and production units.
 *
 * @param input - Materials list content.
 * @returns The generated PDF as a Blob.
 */
export async function buildMaterialsListPdf(input: MaterialsListPdfInput): Promise<Blob> {
  const { combinationName, labels, productName, rows } = input
  const doc = new jsPDF({ format: 'letter', orientation: 'portrait', unit: 'mm' })
  const logo = await rasterizeLogo()
  let cursorY = marginMm

  if (logo) {
    const logoHeightMm = 14
    const logoWidthMm = logoHeightMm * (logo.width / logo.height)

    doc.addImage(logo.dataUrl, 'PNG', marginMm, cursorY, logoWidthMm, logoHeightMm)
  }

  doc.setFontSize(16)
  doc.text(labels.title, marginMm + (logo ? 20 : 0), cursorY + 8)
  cursorY += 20

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(`${labels.referenceLabel}: ${productName}`, marginMm, cursorY)
  cursorY += 9

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`${labels.combinationLabel}: ${combinationName ?? labels.noCombination}`, marginMm, cursorY)
  cursorY += 6
  doc.text(formatTimestamp(new Date()), marginMm, cursorY)
  cursorY += 10

  const materialColumnX = marginMm
  const metersColumnX = marginMm + contentWidthMm * 0.55
  const costColumnX = marginMm + contentWidthMm * 0.78

  doc.setFont('helvetica', 'bold')
  doc.text(labels.materialColumnLabel, materialColumnX, cursorY)
  doc.text(labels.metersColumnLabel, metersColumnX, cursorY)
  doc.text(labels.costColumnLabel, costColumnX, cursorY)
  cursorY += 2
  doc.line(marginMm, cursorY, marginMm + contentWidthMm, cursorY)
  cursorY += 6
  doc.setFont('helvetica', 'normal')

  rows.forEach(row => {
    doc.text(row.materialName, materialColumnX, cursorY)
    doc.text(formatMeters(row.lengthMeters), metersColumnX, cursorY)
    doc.text(formatCop(row.costCop), costColumnX, cursorY)
    cursorY += 7
  })

  return doc.output('blob')
}
