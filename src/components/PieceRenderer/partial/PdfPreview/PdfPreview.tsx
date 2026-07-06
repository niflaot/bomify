'use client'

import type { ReactElement } from 'react'
import { memo, useEffect, useRef, useState } from 'react'

import type { PdfCanvasRenderJob } from '../../piece-renderer.pdf'
import { startPdfCanvasRender } from '../../piece-renderer.pdf'

type PdfPreviewProps = {
  readonly ariaLabel: string
  readonly buffer: ArrayBuffer
  readonly fallbackError: string
}

type PdfRenderError = {
  readonly buffer: ArrayBuffer
  readonly message: string
}

function PdfPreviewComponent(props: PdfPreviewProps): ReactElement {
  const { ariaLabel, buffer, fallbackError } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastRenderPromiseRef = useRef<Promise<void>>(Promise.resolve())
  const renderJobRef = useRef<PdfCanvasRenderJob | null>(null)
  const [error, setError] = useState<PdfRenderError | null>(null)
  const message = error?.buffer === buffer ? error.message : null

  useEffect(() => {
    let disposed = false
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    setError(null)
    const renderPromise = lastRenderPromiseRef.current.then(() => {
      if (disposed) {
        return
      }

      const renderJob = startPdfCanvasRender(canvas, buffer)

      renderJobRef.current = renderJob

      return renderJob.promise.catch(renderError => {
        if (disposed || renderJobRef.current !== renderJob) {
          return
        }

        setError({
          buffer,
          message: renderError instanceof Error ? renderError.message : fallbackError
        })
      })
    })

    lastRenderPromiseRef.current = renderPromise.then(() => undefined, () => undefined)

    return () => {
      disposed = true
      renderJobRef.current?.cancel()

      renderJobRef.current = null
    }
  }, [buffer, fallbackError])

  if (message) {
    return <span>{message}</span>
  }

  return (
    <canvas
      aria-label={ariaLabel}
      ref={canvasRef}
      style={{
        display: 'block',
        height: 'auto',
        maxHeight: '100%',
        maxWidth: '100%',
        width: '100%'
      }}
    />
  )
}

/**
 * Renders a PDF page into a canvas without browser viewer chrome.
 *
 * @param props - PDF preview properties.
 * @returns Canvas preview element.
 */
export const PdfPreview = memo(PdfPreviewComponent)

PdfPreview.displayName = 'PdfPreview'
