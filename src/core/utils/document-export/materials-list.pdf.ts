import { jsPDF } from 'jspdf'

import { ADDITION_CATEGORIES } from '@/core/constants/addition-category.constants'
import type { ProductAdditionCategory } from '@/core/types/product-addition.types'
import { formatCop } from '@/core/utils/currency/currency.utils'
import { formatQuantity } from '@/core/utils/quantity/quantity.utils'

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
 * One addition row in the materials list document.
 */
export type MaterialsListAdditionRow = {
  readonly category: ProductAdditionCategory
  readonly name: string
  readonly quantity: number
  readonly costCop: number
}

/**
 * Cost/sale/profit summary shown at the end of the document (Ficha técnica).
 */
export type MaterialsListSummary = {
  readonly costLabel: string
  readonly saleLabel: string
  readonly profitLabel: string
  readonly costCop: number
  readonly saleCop: number | null
  readonly profitCop: number | null
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
  readonly additionsSectionTitle: string
  readonly additionCategoryHerrajes: string
  readonly additionCategoryManoDeObra: string
  readonly additionCategoryVarios: string
  readonly additionQuantityColumnLabel: string
}

/**
 * Input required to build the materials list PDF.
 */
export type MaterialsListPdfInput = {
  readonly productName: string
  readonly combinationName: string | null
  readonly rows: readonly MaterialsListRow[]
  readonly additions?: readonly MaterialsListAdditionRow[]
  readonly summary?: MaterialsListSummary
  readonly labels: MaterialsListPdfLabels
}

const pageWidthMm = 215.9
const pageHeightMm = 279.4
const marginMm = 18
const contentWidthMm = pageWidthMm - marginMm * 2
const rightColumnXMm = marginMm + contentWidthMm * 0.55

const mutedGray: readonly [number, number, number] = [113, 113, 122]
const ruleGray: readonly [number, number, number] = [228, 228, 231]

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

function additionCategoryLabel(
  labels: MaterialsListPdfLabels,
  category: ProductAdditionCategory
): string {
  const map: Record<ProductAdditionCategory, string> = {
    herrajes: labels.additionCategoryHerrajes,
    mano_obra: labels.additionCategoryManoDeObra,
    varios: labels.additionCategoryVarios
  }

  return map[category]
}

function drawEyebrow(doc: jsPDF, text: string, x: number, y: number, align: 'left' | 'right'): void {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...mutedGray)
  doc.text(text.toUpperCase(), x, y, { align })
  doc.setTextColor(0, 0, 0)
}

function drawRowRule(doc: jsPDF, y: number): void {
  doc.setDrawColor(...ruleGray)
  doc.line(marginMm, y, marginMm + contentWidthMm, y)
  doc.setDrawColor(0, 0, 0)
}

/**
 * Builds a PDF listing meters (and cost, when priced) used per material for
 * the current combination and production units, plus any additions
 * (hardware/labor/misc.) grouped by category and an optional cost/sale/
 * profit summary (used by the Ficha técnica variant).
 *
 * @param input - Materials list content.
 * @returns The generated PDF as a Blob.
 */
