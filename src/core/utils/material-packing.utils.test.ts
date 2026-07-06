import { packMaterialPieces } from './material-packing.utils'

describe('packMaterialPieces', () => {
  it('places pieces without changing their dimensions', () => {
    const result = packMaterialPieces(100, 100, [
      { id: 'large', widthMm: 60, heightMm: 40 },
      { id: 'small', widthMm: 30, heightMm: 20, quantity: 2 }
    ])

    expect(result.placed).toHaveLength(3)
    expect(result.placed).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'large', widthMm: 60, heightMm: 40 }),
        expect.objectContaining({ id: 'small', widthMm: 30, heightMm: 20 })
      ])
    )
    expect(result.stats.usedAreaMm2).toBe(3600)
    expect(result.stats.wasteAreaMm2).toBe(6400)
  })

  it('reports pieces that do not fit the material', () => {
    const result = packMaterialPieces(50, 50, [
      { id: 'too-large', widthMm: 60, heightMm: 20 }
    ])

    expect(result.placed).toHaveLength(0)
    expect(result.unplaced).toEqual([
      expect.objectContaining({ id: 'too-large', widthMm: 60, heightMm: 20 })
    ])
  })
})
