'use client'

import type { ReactElement } from 'react'

import { WorkspaceHeader } from '@/layout/workspace/WorkspaceHeader/WorkspaceHeader'
import { WorkspaceSidebar } from '@/layout/workspace/WorkspaceSidebar/WorkspaceSidebar'

import { WorkspaceCanvas } from '@/layout/workspace/WorkspaceCanvas/WorkspaceCanvas'
import { ProductWorkspaceProvider } from './context/product-workspace.context'
import type {
  ProductWorkspaceAddition,
  ProductWorkspaceAdditionActions,
  ProductWorkspaceCombination,
  ProductWorkspaceCombinationActions,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspaceMaterial,
  ProductWorkspaceMaterialActions,
  ProductWorkspacePiece,
  ProductWorkspacePieceActions,
  ProductWorkspaceProductMaterial
} from './types/product-workspace.types'

type ProductWorkspaceProps = {
  readonly additionActions: ProductWorkspaceAdditionActions
  readonly additions: readonly ProductWorkspaceAddition[]
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
    additionActions,
    additions,
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
    <ProductWorkspaceProvider defaultCombinationId={combinations[0]?.id ?? null}>
      <main className="grid h-dvh grid-rows-[auto_1fr] overflow-hidden bg-background text-foreground">
        <WorkspaceHeader
          additions={additions}
          combinations={combinations}
          labels={labels}
          pieces={pieces}
          product={product}
        />
        <div className="grid min-h-0 grid-cols-[auto_1fr]">
          <WorkspaceSidebar
            additionActions={additionActions}
            additions={additions}
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
          <WorkspaceCanvas
            combinations={combinations}
            labels={labels}
            pieces={pieces}
          />
        </div>
      </main>
    </ProductWorkspaceProvider>
  )
}
