import { buildLabelsPdf } from './labels.pdf'
import type { LabelSticker } from './labels.pdf'

function buildSticker(pieceLabel: string): LabelSticker {
  return {
    items: [
      { materialColor: '#111111', materialLabel: 'Canvas', quantity: 2 },
      { materialColor: '#0033ff', materialLabel: 'Lining', quantity: 1 }
    ],
    pieceLabel
  }
}

describe('buildLabelsPdf', () => {
  it('builds a non-empty PDF for a handful of stickers', () => {
    const blob = buildLabelsPdf({
      gapMm: 3,
      productName: 'Kairos Backpack',
      stickers: [buildSticker('1. Front'), buildSticker('2. Back')]
    })

    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/pdf')
    expect(blob.size).toBeGreaterThan(0)
  })

  it('does not throw for an empty sticker list', () => {
    expect(() => buildLabelsPdf({
      gapMm: 3,
      productName: 'Kairos Backpack',
      stickers: []
    })).not.toThrow()
  })

  it('paginates when there are more stickers than fit one page', () => {
    const manyStickers = Array.from({ length: 12 }, (_, index) => buildSticker(`${index + 1}. Piece`))

    expect(() => buildLabelsPdf({
      gapMm: 3,
      productName: 'Kairos Backpack',
      stickers: manyStickers
    })).not.toThrow()
  })
})
