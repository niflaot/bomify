import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { labels } from '@/views/ProductWorkspace/testing/product-workspace.test-fixtures'
import { ProductWorkspaceProvider } from '@/views/ProductWorkspace/context/product-workspace.context'
import type {
  ProductWorkspacePiece,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'
import * as downloadUtils from '@/core/utils/download.utils'
import * as labelsPdf from '@/core/utils/document-export/labels.pdf'
import * as pdfDocumentPreviewUtils from '@/components/PdfDocumentPreview/pdf-document-preview.utils'

import { StickersPanel } from './StickersPanel'

jest.mock('@/core/utils/download.utils')
jest.mock('@/components/PdfDocumentPreview/pdf-document-preview.utils')
jest.mock('@/core/utils/document-export/labels.pdf', () => ({
  ...jest.requireActual('@/core/utils/document-export/labels.pdf'),
  buildLabelsPdf: jest.fn()
}))

const downloadBlobMock = downloadUtils.downloadBlob as jest.Mock
const buildLabelsPdfMock = labelsPdf.buildLabelsPdf as jest.Mock
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

describe('StickersPanel', () => {
  beforeEach(() => {
    downloadBlobMock.mockReset()
    buildLabelsPdfMock.mockReset().mockReturnValue(new Blob(['pdf'], { type: 'application/pdf' }))
    renderPdfPagesToImagesMock.mockReset().mockResolvedValue([])
  })

  it('disables the download trigger when there are no pieces', () => {
    render(
      <ProductWorkspaceProvider>
        <StickersPanel combinations={[]} labels={labels} pieces={[]} productName="Kairos Backpack" />
      </ProductWorkspaceProvider>
    )

    expect(screen.getByRole('button', { name: labels.stickersDownload })).toBeDisabled()
  })

  it('builds the labels PDF on open and downloads it', async () => {
    const user = userEvent.setup()

    render(
      <ProductWorkspaceProvider>
        <StickersPanel combinations={[]} labels={labels} pieces={pieces} productName="Kairos Backpack" />
      </ProductWorkspaceProvider>
    )

    await user.click(screen.getByRole('button', { name: labels.stickersDownload }))

    expect(buildLabelsPdfMock).toHaveBeenCalledWith(
      expect.objectContaining({ gapMm: 3, productName: 'Kairos Backpack' })
    )

    await user.click(await screen.findByRole('button', { name: labels.pdfDownloadButton }))

    expect(downloadBlobMock).toHaveBeenCalledTimes(1)
  })

  it('rebuilds the PDF when the gap input changes', async () => {
    const user = userEvent.setup()

    render(
      <ProductWorkspaceProvider>
        <StickersPanel combinations={[]} labels={labels} pieces={pieces} productName="Kairos Backpack" />
      </ProductWorkspaceProvider>
    )

    await user.click(screen.getByRole('button', { name: labels.stickersDownload }))
    await screen.findByRole('button', { name: labels.pdfDownloadButton })

    const gapInput = screen.getByLabelText(labels.stickersGapLabel)

    await user.clear(gapInput)
    await user.type(gapInput, '10')

    expect(buildLabelsPdfMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ gapMm: 10 })
    )
  })
})
