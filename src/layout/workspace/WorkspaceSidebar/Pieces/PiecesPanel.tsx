import { Plus } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece,
  ProductWorkspacePieceActions,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/product-workspace.types'
import { PieceCard } from './PieceCard'
import { PieceFormDialog } from './PieceFormDialog'

type PiecesPanelProps = {
  readonly actions: ProductWorkspacePieceActions
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
  readonly productId: string
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}

function EmptyPieces(props: { readonly labels: ProductWorkspaceLabels }): ReactElement {
  const { labels } = props

  return (
    <div className="border border-dashed bg-muted/30 p-4 text-sm">
      <p className="font-semibold">{labels.pieceEmptyTitle}</p>
      <p className="mt-2 leading-6 text-muted-foreground">{labels.pieceEmptyDescription}</p>
    </div>
  )
}

/**
 * Renders product pieces, DXF previews, and piece dialogs.
 *
 * @param props - Pieces panel props.
 * @returns Pieces panel body.
 */
export function PiecesPanel(props: PiecesPanelProps): ReactElement {
  const { actions, combinations, labels, pieces, productId, productMaterials } = props

  return (
    <div className="grid gap-4">
      <PieceFormDialog
        action={actions.create}
        combinations={combinations}
        labels={labels}
        productId={productId}
        productMaterials={productMaterials}
        trigger={
          <Button className="w-full justify-start" type="button" variant="outline">
            <Plus aria-hidden="true" data-icon="inline-start" />
            {labels.addPiece}
          </Button>
        }
        variant="create"
      />

      {pieces.length > 0 ? (
        <div className="grid gap-3">
          {pieces.map(piece => (
            <PieceCard
              actions={actions}
              combinations={combinations}
              key={piece.id}
              labels={labels}
              piece={piece}
              productId={productId}
              productMaterials={productMaterials}
            />
          ))}
        </div>
      ) : (
        <EmptyPieces labels={labels} />
      )}
    </div>
  )
}
