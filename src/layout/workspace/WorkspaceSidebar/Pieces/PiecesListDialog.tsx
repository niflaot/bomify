'use client'

import { Download } from 'lucide-react'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { PdfDocumentPreview } from '@/components/PdfDocumentPreview/PdfDocumentPreview'
import { readSourceText } from '@/components/PieceRenderer/piece-renderer.source'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { downloadBlob } from '@/core/utils/download.utils'
import type { DxfGeometry } from '@/core/utils/dxf/dxf.types'
import { parseDxfGeometry } from '@/core/utils/dxf/dxf.utils'
import { buildPiecesListPdf } from '@/core/utils/document-export/pieces-list.pdf'
import type { PiecesListGroupBy } from '@/core/utils/document-export/pieces-list.types'
import { buildExportFileName } from '@/core/utils/sheet-export/sheet-export.filename'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { buildPieceMaterialRows } from './pieces-list-rows.utils'

type PiecesListDialogProps = {
  readonly activeCombination: ProductWorkspaceCombination | null
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
  readonly productName: string
}

async function loadGeometryByUrl(urls: readonly string[]): Promise<Map<string, DxfGeometry>> {
  const entries = await Promise.all(
    Array.from(new Set(urls)).map(async url => {
      const geometry = parseDxfGeometry(await readSourceText(url))

      return [url, geometry] as const
    })
  )

  return new Map(entries)
}

/**
 * Renders the "download pieces list" button, letting the user group the
 * list by material or by piece and optionally show a small rendered
 * outline of each piece, then preview and download the resulting PDF.
 *
 * @param props - Pieces list dialog props.
 * @returns Pieces list dialog element.
 */
export function PiecesListDialog(props: PiecesListDialogProps): ReactElement {
  const { activeCombination, labels, pieces, productName } = props
  const [open, setOpen] = useState(false)
  const [groupBy, setGroupBy] = useState<PiecesListGroupBy>('material')
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [blob, setBlob] = useState<Blob | null>(null)

  const rows = useMemo(
    () => buildPieceMaterialRows(pieces, activeCombination),
    [activeCombination, pieces]
  )

  async function rebuildPdf(nextGroupBy: PiecesListGroupBy, nextShowThumbnails: boolean): Promise<void> {
    setBlob(null)

    const geometryByUrl = nextShowThumbnails
      ? await loadGeometryByUrl(rows.flatMap(row => row.pieceDxfUrl ? [row.pieceDxfUrl] : []))
      : new Map<string, DxfGeometry>()

    setBlob(buildPiecesListPdf({
      geometryByUrl,
      groupBy: nextGroupBy,
      labels: {
        quantityLabel: labels.pieceQuantityLabel,
        title: labels.piecesListDialogTitle
      },
      rows,
      showThumbnails: nextShowThumbnails
    }))
  }

  async function handleOpenChange(nextOpen: boolean): Promise<void> {
    setOpen(nextOpen)

    if (nextOpen) {
      await rebuildPdf(groupBy, showThumbnails)
    }
  }

  async function handleGroupByChange(value: string): Promise<void> {
    const nextGroupBy = value as PiecesListGroupBy

    setGroupBy(nextGroupBy)
    await rebuildPdf(nextGroupBy, showThumbnails)
  }

  async function handleShowThumbnailsChange(nextShowThumbnails: boolean): Promise<void> {
    setShowThumbnails(nextShowThumbnails)
    await rebuildPdf(groupBy, nextShowThumbnails)
  }

  return (
    <Dialog onOpenChange={value => { void handleOpenChange(value) }} open={open}>
      <DialogTrigger asChild>
        <Button className="w-full" type="button">
          <Download aria-hidden="true" data-icon="inline-start" />
          {labels.downloadPiecesList}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl" closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.piecesListDialogTitle}</DialogTitle>
          <DialogDescription>{labels.piecesListDialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-end gap-4">
          <label className="grid gap-1">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
              {labels.piecesListGroupByLabel}
            </span>
            <Select
              onValueChange={value => { void handleGroupByChange(value) }}
              value={groupBy}
            >
              <SelectTrigger className="h-10 min-w-40 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="material">{labels.piecesListGroupByMaterial}</SelectItem>
                <SelectItem value="piece">{labels.piecesListGroupByPiece}</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <label className="flex items-center gap-2 pb-2">
            <Switch
              checked={showThumbnails}
              onCheckedChange={value => { void handleShowThumbnailsChange(value) }}
            />
            <span className="text-sm font-medium">{labels.piecesListShowThumbnails}</span>
          </label>
        </div>

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
                  downloadBlob(blob, buildExportFileName([productName, 'piezas'], 'pdf'))
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
