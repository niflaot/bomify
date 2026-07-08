/**
 * One rasterized PDF page, ready to render as an `<img>`.
 */
export type PdfPreviewPage = {
  readonly pageNumber: number
  readonly dataUrl: string
  readonly width: number
  readonly height: number
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')

  canvas.width = Math.ceil(width)
  canvas.height = Math.ceil(height)

  return canvas
}

/**
 * Rasterizes every page of a PDF blob into data URLs for preview.
 *
 * Reuses the same `pdfjs-dist` dynamic-import + worker setup as
 * `piece-renderer.pdf.ts`, generalized to all pages instead of only the
 * first — that single-page helper is left untouched since it powers the
 * unrelated piece upload preview.
 *
 * @param fileBlob - PDF file contents.
 * @param scale - Rasterization scale (higher is sharper but slower).
 * @returns One rasterized page per PDF page, in order.
 */
export async function renderPdfPagesToImages(
  fileBlob: Blob,
  scale = 2
): Promise<readonly PdfPreviewPage[]> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.mjs',
    import.meta.url
  ).toString()

  const buffer = await fileBlob.arrayBuffer()
  const pdfDocument = await pdfjs.getDocument({ data: buffer.slice(0) }).promise
  const pages: PdfPreviewPage[] = []

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
    // Pages must render sequentially — pdfjs documents don't support
    // concurrent page renders against the same worker instance.
    const page = await pdfDocument.getPage(pageNumber)
    const viewport = page.getViewport({ scale })
    const canvas = createCanvas(viewport.width, viewport.height)
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Could not prepare PDF preview canvas')
    }

    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)

    await page.render({ canvas, canvasContext: context, viewport }).promise

    pages.push({
      dataUrl: canvas.toDataURL('image/png'),
      height: viewport.height,
      pageNumber,
      width: viewport.width
    })
  }

  return pages
}
