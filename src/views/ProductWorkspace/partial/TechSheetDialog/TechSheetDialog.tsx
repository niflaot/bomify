'use client'

import { Download } from 'lucide-react'
import type { ReactElement } from 'react'
import { useState } from 'react'

import { PdfDocumentPreview } from '@/components/PdfDocumentPreview/PdfDocumentPreview'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { downloadBlob } from '@/core/utils/download.utils'
import { buildMaterialsListPdf } from '@/core/utils/document-export/materials-list.pdf'
import { buildExportFileName } from '@/core/utils/sheet-export/sheet-export.filename'

import { useProductWorkspace } from '@/views/ProductWorkspace/context/product-workspace.context'
import type { ProductionCutSummary } from '@/layout/workspace/WorkspaceCanvas/types/production-cut.types'
import { buildProductionCutSummaries } from '@/layout/workspace/WorkspaceCanvas/utils/production-cut.utils'
import type {
  ProductWorkspaceAddition,
  ProductWorkspaceCombination,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '@/views/ProductWorkspace/types/product-workspace.types'

type TechSheetDialogProps = {
  readonly additions: readonly ProductWorkspaceAddition[]
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
  readonly product: ProductWorkspaceItem
}

/**
 * Computes the exact (unrounded) linear meters used from a summary's
 * used area and material width, as opposed to `lengthMeters`, which is
 * rounded up to whole purchase sheets.
 *
 * @param summary - Production cut summary for one material.
 * @returns Exact linear meters used, for one unit of the product.
 */
function toExactLengthMeters(summary: ProductionCutSummary): number {
  return summary.usedAreaMm2 / (summary.widthCm * 10_000)
}

/**
 * Renders the "Ficha técnica" button: builds a materials-list-style PDF
 * using the exact (non-rounded) per-material consumption cost for one
 * unit of the active combination, plus additions and a cost/sale/profit
 * summary.
 *
 * @param props - Tech sheet dialog props.
 * @returns Tech sheet dialog element.
 */
export function TechSheetDialog(props: TechSheetDialogProps): ReactElement {
  const { additions, combinations, labels, pieces, product } = props
  const { activeCombinationId } = useProductWorkspace()
  const [open, setOpen] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)

  const activeCombination = combinations.find(combination =>
    combination.id === activeCombinationId
  ) ?? null

  async function handleOpenChange(nextOpen: boolean): Promise<void> {
    setOpen(nextOpen)

    if (!nextOpen) {
      return
    }

    setBlob(null)

    const summaries = buildProductionCutSummaries(pieces, activeCombination, 1, labels)
    const materialRows = summaries.map(summary => {
      const exactLengthMeters = toExactLengthMeters(summary)

      return {
        costCop: summary.materialPriceCop === null
          ? null
          : Math.round(exactLengthMeters * summary.materialPriceCop),
        lengthMeters: exactLengthMeters,
        materialName: summary.materialName
      }
    })
    const additionRows = additions.map(addition => ({
      category: addition.category,
      costCop: Math.round(addition.quantity * addition.unitPriceCop),
      name: addition.name,
      quantity: addition.quantity
    }))
    const materialsCostCop = materialRows.reduce(
      (total, row) => total + (row.costCop ?? 0),
      0
    )
    const additionsCostCop = additionRows.reduce((total, row) => total + row.costCop, 0)
    const costCop = materialsCostCop + additionsCostCop
    const saleCop = activeCombination?.salePriceCop ?? null
    const profitCop = saleCop === null ? null : saleCop - costCop

    setBlob(await buildMaterialsListPdf({
      additions: additionRows,
      combinationName: activeCombination?.name ?? null,
      labels: {
        additionCategoryHerrajes: labels.additionCategoryHerrajes,
        additionCategoryManoDeObra: labels.additionCategoryManoDeObra,
        additionCategoryVarios: labels.additionCategoryVarios,
        additionQuantityColumnLabel: labels.additionQuantityColumnLabel,
        additionsSectionTitle: labels.additionsSectionTitle,
        combinationLabel: labels.combinationLabel,
        costColumnLabel: labels.consumptionCost,
        materialColumnLabel: labels.materialSelectLabel,
        metersColumnLabel: labels.consumptionLength,
        noCombination: labels.noCombination,
        referenceLabel: labels.product,
        title: labels.techSheetDialogTitle
      },
      productName: product.name,
      rows: materialRows,
      summary: {
        costCop,
        costLabel: labels.techSheetCostLabel,
        profitCop,
        profitLabel: labels.techSheetProfitLabel,
        saleCop,
        saleLabel: labels.techSheetSaleLabel
      }
    }))
  }

  return (
    <Dialog onOpenChange={value => { void handleOpenChange(value) }} open={open}>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary">
          <Download aria-hidden="true" data-icon="inline-start" />
          {labels.techSheetDownload}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl" closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.techSheetDialogTitle}</DialogTitle>
          <DialogDescription>{labels.techSheetDialogDescription}</DialogDescription>
        </DialogHeader>
        {blob ? (
          <>
            <PdfDocumentPreview
              fileBlob={blob}
              labels={{
                error: labels.pdfPreviewError,
                loading: labels.pdfPreviewLoading,
                pagesLabel: labels.pdfPreviewPagesLabel
              }}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  downloadBlob(blob, buildExportFileName([product.name, 'ficha-tecnica'], 'pdf'))
                }}
                type="button"
              >
                <Download aria-hidden="true" data-icon="inline-start" />
                {labels.pdfDownloadButton}
              </Button>
            </div>
          </>
        ) : (
          <div className="grid min-h-64 place-items-center border bg-muted/20 text-sm text-muted-foreground">
            {labels.pdfPreviewLoading}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
