'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import { readSourceText } from '@/components/PieceRenderer/piece-renderer.source'
import { downloadBlob, downloadFilesAsZip } from '@/core/utils/download.utils'
import type { DxfGeometry } from '@/core/utils/dxf/dxf.types'
import { parseDxfGeometry } from '@/core/utils/dxf/dxf.utils'
import { buildSheetsDxf } from '@/core/utils/sheet-export/sheet-export.dxf'
import { buildExportFileName } from '@/core/utils/sheet-export/sheet-export.filename'
import { groupSheetsForExport } from '@/core/utils/sheet-export/sheet-export.grouping'
import { buildSheetsPdf } from '@/core/utils/sheet-export/sheet-export.pdf'
import type {
  ExportableSheet,
  SheetExportFormat,
  SheetExportScope
} from '@/core/utils/sheet-export/sheet-export.types'

/**
 * Options for one export run.
 */
export type RunSheetExportOptions = {
  readonly sheets: readonly ExportableSheet[]
  readonly format: SheetExportFormat
  readonly scope: SheetExportScope
  readonly fileNameParts: readonly string[]
  readonly errorMessage: string
}

/**
 * State and action exposed by `useSheetExport`.
 */
export type UseSheetExportResult = {
  readonly isExporting: boolean
  readonly runExport: (options: RunSheetExportOptions) => Promise<boolean>
}

async function loadGeometryByUrl(
  sheets: readonly ExportableSheet[]
): Promise<Map<string, DxfGeometry>> {
  const urls = new Set<string>()

  sheets.forEach(sheet => {
    sheet.pieces.forEach(piece => urls.add(piece.dxfUrl))
  })

  const entries = await Promise.all(
    Array.from(urls).map(async url => {
      const geometry = parseDxfGeometry(await readSourceText(url))

      return [url, geometry] as const
    })
  )

  return new Map(entries)
}

function buildFileBlob(
  group: readonly ExportableSheet[],
  format: SheetExportFormat,
  geometryByUrl: ReadonlyMap<string, DxfGeometry>
): Blob {
  if (format === 'pdf') {
    return buildSheetsPdf(group, geometryByUrl)
  }

  return new Blob([buildSheetsDxf(group, geometryByUrl)], { type: 'application/dxf' })
}

function buildGroupFileNameParts(
  group: readonly ExportableSheet[],
  scope: SheetExportScope
): readonly string[] {
  const [firstSheet] = group

  if (scope === 'combined' || !firstSheet) {
    return []
  }

  if (scope === 'perGroup') {
    return [firstSheet.groupLabel ?? firstSheet.name]
  }

  return firstSheet.groupLabel ? [firstSheet.groupLabel, firstSheet.name] : [firstSheet.name]
}

/**
 * Orchestrates a sheet export run: fetches every unique piece DXF once,
 * parses it, builds one PDF/DXF per output group, and triggers a single
 * download when combined into one file, or a zip whenever the user chose
 * "per group"/"per sheet" — even if that scope only produces one file.
 *
 * @returns Export progress state and the `runExport` action.
 */
export function useSheetExport(): UseSheetExportResult {
  const [isExporting, setIsExporting] = useState(false)

  async function runExport(options: RunSheetExportOptions): Promise<boolean> {
    const { errorMessage, fileNameParts, format, scope, sheets } = options

    if (sheets.length === 0) {
      return false
    }

    setIsExporting(true)

    try {
      const geometryByUrl = await loadGeometryByUrl(sheets)
      const groups = groupSheetsForExport(sheets, scope)
      const files = groups.map(group => ({
        content: buildFileBlob(group, format, geometryByUrl),
        name: buildExportFileName([...fileNameParts, ...buildGroupFileNameParts(group, scope)], format)
      }))

      if (scope === 'combined') {
        downloadBlob(files[0].content, files[0].name)
      } else {
        await downloadFilesAsZip(files, buildExportFileName(fileNameParts, 'zip'))
      }

      return true
    } catch {
      toast.error(errorMessage)

      return false
    } finally {
      setIsExporting(false)
    }
  }

  return { isExporting, runExport }
}
