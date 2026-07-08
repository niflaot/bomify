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

import type { ProductionCutSummary } from '@/layout/workspace/WorkspaceCanvas/types/production-cut.types'
import type {
  ProductWorkspaceItem,
  ProductWorkspaceLabels
} from '@/views/ProductWorkspace/types/product-workspace.types'

type MaterialsListDialogProps = {
  readonly combinationName: string | null
  readonly labels: ProductWorkspaceLabels
  readonly product: ProductWorkspaceItem
  readonly summaries: readonly ProductionCutSummary[]
}

/**
 * Renders the "download materials list" button, building a one-page PDF
 * (reference, combination, timestamp, logo, meters/cost per material) and
 * previewing it before download.
 *
 * @param props - Materials list dialog props.
 * @returns Materials list dialog element.
 */
export function MaterialsListDialog(props: MaterialsListDialogProps): ReactElement {
  const { combinationName, labels, product, summaries } = props
  const [open, setOpen] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)

  async function handleOpenChange(nextOpen: boolean): Promise<void> {
    setOpen(nextOpen)

    if (!nextOpen) {
      return
    }

    setBlob(null)
    setBlob(await buildMaterialsListPdf({
      combinationName,
      labels: {
        combinationLabel: labels.combinationLabel,
        costColumnLabel: labels.consumptionCost,
        materialColumnLabel: labels.materialSelectLabel,
        metersColumnLabel: labels.consumptionLength,
        noCombination: labels.noCombination,
        referenceLabel: labels.product,
        title: labels.materialsListDialogTitle
      },
      productName: product.name,
      rows: summaries.map(summary => ({
        costCop: summary.materialPriceCop === null
          ? null
          : Math.round(summary.materialPriceCop * summary.lengthMeters),
        lengthMeters: summary.lengthMeters,
        materialName: summary.materialName
      }))
    }))
  }

  return (
    <Dialog onOpenChange={value => { void handleOpenChange(value) }} open={open}>
      <DialogTrigger asChild>
        <Button className="w-full" type="button">
          <Download aria-hidden="true" data-icon="inline-start" />
          {labels.downloadMaterialsList}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl" closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.materialsListDialogTitle}</DialogTitle>
          <DialogDescription>{labels.materialsListDialogDescription}</DialogDescription>
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
                  downloadBlob(blob, buildExportFileName([product.name, 'materiales'], 'pdf'))
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
