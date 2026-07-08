import { computeStickerLayout, paginateStickers } from './sticker-layout.utils'

describe('computeStickerLayout', () => {
  it('fits stickers into columns/rows for a Letter page', () => {
    const layout = computeStickerLayout({
      gapMm: 4,
      marginMm: 8,
      pageHeightMm: 279.4,
      pageWidthMm: 215.9,
      stickerHeightMm: 60,
      stickerWidthMm: 100
    })

    expect(layout.columns).toBe(1)
    expect(layout.rows).toBe(4)
    expect(layout.capacity).toBe(4)
  })

  it('fits more columns when the gap shrinks', () => {
    const layout = computeStickerLayout({
      gapMm: 0,
      marginMm: 5,
      pageHeightMm: 279.4,
      pageWidthMm: 215.9,
      stickerHeightMm: 60,
      stickerWidthMm: 100
    })

    expect(layout.columns).toBe(2)
  })

  it('never returns fewer than one column or row', () => {
    const layout = computeStickerLayout({
      gapMm: 10,
      marginMm: 10,
      pageHeightMm: 279.4,
      pageWidthMm: 215.9,
      stickerHeightMm: 500,
      stickerWidthMm: 500
    })

    expect(layout.columns).toBe(1)
    expect(layout.rows).toBe(1)
  })
})

describe('paginateStickers', () => {
  it('splits items into pages of the given capacity', () => {
    expect(paginateStickers([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('returns an empty array for no items', () => {
    expect(paginateStickers([], 4)).toEqual([])
  })
})
