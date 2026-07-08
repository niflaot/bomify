'use client'

import { Download } from 'lucide-react'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
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
import { toExportableSheets } from '@/core/utils/sheet-export/sheet-export.mappers'
import type { ExportableSheet, SheetExportFormat, SheetExportScope } from '@/core/utils/sheet-export/sheet-export.types'

import { useProductWorkspace } from '../../context/product-workspace.context'
import { buildDespieceSheets } from '@/layout/workspace/WorkspaceCanvas/utils/despiece-view.utils'
import { buildProductionCutSummaries } from '@/layout/workspace/WorkspaceCanvas/utils/production-cut.utils'
import type { DownloadDialogProps } from './types/download-dialog.types'
import { useSheetExport } from './hooks/use-sheet-export.hook'

/**
 * Renders the workspace download dialog: choose PDF/DXF and how to bundle
 * the export — one file, one per material (production only), or one per
 * sheet/pliego. Any non-combined scope always downloads as a zip.
 *
 * @param props - Download dialog props.
 * @returns Download dialog element.
 */
export function DownloadDialog(props: DownloadDialogProps): ReactElement {
  const { combinations, labels, pieces, product } = props
  const { activeCombinationId, activeView, productionUnits } = useProductWorkspace()
  const { isExporting, runExport } = useSheetExport()
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<SheetExportFormat>('dxf')
  const [scope, setScope] = useState<SheetExportScope>('combined')

  const activeCombination = combinations.find(combination =>
    combination.id === activeCombinationId
  ) ?? null

  const productionSummaries = useMemo(
    () => activeView === 'productionCut'
      ? buildProductionCutSummaries(pieces, activeCombination, productionUnits, labels)
      : [],
    [activeCombination, activeView, labels, pieces, productionUnits]
  )
  const despieceSheets = useMemo(
    () => activeView === 'despiece' ? buildDespieceSheets(pieces, activeCombination, labels) : [],
    [activeCombination, activeView, labels, pieces]
  )

  const sheets = useMemo<readonly ExportableSheet[]>(() => {
    if (activeView === 'productionCut') {
      return productionSummaries.flatMap(summary =>
        toExportableSheets(summary.sheets, { key: summary.materialId, label: summary.materialName })
      )
    }

    return toExportableSheets(despieceSheets)
  }, [activeView, despieceSheets, productionSummaries])

  const canDownload = sheets.length > 0 && !isExporting
  const effectiveScope: SheetExportScope = scope === 'perGroup' && activeView !== 'productionCut'
    ? 'combined'
    : scope

  async function handleDownload(): Promise<void> {
    const fileNameParts = activeView === 'productionCut'
      ? [product.name]
      : [product.name, labels.despieceView]
    const didDownload = await runExport({
      errorMessage: labels.formErrorToast,
      fileNameParts,
      format,
      scope: effectiveScope,
      sheets
    })

    if (didDownload) {
      setOpen(false)
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" type="button">
          <Download aria-hidden="true" data-icon="inline-start" />
          <span className="hidden sm:inline">{labels.export}</span>
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={labels.closeDialog}>
        <DialogHeader>
          <DialogTitle>{labels.downloadDialogTitle}</DialogTitle>
          <DialogDescription>{labels.downloadDialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
              {labels.downloadFormatLabel}
            </span>
            <Select
              onValueChange={value => { setFormat(value as SheetExportFormat) }}
              value={format}
            >
              <SelectTrigger className="h-10 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dxf">{labels.downloadFormatDxf}</SelectItem>
                <SelectItem value="pdf">{labels.downloadFormatPdf}</SelectItem>
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-1">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
              {labels.downloadScopeLabel}
            </span>
            <Select
              onValueChange={value => { setScope(value as SheetExportScope) }}
              value={effectiveScope}
            >
              <SelectTrigger className="h-10 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="combined">{labels.downloadScopeCombined}</SelectItem>
                {activeView === 'productionCut' ? (
                  <SelectItem value="perGroup">{labels.downloadScopePerMaterial}</SelectItem>
                ) : null}
                <SelectItem value="perSheet">
                  {activeView === 'productionCut' ? labels.downloadScopePerSheet : labels.downloadScopePerPliego}
                </SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {labels.cancel}
            </Button>
          </DialogClose>
          <Button
            disabled={!canDownload}
            onClick={() => { void handleDownload() }}
            type="button"
          >
            {isExporting ? labels.downloading : labels.export}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
