'use client'

import { Download } from 'lucide-react'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { downloadBlob } from '@/core/utils/download.utils'
import { groupPieceMaterialRows } from '@/core/utils/document-export/pieces-list.grouping'
import { buildLabelsPdf } from '@/core/utils/document-export/labels.pdf'
import type { LabelSticker } from '@/core/utils/document-export/labels.pdf'
import { buildExportFileName } from '@/core/utils/sheet-export/sheet-export.filename'

import { useProductWorkspace } from '@/views/ProductWorkspace/context/product-workspace.context'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { buildPieceMaterialRows } from '../Pieces/pieces-list-rows.utils'

type StickersPanelProps = {
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
  readonly productName: string
}

const defaultGapMm = 3

function toStickers(
  pieces: readonly ProductWorkspacePiece[],
  activeCombination: ProductWorkspaceCombination | null
): readonly LabelSticker[] {
  const rows = buildPieceMaterialRows(pieces, activeCombination)

  return groupPieceMaterialRows(rows, 'piece').map(group => ({
    items: group.items.map(item => ({
      materialColor: item.materialColor,
      materialLabel: item.materialLabelName,
      quantity: item.quantity
    })),
    pieceLabel: group.groupLabel
  }))
}

/**
 * Renders the "download labels" button, letting the user adjust the gap
 * between labels while previewing the actual generated PDF before
 * downloading it.
 *
 * @param props - Stickers panel props.
 * @returns Stickers panel element.
 */
export function StickersPanel(props: StickersPanelProps): ReactElement {
  const { combinations, labels, pieces, productName } = props
  const { activeCombinationId } = useProductWorkspace()
  const [open, setOpen] = useState(false)
  const [gapMm, setGapMm] = useState(defaultGapMm)
  const [blob, setBlob] = useState<Blob | null>(null)
  const activeCombination = combinations.find(combination =>
    combination.id === activeCombinationId
  ) ?? null

  const stickers = useMemo(
    () => toStickers(pieces, activeCombination),
    [activeCombination, pieces]
  )

  function rebuildPdf(nextGapMm: number): void {
    setBlob(buildLabelsPdf({ gapMm: nextGapMm, productName, stickers }))
  }

  function handleOpenChange(nextOpen: boolean): void {
    setOpen(nextOpen)

    if (nextOpen) {
      rebuildPdf(gapMm)
    }
  }

  function handleGapChange(value: number): void {
    setGapMm(value)
    rebuildPdf(value)
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={stickers.length === 0} type="button">
          <Download aria-hidden="true" data-icon="inline-start" />
          {labels.stickersDownload}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl" closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.stickersDialogTitle}</DialogTitle>
          <DialogDescription>{labels.stickersDialogDescription}</DialogDescription>
        </DialogHeader>

        <label className="grid max-w-56 gap-1">
          <Label>{labels.stickersGapLabel}</Label>
          <Input
            max={20}
            min={0}
            onChange={event => {
              handleGapChange(Number(event.target.value))
            }}
            step={0.5}
            type="number"
            value={gapMm}
          />
        </label>

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
                  downloadBlob(blob, buildExportFileName([productName, 'etiquetas'], 'pdf'))
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
