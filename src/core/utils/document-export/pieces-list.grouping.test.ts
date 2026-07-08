import type { PieceMaterialRow } from './pieces-list.types'
import { groupPieceMaterialRows } from './pieces-list.grouping'

function buildRow(overrides: Partial<PieceMaterialRow> = {}): PieceMaterialRow {
  return {
    materialColor: '#111111',
    materialLabel: 'Canvas',
    materialLabelName: 'Canvas',
    pieceDxfUrl: '/piece.dxf',
    pieceHeightMm: 100,
    pieceId: 'piece-1',
    pieceLabel: '1. Front',
    pieceWidthMm: 300,
    quantity: 1,
    ...overrides
  }
}

describe('groupPieceMaterialRows', () => {
  it('groups by material, allowing a piece to repeat across materials', () => {
    const frontCanvas = buildRow({ materialLabel: 'Canvas', pieceId: 'front', pieceLabel: '1. Front' })
    const frontLining = buildRow({ materialLabel: 'Lining', pieceId: 'front', pieceLabel: '1. Front' })
    const backCanvas = buildRow({ materialLabel: 'Canvas', pieceId: 'back', pieceLabel: '2. Back' })

    const groups = groupPieceMaterialRows([frontCanvas, frontLining, backCanvas], 'material')

    expect(groups).toEqual([
      { groupLabel: 'Canvas', items: [frontCanvas, backCanvas] },
      { groupLabel: 'Lining', items: [frontLining] }
    ])
  })

  it('groups by piece, listing every material that piece needs', () => {
    const frontCanvas = buildRow({ materialLabel: 'Canvas', pieceId: 'front', pieceLabel: '1. Front' })
    const frontLining = buildRow({ materialLabel: 'Lining', pieceId: 'front', pieceLabel: '1. Front' })
    const backCanvas = buildRow({ materialLabel: 'Canvas', pieceId: 'back', pieceLabel: '2. Back' })

    const groups = groupPieceMaterialRows([frontCanvas, frontLining, backCanvas], 'piece')

    expect(groups).toEqual([
      { groupLabel: '1. Front', items: [frontCanvas, frontLining] },
      { groupLabel: '2. Back', items: [backCanvas] }
    ])
  })

  it('returns an empty array for no rows', () => {
    expect(groupPieceMaterialRows([], 'material')).toEqual([])
  })
})
