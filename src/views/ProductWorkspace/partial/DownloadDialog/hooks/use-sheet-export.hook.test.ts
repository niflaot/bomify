import { act, renderHook } from '@testing-library/react'
import { toast } from 'sonner'

import * as downloadUtils from '@/core/utils/download.utils'
import type { ExportableSheet } from '@/core/utils/sheet-export/sheet-export.types'

import { useSheetExport } from './use-sheet-export.hook'

jest.mock('@/core/utils/download.utils')

const downloadBlobMock = downloadUtils.downloadBlob as jest.Mock
const downloadFilesAsZipMock = downloadUtils.downloadFilesAsZip as jest.Mock

const dxfContent = [
  '0', 'SECTION', '2', 'ENTITIES',
  '0', 'LINE', '8', '0', '10', '0', '20', '0', '30', '0', '11', '10', '21', '10', '31', '0',
  '0', 'ENDSEC', '0', 'EOF', ''
].join('\n')

function buildSheet(id: string, group?: { key: string; label: string }): ExportableSheet {
  return {
    groupKey: group?.key,
    groupLabel: group?.label,
    heightMm: 700,
    id,
    name: id,
    pieces: [{
      dxfUrl: '/piece.dxf',
      instanceId: `${id}-1`,
      rotated: false,
      sourceHeightMm: 10,
      sourceWidthMm: 10,
      xMm: 0,
      yMm: 0
    }],
    widthMm: 1000
  }
}

describe('useSheetExport', () => {
  beforeEach(() => {
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    jest.spyOn(toast, 'error').mockImplementation(() => '')
    downloadBlobMock.mockReset()
    downloadFilesAsZipMock.mockReset().mockResolvedValue(undefined)
    global.fetch = jest.fn(async () => ({
      ok: true,
      text: async () => dxfContent
    })) as unknown as typeof fetch
  })

  it('fetches each unique piece DXF only once across all sheets', async () => {
    const { result } = renderHook(() => useSheetExport())

    await act(async () => {
      await result.current.runExport({
        errorMessage: 'error',
        fileNameParts: ['product', 'material'],
        format: 'dxf',
        scope: 'combined',
        sheets: [buildSheet('sheet-1'), buildSheet('sheet-2')]
      })
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(result.current.isExporting).toBe(false)
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('downloads a single combined file directly (no zip) for "combined" scope', async () => {
    const { result } = renderHook(() => useSheetExport())

    await act(async () => {
      await result.current.runExport({
        errorMessage: 'error',
        fileNameParts: ['product'],
        format: 'dxf',
        scope: 'combined',
        sheets: [buildSheet('sheet-1'), buildSheet('sheet-2')]
      })
    })

    expect(downloadBlobMock).toHaveBeenCalledTimes(1)
    expect(downloadFilesAsZipMock).not.toHaveBeenCalled()
  })

  it('always zips for "perSheet" scope, even a single sheet', async () => {
    const { result } = renderHook(() => useSheetExport())

    await act(async () => {
      await result.current.runExport({
        errorMessage: 'error',
        fileNameParts: ['product'],
        format: 'dxf',
        scope: 'perSheet',
        sheets: [buildSheet('sheet-1')]
      })
    })

    expect(downloadFilesAsZipMock).toHaveBeenCalledTimes(1)
    expect(downloadBlobMock).not.toHaveBeenCalled()
  })

  it('bundles sheets by groupKey for "perGroup" scope', async () => {
    const { result } = renderHook(() => useSheetExport())

    await act(async () => {
      await result.current.runExport({
        errorMessage: 'error',
        fileNameParts: ['product'],
        format: 'dxf',
        scope: 'perGroup',
        sheets: [
          buildSheet('a1', { key: 'material-a', label: 'Lona Azul' }),
          buildSheet('b1', { key: 'material-b', label: 'Lona Roja' }),
          buildSheet('a2', { key: 'material-a', label: 'Lona Azul' })
        ]
      })
    })

    expect(downloadFilesAsZipMock).toHaveBeenCalledTimes(1)
    const [files] = downloadFilesAsZipMock.mock.calls[0]
    expect(files).toHaveLength(2)
    expect(files.map((file: { name: string }) => file.name)).toEqual([
      'product-lona-azul.dxf',
      'product-lona-roja.dxf'
    ])
  })

  it('does nothing when there are no sheets to export', async () => {
    const { result } = renderHook(() => useSheetExport())

    await act(async () => {
      await result.current.runExport({
        errorMessage: 'error',
        fileNameParts: ['product'],
        format: 'pdf',
        scope: 'combined',
        sheets: []
      })
    })

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows an error toast and clears the loading state when a DXF fails to load', async () => {
    global.fetch = jest.fn(async () => ({ ok: false })) as unknown as typeof fetch

    const { result } = renderHook(() => useSheetExport())

    await act(async () => {
      await result.current.runExport({
        errorMessage: 'boom',
        fileNameParts: ['product'],
        format: 'dxf',
        scope: 'combined',
        sheets: [buildSheet('sheet-1')]
      })
    })

    expect(toast.error).toHaveBeenCalledWith('boom')
    expect(result.current.isExporting).toBe(false)
  })
})
