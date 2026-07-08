import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PdfDocumentPreview } from './PdfDocumentPreview'
import * as pdfDocumentPreviewUtils from './pdf-document-preview.utils'

jest.mock('./pdf-document-preview.utils')

const renderPdfPagesToImagesMock = pdfDocumentPreviewUtils.renderPdfPagesToImages as jest.Mock

const labels = {
  error: 'Could not render preview',
  loading: 'Loading...',
  pagesLabel: 'Pages'
}

describe('PdfDocumentPreview', () => {
  beforeEach(() => {
    renderPdfPagesToImagesMock.mockReset()
    HTMLElement.prototype.scrollIntoView = jest.fn()
  })

  it('shows a loading state, then the rendered pages', async () => {
    renderPdfPagesToImagesMock.mockResolvedValue([
      { dataUrl: 'data:image/png;base64,one', height: 100, pageNumber: 1, width: 80 },
      { dataUrl: 'data:image/png;base64,two', height: 100, pageNumber: 2, width: 80 }
    ])

    render(<PdfDocumentPreview fileBlob={new Blob(['pdf'])} labels={labels} />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getAllByAltText('Pages 1')).toHaveLength(2)
    })
    expect(screen.getAllByAltText('Pages 2')).toHaveLength(2)
  })

  it('shows an error state when rendering fails', async () => {
    renderPdfPagesToImagesMock.mockRejectedValue(new Error('boom'))

    render(<PdfDocumentPreview fileBlob={new Blob(['pdf'])} labels={labels} />)

    expect(await screen.findByText('Could not render preview')).toBeInTheDocument()
  })

  it('scrolls the main view to the clicked page', async () => {
    const user = userEvent.setup()

    renderPdfPagesToImagesMock.mockResolvedValue([
      { dataUrl: 'data:image/png;base64,one', height: 100, pageNumber: 1, width: 80 }
    ])

    render(<PdfDocumentPreview fileBlob={new Blob(['pdf'])} labels={labels} />)

    const pageButton = await screen.findByRole('button', { name: /1/ })

    await user.click(pageButton)

    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ block: 'start' })
  })
})
