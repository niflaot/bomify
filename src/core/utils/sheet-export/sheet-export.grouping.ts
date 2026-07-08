import type { ExportableSheet, SheetExportScope } from './sheet-export.types'

function groupByKey(sheets: readonly ExportableSheet[]): readonly (readonly ExportableSheet[])[] {
  const order: string[] = []
  const groups = new Map<string, ExportableSheet[]>()

  sheets.forEach(sheet => {
    const key = sheet.groupKey ?? sheet.id
    const existing = groups.get(key)

    if (existing) {
      existing.push(sheet)
      return
    }

    order.push(key)
    groups.set(key, [sheet])
  })

  return order.map(key => groups.get(key) ?? [])
}

/**
 * Groups sheets into the files that will actually be produced: one group
 * with everything ("combined"), one group per higher-level group such as a
 * production material ("perGroup"), or one group per sheet ("perSheet").
 *
 * @param sheets - Sheets to export.
 * @param scope - How to bundle the sheets into files.
 * @returns One array of sheets per output file.
 */
export function groupSheetsForExport(
  sheets: readonly ExportableSheet[],
  scope: SheetExportScope
): readonly (readonly ExportableSheet[])[] {
  if (scope === 'combined') {
    return [sheets]
  }

  if (scope === 'perSheet') {
    return sheets.map(sheet => [sheet])
  }

  return groupByKey(sheets)
}