export async function buildMaterialsListPdf(input: MaterialsListPdfInput): Promise<Blob> {
  const { additions = [], combinationName, labels, productName, rows, summary } = input
  const doc = new jsPDF({ format: 'letter', orientation: 'portrait', unit: 'mm' })
  const logo = await rasterizeLogo()
  let cursorY = marginMm

  function ensureSpace(neededMm: number): void {
    if (cursorY + neededMm > pageHeightMm - marginMm) {
      doc.addPage()
      cursorY = marginMm
    }
  }

  let logoBottomY = cursorY

  if (logo) {
    const logoHeightMm = 12
    const logoWidthMm = logoHeightMm * (logo.width / logo.height)

    doc.addImage(logo.dataUrl, 'PNG', marginMm, cursorY, logoWidthMm, logoHeightMm)
    logoBottomY = cursorY + logoHeightMm
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(labels.title.toUpperCase(), marginMm + contentWidthMm, cursorY + 7, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...mutedGray)
  doc.text(formatTimestamp(new Date()), marginMm + contentWidthMm, cursorY + 13, { align: 'right' })
  doc.setTextColor(0, 0, 0)

  cursorY = Math.max(logoBottomY, cursorY + 15) + 6
  doc.setDrawColor(0, 0, 0)
  doc.line(marginMm, cursorY, marginMm + contentWidthMm, cursorY)
  cursorY += 10

  drawEyebrow(doc, labels.referenceLabel, marginMm, cursorY, 'left')
  drawEyebrow(doc, labels.combinationLabel, rightColumnXMm, cursorY, 'left')
  cursorY += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(productName, marginMm, cursorY)
  doc.text(combinationName ?? labels.noCombination, rightColumnXMm, cursorY)
  cursorY += 14

  const materialColumnX = marginMm
  const metersColumnX = rightColumnXMm
  const costColumnX = marginMm + contentWidthMm - 0.001

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text(labels.materialColumnLabel, materialColumnX, cursorY)
  doc.text(labels.metersColumnLabel, metersColumnX, cursorY)
  doc.text(labels.costColumnLabel, costColumnX, cursorY, { align: 'right' })
  cursorY += 3
  doc.line(marginMm, cursorY, marginMm + contentWidthMm, cursorY)
  cursorY += 7
  doc.setFont('helvetica', 'normal')

  rows.forEach(row => {
    ensureSpace(9)
    doc.text(row.materialName, materialColumnX, cursorY)
    doc.text(formatMeters(row.lengthMeters), metersColumnX, cursorY)
    doc.text(formatCop(row.costCop), costColumnX, cursorY, { align: 'right' })
    cursorY += 3
    drawRowRule(doc, cursorY)
    cursorY += 6
  })

  const nameColumnX = marginMm
  const quantityColumnX = rightColumnXMm
  const additionCostColumnX = marginMm + contentWidthMm - 0.001

  ADDITION_CATEGORIES.forEach(category => {
    const items = additions.filter(addition => addition.category === category)

    if (items.length === 0) {
      return
    }

    ensureSpace(18)
    cursorY += 6
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(additionCategoryLabel(labels, category), marginMm, cursorY)
    cursorY += 3
    doc.line(marginMm, cursorY, marginMm + contentWidthMm, cursorY)
    cursorY += 7

    doc.setFontSize(10)
    items.forEach(item => {
      ensureSpace(9)
      doc.text(item.name, nameColumnX, cursorY)
      doc.text(formatQuantity(item.quantity), quantityColumnX, cursorY)
      doc.text(formatCop(item.costCop), additionCostColumnX, cursorY, { align: 'right' })
      cursorY += 3
      drawRowRule(doc, cursorY)
      cursorY += 6
    })
  })

  if (summary) {
    ensureSpace(38)
    cursorY += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(summary.costLabel, marginMm, cursorY)
    doc.text(formatCop(summary.costCop), marginMm + contentWidthMm, cursorY, { align: 'right' })
    cursorY += 8

    doc.text(summary.saleLabel, marginMm, cursorY)
    doc.text(formatCop(summary.saleCop), marginMm + contentWidthMm, cursorY, { align: 'right' })
    cursorY += 6
    drawRowRule(doc, cursorY)
    cursorY += 8

    const barHeightMm = 13

    doc.setFillColor(0, 0, 0)
    doc.rect(marginMm, cursorY, contentWidthMm, barHeightMm, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(summary.profitLabel.toUpperCase(), marginMm + 6, cursorY + barHeightMm / 2 + 1.5)
    doc.text(
      summary.profitCop === null ? '—' : formatCop(summary.profitCop),
      marginMm + contentWidthMm - 6,
      cursorY + barHeightMm / 2 + 1.5,
      { align: 'right' }
    )
    doc.setTextColor(0, 0, 0)
  }

  return doc.output('blob')
}
