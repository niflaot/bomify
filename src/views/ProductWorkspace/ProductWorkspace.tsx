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
  ProductWorkspaceLabels
} from './product-workspace.types'

type ProductWorkspaceProps = {
  readonly combinationActions: ProductWorkspaceCombinationActions
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly product: ProductWorkspaceItem
}

/**
 * Renders the product workspace shell.
 *
 * @param props - Product workspace props.
 * @returns Product workspace element.
 */
export function ProductWorkspace(props: ProductWorkspaceProps): ReactElement {
  const { combinationActions, combinations, labels, product } = props

  return (
    <ProductWorkspaceProvider>
      <main className="grid h-dvh grid-rows-[auto_1fr] overflow-hidden bg-background text-foreground">
        <WorkspaceHeader labels={labels} product={product} />
        <div className="grid min-h-0 grid-cols-[auto_1fr]">
          <WorkspaceSidebar
            combinationActions={combinationActions}
            combinations={combinations}
            labels={labels}
            product={product}
          />
          <WorkspaceCanvas labels={labels} />
        </div>
      </main>
    </ProductWorkspaceProvider>
  )
}
