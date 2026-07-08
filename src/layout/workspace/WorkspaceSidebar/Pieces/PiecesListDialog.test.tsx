import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { labels } from '@/views/ProductWorkspace/testing/product-workspace.test-fixtures'
import type { ProductWorkspacePiece, ProductWorkspaceProductMaterial } from '@/views/ProductWorkspace/types/product-workspace.types'
import * as piecesListPdf from '@/core/utils/document-export/pieces-list.pdf'
import * as pdfDocumentPreviewUtils from '@/components/PdfDocumentPreview/pdf-document-preview.utils'

import { PiecesListDialog } from './PiecesListDialog'

jest.mock('@/core/utils/document-export/pieces-list.pdf')
jest.mock('@/components/PdfDocumentPreview/pdf-document-preview.utils')

const buildPiecesListPdfMock = piecesListPdf.buildPiecesListPdf as jest.Mock
const renderPdfPagesToImagesMock = pdfDocumentPreviewUtils.renderPdfPagesToImages as jest.Mock

const globalMaterial: ProductWorkspaceProductMaterial = {
  id: 'global-material',
  material: {
    hexColor: '#111111',
    iconKey: 'SwatchBook',
    id: 'material-one',
    labelName: null,
    name: 'Canvas',
    priceCop: null,
    updatedAt: '2026-07-06T12:00:00.000Z',
    widthCm: 140
  },
  updatedAt: '2026-07-06T12:00:00.000Z'
}

const pieces: ProductWorkspacePiece[] = [{
  dxfFileName: 'front.dxf',
  dxfUrl: '/front.dxf',
  heightMm: 100,
  id: 'piece-one',
  materialRequirements: [{
    combinationMaterial: null,
    id: 'requirement-one',
    productMaterial: globalMaterial,
    quantity: 2
  }],
  name: 'Front',
  number: 1,
  updatedAt: '2026-07-06T12:00:00.000Z',
  widthMm: 300
}]

describe('PiecesListDialog', () => {
  beforeEach(() => {
    buildPiecesListPdfMock.mockReturnValue(new Blob(['pdf'], { type: 'application/pdf' }))
    renderPdfPagesToImagesMock.mockResolvedValue([])
  })

  it('builds the pieces list PDF grouped by material by default', async () => {
    const user = userEvent.setup()

    render(
      <PiecesListDialog
        activeCombination={null}
        labels={labels}
        pieces={pieces}
        productName="Kairos Backpack"
      />
    )

    await user.click(screen.getByRole('button', { name: labels.downloadPiecesList }))

    expect(await screen.findByRole('button', { name: labels.pdfDownloadButton })).toBeInTheDocument()
    expect(buildPiecesListPdfMock).toHaveBeenCalledWith(
      expect.objectContaining({ groupBy: 'material', showThumbnails: false })
    )
  })

  it('rebuilds the PDF when the thumbnails switch is toggled on', async () => {
    const user = userEvent.setup()

    global.fetch = jest.fn(async () => ({
      ok: true,
      text: async () => '0\nSECTION\n2\nENTITIES\n0\nENDSEC\n0\nEOF\n'
    })) as unknown as typeof fetch

    render(
      <PiecesListDialog
        activeCombination={null}
        labels={labels}
        pieces={pieces}
        productName="Kairos Backpack"
      />
    )

    await user.click(screen.getByRole('button', { name: labels.downloadPiecesList }))
    await screen.findByRole('button', { name: labels.pdfDownloadButton })
    await user.click(screen.getByRole('switch'))

    expect(await screen.findByRole('button', { name: labels.pdfDownloadButton })).toBeInTheDocument()
    expect(buildPiecesListPdfMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ showThumbnails: true })
    )
  })
})
