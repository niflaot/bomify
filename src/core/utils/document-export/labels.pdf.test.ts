import { buildLabelsPdf } from './labels.pdf'
import type { LabelSticker } from './labels.pdf'
import * as logoUtils from './logo.utils'

jest.mock('./logo.utils')

const rasterizeLogoMock = logoUtils.rasterizeLogo as jest.Mock

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
  beforeEach(() => {
    rasterizeLogoMock.mockResolvedValue(null)
  })

  it('builds a non-empty PDF for a handful of stickers', async () => {
    const blob = await buildLabelsPdf({
      gapMm: 3,
      productName: 'Kairos Backpack',
      stickers: [buildSticker('1. Front'), buildSticker('2. Back')]
    })

    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/pdf')
    expect(blob.size).toBeGreaterThan(0)
  })

  it('does not throw for an empty sticker list', async () => {
    await expect(buildLabelsPdf({
      gapMm: 3,
      productName: 'Kairos Backpack',
      stickers: []
    })).resolves.toBeInstanceOf(Blob)
  })

  it('paginates when there are more stickers than fit one page', async () => {
    const manyStickers = Array.from({ length: 12 }, (_, index) => buildSticker(`${index + 1}. Piece`))

    await expect(buildLabelsPdf({
      gapMm: 3,
      productName: 'Kairos Backpack',
      stickers: manyStickers
    })).resolves.toBeInstanceOf(Blob)
  })

  it('builds a PDF with a logo drawn on each sticker', async () => {
    const onePixelPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk'
      + '+A8AAQUBAScY42YAAAAASUVORK5CYII='

    rasterizeLogoMock.mockResolvedValue({
      dataUrl: `data:image/png;base64,${onePixelPngBase64}`,
      height: 100,
      width: 100
    })

    const blob = await buildLabelsPdf({
      gapMm: 3,
      productName: 'Kairos Backpack',
      stickers: [buildSticker('1. Front')]
    })

    expect(blob.size).toBeGreaterThan(0)
  })
})
