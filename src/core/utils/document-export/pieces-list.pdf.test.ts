import type { DxfGeometry } from '@/core/utils/dxf/dxf.types'

import { buildPiecesListPdf } from './pieces-list.pdf'
import type { PieceMaterialRow } from './pieces-list.types'

const labels = { quantityLabel: 'Qty', title: 'Pieces list' }

const rows: PieceMaterialRow[] = [
  {
    materialColor: '#111111',
    materialLabel: 'Canvas',
    materialLabelName: 'Canvas',
    pieceDxfUrl: '/front.dxf',
    pieceHeightMm: 100,
    pieceId: 'front',
    pieceLabel: '1. Front',
    pieceWidthMm: 300,
    quantity: 2
  },
  {
    materialColor: '#0033ff',
    materialLabel: 'Lining',
    materialLabelName: 'Lining',
    pieceDxfUrl: '/front.dxf',
    pieceHeightMm: 100,
    pieceId: 'front',
    pieceLabel: '1. Front',
    pieceWidthMm: 300,
    quantity: 1
  }
]

const geometry: DxfGeometry = {
  bounds: { height: 100, maxX: 300, maxY: 100, minX: 0, minY: 0, width: 300 },
  entities: [{ center: { x: 150, y: 50 }, radius: 20, type: 'circle' }]
}

describe('buildPiecesListPdf', () => {
  it('builds a non-empty PDF grouped by material, without thumbnails', () => {
    const blob = buildPiecesListPdf({
      geometryByUrl: new Map(),
      groupBy: 'material',
      labels,
      rows,
      showThumbnails: false
    })

    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/pdf')
    expect(blob.size).toBeGreaterThan(0)
  })

  it('builds a non-empty PDF grouped by piece, with thumbnails', () => {
    const blob = buildPiecesListPdf({
      geometryByUrl: new Map([['/front.dxf', geometry]]),
      groupBy: 'piece',
      labels,
      rows,
      showThumbnails: true
    })

    expect(blob.size).toBeGreaterThan(0)
  })

  it('does not throw when a thumbnail piece has no matching geometry', () => {
    expect(() => buildPiecesListPdf({
      geometryByUrl: new Map(),
      groupBy: 'material',
      labels,
      rows,
      showThumbnails: true
    })).not.toThrow()
  })

  it('does not throw for an empty row list', () => {
    expect(() => buildPiecesListPdf({
      geometryByUrl: new Map(),
      groupBy: 'material',
      labels,
      rows: [],
      showThumbnails: false
    })).not.toThrow()
  })
})
