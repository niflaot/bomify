import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { labels } from '@/views/ProductWorkspace/testing/product-workspace.test-fixtures'
import { ProductWorkspaceProvider } from '@/views/ProductWorkspace/context/product-workspace.context'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceItem
} from '@/views/ProductWorkspace/types/product-workspace.types'
import * as materialsListPdf from '@/core/utils/document-export/materials-list.pdf'
import * as pdfDocumentPreviewUtils from '@/components/PdfDocumentPreview/pdf-document-preview.utils'
import * as productionCutUtils from '@/layout/workspace/WorkspaceCanvas/utils/production-cut.utils'

import { TechSheetDialog } from './TechSheetDialog'

jest.mock('@/core/utils/document-export/materials-list.pdf')
jest.mock('@/components/PdfDocumentPreview/pdf-document-preview.utils')
jest.mock('@/layout/workspace/WorkspaceCanvas/utils/production-cut.utils')

const buildMaterialsListPdfMock = materialsListPdf.buildMaterialsListPdf as jest.Mock
const renderPdfPagesToImagesMock = pdfDocumentPreviewUtils.renderPdfPagesToImages as jest.Mock
const buildProductionCutSummariesMock = productionCutUtils.buildProductionCutSummaries as jest.Mock

const product: ProductWorkspaceItem = {
  description: null,
  id: 'product-one',
  name: 'Kairos Backpack',
  photoUrl: null,
  updatedAt: '2026-07-06T12:00:00.000Z'
}

const combination: ProductWorkspaceCombination = {
  hexColor: '#0033ff',
  id: 'combination-one',
  materialAssignments: [],
  name: 'Blue',
  salePriceCop: 150000,
  updatedAt: '2026-07-06T12:00:00.000Z'
}

describe('TechSheetDialog', () => {
  beforeEach(() => {
    buildMaterialsListPdfMock.mockReset()
      .mockResolvedValue(new Blob(['pdf'], { type: 'application/pdf' }))
    renderPdfPagesToImagesMock.mockReset().mockResolvedValue([])
    buildProductionCutSummariesMock.mockReset().mockReturnValue([{
      efficiency: 1,
      iconKey: 'SwatchBook',
      lengthMeters: 1,
      materialColor: '#111111',
      materialId: 'material-one',
      materialName: 'Canvas',
      materialPriceCop: 100000,
      sheets: [],
      usedAreaMm2: 500000,
      wasteAreaMm2: 500000,
      widthCm: 100
    }])
  })

  it('builds the tech sheet using exact (unrounded) material cost, plus additions, for one unit', async () => {
    const user = userEvent.setup()

    render(
      <ProductWorkspaceProvider defaultCombinationId={combination.id}>
        <TechSheetDialog
          additions={[{
            category: 'herrajes',
            id: 'addition-one',
            name: 'Zipper',
            quantity: 1,
            unitPriceCop: 1000,
            updatedAt: '2026-07-06T12:00:00.000Z'
          }]}
          combinations={[combination]}
          labels={labels}
          pieces={[]}
          product={product}
        />
      </ProductWorkspaceProvider>
    )

    await user.click(screen.getByRole('button', { name: labels.techSheetDownload }))

    expect(buildProductionCutSummariesMock).toHaveBeenCalledWith([], combination, 1, labels)
    expect(buildMaterialsListPdfMock).toHaveBeenCalledWith(
      expect.objectContaining({
        additions: [{ category: 'herrajes', costCop: 1000, name: 'Zipper', quantity: 1 }],
        combinationName: 'Blue',
        rows: [{ costCop: 50000, lengthMeters: 0.5, materialName: 'Canvas' }],
        summary: expect.objectContaining({ costCop: 51000, profitCop: 99000, saleCop: 150000 })
      })
    )
  })

  it('shows a null sale price and profit when the combination has none set', async () => {
    const user = userEvent.setup()
    const noSaleCombination = { ...combination, salePriceCop: null }

    render(
      <ProductWorkspaceProvider defaultCombinationId={noSaleCombination.id}>
        <TechSheetDialog
          additions={[]}
          combinations={[noSaleCombination]}
          labels={labels}
          pieces={[]}
          product={product}
        />
      </ProductWorkspaceProvider>
    )

    await user.click(screen.getByRole('button', { name: labels.techSheetDownload }))

    expect(buildMaterialsListPdfMock).toHaveBeenCalledWith(
      expect.objectContaining({
        summary: expect.objectContaining({ costCop: 50000, profitCop: null, saleCop: null })
      })
    )
  })
})
