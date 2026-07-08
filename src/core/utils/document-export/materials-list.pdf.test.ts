import { buildMaterialsListPdf } from './materials-list.pdf'
import * as logoUtils from './logo.utils'

jest.mock('./logo.utils')

const rasterizeLogoMock = logoUtils.rasterizeLogo as jest.Mock

const labels = {
  additionCategoryHerrajes: 'Hardware',
  additionCategoryManoDeObra: 'Labor',
  additionCategoryVarios: 'Miscellaneous',
  additionQuantityColumnLabel: 'Quantity',
  additionsSectionTitle: 'Additions',
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

  it('builds a PDF with additions grouped by category, skipping empty categories', async () => {
    const blob = await buildMaterialsListPdf({
      additions: [
        { category: 'herrajes', costCop: 1000, name: 'Zipper', quantity: 1 },
        { category: 'varios', costCop: 1800, name: 'Thread', quantity: 1.5 }
      ],
      combinationName: 'Blue',
      labels,
      productName: 'Kairos Backpack',
      rows: []
    })

    expect(blob.size).toBeGreaterThan(0)
  })

  it('builds a PDF with a cost/sale/profit summary block', async () => {
    const blob = await buildMaterialsListPdf({
      combinationName: 'Blue',
      labels,
      productName: 'Kairos Backpack',
      rows: [{ costCop: 50000, lengthMeters: 3.5, materialName: 'Canvas' }],
      summary: {
        costCop: 50000,
        costLabel: 'Cost',
        profitCop: 100000,
        profitLabel: 'Profit',
        saleCop: 150000,
        saleLabel: 'Sale price'
      }
    })

    expect(blob.size).toBeGreaterThan(0)
  })

  it('renders a dash for sale/profit in the summary when there is no sale price', async () => {
    const blob = await buildMaterialsListPdf({
      combinationName: 'Blue',
      labels,
      productName: 'Kairos Backpack',
      rows: [],
      summary: {
        costCop: 50000,
        costLabel: 'Cost',
        profitCop: null,
        profitLabel: 'Profit',
        saleCop: null,
        saleLabel: 'Sale price'
      }
    })

    expect(blob.size).toBeGreaterThan(0)
  })
})
