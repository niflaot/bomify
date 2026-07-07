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

  it('keeps pieces off the sheet edges when a margin is set and counts it as waste', () => {
    const result = packMaterialPieces(
      100,
      100,
      [{ id: 'piece', widthMm: 40, heightMm: 40 }],
      0,
      10
    )

    expect(result.placed).toEqual([
      expect.objectContaining({ xMm: 10, yMm: 10, widthMm: 40, heightMm: 40 })
    ])
    expect(result.stats.materialAreaMm2).toBe(10000)
    expect(result.stats.usedAreaMm2).toBe(1600)
    expect(result.stats.wasteAreaMm2).toBe(8400)
  })

  it('excludes a piece that only fits within the margin border', () => {
    const result = packMaterialPieces(
      100,
      100,
      [{ id: 'too-large-for-margin', widthMm: 85, heightMm: 85 }],
      0,
      10
    )

    expect(result.placed).toHaveLength(0)
    expect(result.unplaced).toEqual([
      expect.objectContaining({ id: 'too-large-for-margin' })
    ])
  })
})
