import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { labels } from '@/views/ProductWorkspace/testing/product-workspace.test-fixtures'
import type { ProductWorkspaceItem } from '@/views/ProductWorkspace/types/product-workspace.types'
import * as materialsListPdf from '@/core/utils/document-export/materials-list.pdf'
import * as pdfDocumentPreviewUtils from '@/components/PdfDocumentPreview/pdf-document-preview.utils'

import { MaterialsListDialog } from './MaterialsListDialog'

jest.mock('@/core/utils/document-export/materials-list.pdf')
jest.mock('@/components/PdfDocumentPreview/pdf-document-preview.utils')

const buildMaterialsListPdfMock = materialsListPdf.buildMaterialsListPdf as jest.Mock
const renderPdfPagesToImagesMock = pdfDocumentPreviewUtils.renderPdfPagesToImages as jest.Mock

const product: ProductWorkspaceItem = {
  description: null,
  id: 'product-one',
  name: 'Kairos Backpack',
  photoUrl: null,
  updatedAt: '2026-07-06T12:00:00.000Z'
}

describe('MaterialsListDialog', () => {
  beforeEach(() => {
    buildMaterialsListPdfMock.mockResolvedValue(new Blob(['pdf'], { type: 'application/pdf' }))
    renderPdfPagesToImagesMock.mockResolvedValue([])
  })

  it('builds the materials list PDF on open and offers a download button', async () => {
    const user = userEvent.setup()

    render(
      <MaterialsListDialog
        additions={[]}
        combinationName="Blue"
        labels={labels}
        product={product}
        productionUnits={1}
        summaries={[]}
      />
    )

    await user.click(screen.getByRole('button', { name: labels.downloadMaterialsList }))

    expect(await screen.findByRole('button', { name: labels.pdfDownloadButton })).toBeInTheDocument()
    expect(buildMaterialsListPdfMock).toHaveBeenCalledWith(
      expect.objectContaining({ combinationName: 'Blue', productName: 'Kairos Backpack' })
    )
  })

  it('maps additions to materials-list addition rows with computed cost for one unit', async () => {
    const user = userEvent.setup()

    render(
      <MaterialsListDialog
        additions={[{
          category: 'herrajes',
          id: 'addition-one',
          name: 'Zipper',
          quantity: 1.5,
          unitPriceCop: 1200,
          updatedAt: '2026-07-06T12:00:00.000Z'
        }]}
        combinationName="Blue"
        labels={labels}
        product={product}
        productionUnits={1}
        summaries={[]}
      />
    )

    await user.click(screen.getByRole('button', { name: labels.downloadMaterialsList }))

    expect(buildMaterialsListPdfMock).toHaveBeenCalledWith(
      expect.objectContaining({
        additions: [{ category: 'herrajes', costCop: 1800, name: 'Zipper', quantity: 1.5 }]
      })
    )
  })

  it('multiplies addition quantity and cost by the production units', async () => {
    const user = userEvent.setup()

    render(
      <MaterialsListDialog
        additions={[{
          category: 'herrajes',
          id: 'addition-one',
          name: 'Zipper',
          quantity: 1,
          unitPriceCop: 1000,
          updatedAt: '2026-07-06T12:00:00.000Z'
        }]}
        combinationName="Blue"
        labels={labels}
        product={product}
        productionUnits={20}
        summaries={[]}
      />
    )

    await user.click(screen.getByRole('button', { name: labels.downloadMaterialsList }))

    expect(buildMaterialsListPdfMock).toHaveBeenCalledWith(
      expect.objectContaining({
        additions: [{ category: 'herrajes', costCop: 20000, name: 'Zipper', quantity: 20 }]
      })
    )
  })
})
