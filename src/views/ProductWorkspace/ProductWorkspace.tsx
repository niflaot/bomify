'use client'

import type { ReactElement } from 'react'

import { WorkspaceCanvas } from './partial/WorkspaceCanvas/WorkspaceCanvas'
import { WorkspaceHeader } from './partial/WorkspaceHeader/WorkspaceHeader'
import { WorkspaceSidebar } from './partial/WorkspaceSidebar/WorkspaceSidebar'
import { ProductWorkspaceProvider } from './product-workspace.context'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceCombinationActions,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspaceMaterial,
  ProductWorkspaceMaterialActions,
  ProductWorkspacePiece,
  ProductWorkspacePieceActions,
  ProductWorkspaceProductMaterial
} from './product-workspace.types'

type ProductWorkspaceProps = {
  readonly catalogMaterials: readonly ProductWorkspaceMaterial[]
  readonly combinationActions: ProductWorkspaceCombinationActions
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly materialActions: ProductWorkspaceMaterialActions
  readonly pieceActions: ProductWorkspacePieceActions
  readonly pieces: readonly ProductWorkspacePiece[]
  readonly product: ProductWorkspaceItem
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}

/**
 * Renders the product workspace shell.
 *
 * @param props - Product workspace props.
 * @returns Product workspace element.
 */
export function ProductWorkspace(props: ProductWorkspaceProps): ReactElement {
  const {
    catalogMaterials,
    combinationActions,
    combinations,
    labels,
    materialActions,
    pieceActions,
    pieces,
    product,
    productMaterials
  } = props

  return (
    <ProductWorkspaceProvider>
      <main className="grid h-dvh grid-rows-[auto_1fr] overflow-hidden bg-background text-foreground">
        <WorkspaceHeader labels={labels} product={product} />
        <div className="grid min-h-0 grid-cols-[auto_1fr]">
          <WorkspaceSidebar
            catalogMaterials={catalogMaterials}
            combinationActions={combinationActions}
            combinations={combinations}
            labels={labels}
            materialActions={materialActions}
            pieceActions={pieceActions}
            pieces={pieces}
            product={product}
            productMaterials={productMaterials}
          />
          <WorkspaceCanvas labels={labels} />
        </div>
      </main>
    </ProductWorkspaceProvider>
  )
}
