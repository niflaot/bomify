import type { DxfGeometry } from '@/core/utils/dxf/dxf.types'

import type { ExportableSheet } from './sheet-export.types'
import { buildSheetsPdf } from './sheet-export.pdf'

const pieceGeometry: DxfGeometry = {
  bounds: { height: 40, maxX: 100, maxY: 40, minX: 0, minY: 0, width: 100 },
  entities: [
    { center: { x: 50, y: 20 }, radius: 5, type: 'circle' },
    { center: { x: 50, y: 20 }, endAngle: 90, radius: 5, startAngle: 0, type: 'arc' },
    { closed: true, points: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 5, y: 10 }], type: 'polyline' }
  ]
}

function buildSheet(id: string): ExportableSheet {
  return {
    heightMm: 700,
    id,
    name: id,
    pieces: [{
      dxfUrl: '/piece.dxf',
      instanceId: `${id}-1`,
      rotated: false,
      sourceHeightMm: 40,
      sourceWidthMm: 100,
      xMm: 10,
      yMm: 10
    }],
    widthMm: 1000
  }
}

describe('buildSheetsPdf', () => {
  it('builds a non-empty PDF blob for a single sheet', () => {
    const blob = buildSheetsPdf([buildSheet('sheet-1')], new Map([['/piece.dxf', pieceGeometry]]))

    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/pdf')
    expect(blob.size).toBeGreaterThan(0)
  })

  it('builds a multi-page PDF without throwing when combining several sheets', () => {
    const blob = buildSheetsPdf(
      [buildSheet('sheet-1'), buildSheet('sheet-2')],
      new Map([['/piece.dxf', pieceGeometry]])
    )

    expect(blob.size).toBeGreaterThan(0)
  })

  it('does not throw when a sheet has no matching geometry', () => {
    expect(() => buildSheetsPdf([buildSheet('sheet-1')], new Map())).not.toThrow()
  })

  it('does not throw for an empty sheet list', () => {
    expect(() => buildSheetsPdf([], new Map())).not.toThrow()
  })
})
