import type { ReactElement } from 'react'

import type { ProductWorkspaceLabels } from '../../product-workspace.types'

type WorkspaceCanvasProps = {
  readonly labels: ProductWorkspaceLabels
}

/**
 * Renders the empty workspace canvas placeholder.
 *
 * @param props - Workspace canvas props.
 * @returns Workspace canvas element.
 */
export function WorkspaceCanvas(props: WorkspaceCanvasProps): ReactElement {
  const { labels } = props

  return (
    <section
      aria-label={labels.canvasLabel}
      className="min-h-0 overflow-auto bg-muted/60 p-4 sm:p-6"
    >
      <div className="grid min-h-full place-items-center">
        <div className="grid h-[min(72vh,760px)] w-[min(100%,1040px)] place-items-center border bg-background shadow-sm">
          <div className="max-w-md px-8 text-center">
            <h2 className="text-lg font-semibold uppercase tracking-widest">
              {labels.canvasEmptyTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {labels.canvasEmptyDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
