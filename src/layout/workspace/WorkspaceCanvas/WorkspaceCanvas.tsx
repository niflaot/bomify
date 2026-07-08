import type { ReactElement } from 'react'

import { useProductWorkspace } from '@/views/ProductWorkspace/context/product-workspace.context'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { DespieceView } from './DespieceView'
import { ProductionCutView } from './ProductionCutView'

type WorkspaceCanvasProps = {
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
}

/**
 * Renders the empty workspace canvas placeholder.
 *
 * @param props - Workspace canvas props.
 * @returns Workspace canvas element.
 */
export function WorkspaceCanvas(props: WorkspaceCanvasProps): ReactElement {
  const { combinations, labels, pieces } = props
  const { activeView } = useProductWorkspace()

  return (
    <section
      aria-label={labels.canvasLabel}
      className="min-h-0 overflow-hidden bg-muted/60"
    >
      {activeView === 'despiece' ? (
        <DespieceView
          combinations={combinations}
          labels={labels}
          pieces={pieces}
        />
      ) : null}
      {activeView === 'productionCut' ? (
        <ProductionCutView
          combinations={combinations}
          labels={labels}
          pieces={pieces}
        />
      ) : null}
    </section>
  )
}
