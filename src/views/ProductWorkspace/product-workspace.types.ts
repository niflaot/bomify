import type { ProductCombinationFormState } from '@/core/types/product-combination.types'

/**
 * Product data rendered by the workspace shell.
 */
export type ProductWorkspaceItem = {
  readonly id: string
  readonly name: string
  readonly description: string | null
  readonly photoUrl: string | null
  readonly updatedAt: string
}

/**
 * Product combination data rendered in the workspace.
 */
export type ProductWorkspaceCombination = {
  readonly hexColor: string
  readonly id: string
  readonly name: string
  readonly updatedAt: string
}

/**
 * Server action shape used by combination forms.
 */
export type ProductCombinationFormAction = (
  state: ProductCombinationFormState,
  formData: FormData
) => Promise<ProductCombinationFormState>

/**
 * Server actions used by the combinations panel.
 */
export type ProductWorkspaceCombinationActions = {
  readonly create: ProductCombinationFormAction
  readonly delete: ProductCombinationFormAction
  readonly update: ProductCombinationFormAction
}

/**
 * Workspace panel keys available from the left rail.
 */
export type ProductWorkspacePanel =
  | 'product'
  | 'pieces'
  | 'materials'
  | 'combinations'
  | 'uploads'
  | 'stickers'

/**
 * Text labels used by the product workspace.
 */
export type ProductWorkspaceLabels = {
  readonly home: string
  readonly workspace: string
  readonly save: string
  readonly export: string
  readonly calculate: string
  readonly sidebarTitle: string
  readonly addCombination: string
  readonly cancel: string
  readonly closeDialog: string
  readonly combinationColorLabel: string
  readonly combinationCreateTitle: string
  readonly combinationDeleteDescription: string
  readonly combinationDeleteTitle: string
  readonly combinationEmptyDescription: string
  readonly combinationEmptyTitle: string
  readonly combinationNameLabel: string
  readonly combinationNamePlaceholder: string
  readonly createCombination: string
  readonly deleteCombination: string
  readonly deleting: string
  readonly editCombination: string
  readonly product: string
  readonly productPanelDescription: string
  readonly pieces: string
  readonly piecesPanelDescription: string
  readonly materials: string
  readonly materialsPanelDescription: string
  readonly combinations: string
  readonly combinationsPanelDescription: string
  readonly uploads: string
  readonly uploadsPanelDescription: string
  readonly stickers: string
  readonly stickersPanelDescription: string
  readonly saveCombination: string
  readonly saving: string
  readonly canvasLabel: string
  readonly canvasEmptyTitle: string
  readonly canvasEmptyDescription: string
  readonly updated: string
}
