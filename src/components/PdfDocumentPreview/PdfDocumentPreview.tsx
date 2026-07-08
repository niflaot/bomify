'use client'

import type { ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'

import { renderPdfPagesToImages } from './pdf-document-preview.utils'
import type { PdfPreviewPage } from './pdf-document-preview.utils'

/**
 * Labels used by the PDF document preview.
 */
export type PdfDocumentPreviewLabels = {
  readonly error: string
  readonly loading: string
  readonly pagesLabel: string
}

type PdfDocumentPreviewProps = {
  readonly fileBlob: Blob
  readonly labels: PdfDocumentPreviewLabels
}

type PreviewState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'ready'; readonly pages: readonly PdfPreviewPage[] }

/**
 * Renders a scrollable, multi-page preview of an already-built PDF blob,
 * with a clickable page list that scrolls the main view to that page.
 *
 * @param props - PDF document preview props.
 * @returns PDF document preview element.
 */
export function PdfDocumentPreview(props: PdfDocumentPreviewProps): ReactElement {
  const { fileBlob, labels } = props
  const [renderedBlob, setRenderedBlob] = useState(fileBlob)
  const [state, setState] = useState<PreviewState>({ status: 'loading' })
  const pageRefs = useRef(new Map<number, HTMLDivElement>())

  if (renderedBlob !== fileBlob) {
    setRenderedBlob(fileBlob)
    setState({ status: 'loading' })
  }

  useEffect(() => {
    let cancelled = false

    renderPdfPagesToImages(fileBlob)
      .then(pages => {
        if (!cancelled) {
          setState({ pages, status: 'ready' })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: 'error' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [fileBlob])

  if (state.status === 'loading') {
    return (
      <div className="grid min-h-64 place-items-center border bg-muted/20 text-sm text-muted-foreground">
        {labels.loading}
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="grid min-h-64 place-items-center border bg-muted/20 text-sm text-destructive">
        {labels.error}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3">
      <div className="grid content-start gap-2">
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
          {labels.pagesLabel}
        </p>
        <ul className="grid max-h-96 gap-2 overflow-y-auto">
          {state.pages.map(page => (
            <li key={page.pageNumber}>
              <button
                className="block w-full cursor-pointer border p-1 transition-colors hover:border-foreground"
                onClick={() => {
                  pageRefs.current.get(page.pageNumber)?.scrollIntoView({ block: 'start' })
                }}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={`${labels.pagesLabel} ${page.pageNumber}`} className="w-full" src={page.dataUrl} />
                <span className="mt-1 block text-center text-xs text-muted-foreground">
                  {page.pageNumber}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid max-h-96 gap-4 overflow-y-auto border bg-muted/10 p-3">
        {state.pages.map(page => (
          <div
            key={page.pageNumber}
            ref={element => {
              if (element) {
                pageRefs.current.set(page.pageNumber, element)
              } else {
                pageRefs.current.delete(page.pageNumber)
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${labels.pagesLabel} ${page.pageNumber}`}
              className="w-full border bg-white shadow-sm"
              src={page.dataUrl}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
