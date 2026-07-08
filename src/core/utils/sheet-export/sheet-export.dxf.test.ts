import type { DxfGeometry } from '@/core/utils/dxf/dxf.types'

import type { ExportableSheet } from './sheet-export.types'
import { buildSheetsDxf } from './sheet-export.dxf'

const pieceGeometry: DxfGeometry = {
  bounds: { height: 40, maxX: 100, maxY: 40, minX: 0, minY: 0, width: 100 },
  entities: [{ center: { x: 50, y: 20 }, radius: 5, type: 'circle' }]
}

function buildSheet(id: string, name: string): ExportableSheet {
  return {
    heightMm: 700,
    id,
    name,
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

describe('buildSheetsDxf', () => {
  it('names each sheet layer and includes its boundary + piece geometry', () => {
    const document = buildSheetsDxf(
      [buildSheet('sheet-1', 'Hoja 1')],
      new Map([['/piece.dxf', pieceGeometry]])
    )

    expect(document).toContain('8\nHOJA_1\n')
    expect(document).toContain('0\nCIRCLE')
    expect(document).toContain('0\nLINE')
  })

  it('stacks a second sheet below the first with a margin gap', () => {
    const document = buildSheetsDxf(
      [buildSheet('sheet-1', 'Hoja 1'), buildSheet('sheet-2', 'Hoja 2')],
      new Map([['/piece.dxf', pieceGeometry]])
    )

    expect(document).toContain('HOJA_1')
    expect(document).toContain('HOJA_2')
    // second sheet's boundary starts at heightMm(700) + margin(10) = 710
    expect(document).toContain('20\n710\n')
  })

  it('skips pieces whose geometry was not fetched', () => {
    const document = buildSheetsDxf([buildSheet('sheet-1', 'Hoja 1')], new Map())

    expect(document).not.toContain('CIRCLE')
    expect(document).toContain('LINE')
  })

  it('falls back to a numbered layer name when the sheet name has no valid characters', () => {
    const document = buildSheetsDxf(
      [buildSheet('sheet-1', '###')],
      new Map([['/piece.dxf', pieceGeometry]])
    )

    expect(document).toContain('HOJA_1')
  })
})
