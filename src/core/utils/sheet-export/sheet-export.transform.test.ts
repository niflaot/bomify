import type { DxfGeometry } from '@/core/utils/dxf/dxf.types'

import type { ExportablePieceInstance } from './sheet-export.types'
import { transformPieceEntities } from './sheet-export.transform'

function buildPiece(overrides: Partial<ExportablePieceInstance> = {}): ExportablePieceInstance {
  return {
    dxfUrl: '/piece.dxf',
    instanceId: 'piece-1',
    rotated: false,
    sourceHeightMm: 40,
    sourceWidthMm: 100,
    xMm: 0,
    yMm: 0,
    ...overrides
  }
}

const geometry: DxfGeometry = {
  bounds: { height: 40, maxX: 100, maxY: 40, minX: 0, minY: 0, width: 100 },
  entities: [
    { end: { x: 100, y: 40 }, start: { x: 0, y: 0 }, type: 'line' },
    { center: { x: 50, y: 20 }, radius: 10, type: 'circle' },
    { center: { x: 50, y: 20 }, endAngle: 90, radius: 10, startAngle: 0, type: 'arc' }
  ]
}

describe('transformPieceEntities', () => {
  it('translates entities by the packed position when not rotated', () => {
    const [line] = transformPieceEntities(geometry, buildPiece({ xMm: 5, yMm: 3 }))

    expect(line).toEqual({ end: { x: 105, y: 43 }, start: { x: 5, y: 3 }, type: 'line' })
  })

  it('rotates a piece 90 degrees so it fits the swapped bounding box', () => {
    // sourceWidthMm/heightMm describe the piece pre-rotation (matching the
    // DXF's own 100x40 orientation) — rotation is derived from `rotated`,
    // not from swapped source dimensions.
    const [line, , arc] = transformPieceEntities(geometry, buildPiece({ rotated: true }))

    // (0,0) -> (y, sourceWidthMm - x) = (0, 100); (100,40) -> (40, 100-100) = (40, 0)
    expect(line).toEqual({ end: { x: 40, y: 0 }, start: { x: 0, y: 100 }, type: 'line' })
    expect(arc.type).toBe('arc')
    if (arc.type === 'arc') {
      expect(arc.startAngle).toBe(-90)
      expect(arc.endAngle).toBe(0)
    }
  })

  it('scales circles/arcs uniformly and keeps the radius circular', () => {
    const [, circle] = transformPieceEntities(
      geometry,
      buildPiece({ sourceHeightMm: 80, sourceWidthMm: 200 })
    )

    expect(circle.type).toBe('circle')
    if (circle.type === 'circle') {
      expect(circle.radius).toBe(20)
    }
  })

  it('centers geometry when the declared aspect ratio differs from the source bounds', () => {
    const [line] = transformPieceEntities(
      geometry,
      buildPiece({ sourceHeightMm: 100, sourceWidthMm: 100 })
    )

    // scale = min(100/100, 100/40) = 1, centered vertically: (100-40)/2 = 30
    expect(line).toEqual({ end: { x: 100, y: 70 }, start: { x: 0, y: 30 }, type: 'line' })
  })

  it('applies the extra stacking offset used to combine multiple sheets', () => {
    const [line] = transformPieceEntities(geometry, buildPiece(), 0, 150)

    expect(line).toEqual({ end: { x: 100, y: 190 }, start: { x: 0, y: 150 }, type: 'line' })
  })
})
