import { buildMaterialsListPdf } from './materials-list.pdf'
import * as logoUtils from './logo.utils'

jest.mock('./logo.utils')

const rasterizeLogoMock = logoUtils.rasterizeLogo as jest.Mock

const labels = {
  combinationLabel: 'Combination',
  costColumnLabel: 'Cost',
  materialColumnLabel: 'Material',
  metersColumnLabel: 'Meters',
  noCombination: 'No combination',
  referenceLabel: 'Reference',
  title: 'Materials list'
}

describe('buildMaterialsListPdf', () => {
  beforeEach(() => {
    rasterizeLogoMock.mockResolvedValue(null)
  })

  it('builds a non-empty PDF blob without a logo', async () => {
    const blob = await buildMaterialsListPdf({
      combinationName: 'Blue',
      labels,
      productName: 'Kairos Backpack',
      rows: [
        { costCop: 50000, lengthMeters: 3.5, materialName: 'Canvas' },
        { costCop: null, lengthMeters: 1.2, materialName: 'Lining' }
      ]
    })

    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/pdf')
    expect(blob.size).toBeGreaterThan(0)
  })

  it('builds a PDF blob with a logo and no rows', async () => {
    const onePixelPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk'
      + '+A8AAQUBAScY42YAAAAASUVORK5CYII='

    rasterizeLogoMock.mockResolvedValue({
      dataUrl: `data:image/png;base64,${onePixelPngBase64}`,
      height: 100,
      width: 100
    })

    const blob = await buildMaterialsListPdf({
      combinationName: null,
      labels,
      productName: 'Kairos Backpack',
      rows: []
    })

    expect(blob.size).toBeGreaterThan(0)
  })
})
