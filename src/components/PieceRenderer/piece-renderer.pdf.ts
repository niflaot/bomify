type PdfRenderTask = {
  readonly promise: Promise<void>
  cancel: () => void
}

/**
 * Cancelable PDF canvas rendering operation.
 */
export type PdfCanvasRenderJob = {
  readonly promise: Promise<void>
  cancel: () => void
}

/**
 * Starts rendering the first PDF page into a canvas without browser viewer chrome.
 *
 * @param canvas - Canvas target.
 * @param buffer - PDF binary data.
 * @returns Cancelable render job.
 */
export function startPdfCanvasRender(
  canvas: HTMLCanvasElement,
  buffer: ArrayBuffer
): PdfCanvasRenderJob {
  let cancelled = false
  let renderTask: PdfRenderTask | null = null

  const promise = renderPdfCanvas(canvas, buffer, () => cancelled, task => {
    renderTask = task
  }).catch(error => {
    if (cancelled || isPdfRenderCancellation(error)) {
      return
    }

    throw error
  })

  return {
    promise,
    cancel: () => {
      cancelled = true
      renderTask?.cancel()
    }
  }
}

async function renderPdfCanvas(
  canvas: HTMLCanvasElement,
  buffer: ArrayBuffer,
  isCancelled: () => boolean,
  registerRenderTask: (task: PdfRenderTask) => void
): Promise<void> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')

  if (isCancelled()) {
    return
  }

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.mjs',
    import.meta.url
  ).toString()

  const document = await pdfjs.getDocument({ data: buffer.slice(0) }).promise

  if (isCancelled()) {
    return
  }

  const page = await document.getPage(1)

  if (isCancelled()) {
    return
  }

  const scale = Math.max(window.devicePixelRatio || 1, 2)
  const viewport = page.getViewport({ scale })
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Could not prepare PDF canvas')
  }

  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  const task = page.render({
    canvas,
    canvasContext: context,
    viewport
  })

  registerRenderTask(task)
  await task.promise
}

function isPdfRenderCancellation(error: unknown): boolean {
  return error instanceof Error && error.name === 'RenderingCancelledException'
}
