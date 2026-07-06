import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import type { MaterialFormState } from '@/core/types/material.types'
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
  readonly materialAssignments: readonly ProductWorkspaceCombinationMaterialAssignment[]
  readonly name: string
  readonly updatedAt: string
}

/**
 * Global material data rendered in the workspace.
 */
export type ProductWorkspaceMaterial = {
  readonly hexColor: string
  readonly iconKey: MaterialIconKey
  readonly id: string
  readonly name: string
  readonly updatedAt: string
  readonly widthCm: number
}

/**
 * Product material link rendered in the workspace.
 */
export type ProductWorkspaceProductMaterial = {
  readonly id: string
  readonly material: ProductWorkspaceMaterial
  readonly updatedAt: string
}

/**
 * Material assigned to one combination role.
 */
export type ProductWorkspaceCombinationMaterialAssignment = {
  readonly id: string
  readonly productMaterial: ProductWorkspaceProductMaterial
  readonly roleId: string
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
 * Server action shape used by material forms.
 */
export type MaterialFormAction = (
  state: MaterialFormState,
  formData: FormData
) => Promise<MaterialFormState>

/**
 * Server actions used by the materials panel.
 */
export type ProductWorkspaceMaterialActions = {
  readonly add: MaterialFormAction
  readonly delete: MaterialFormAction
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
  readonly addMaterial: string
  readonly addCombinationMaterial: string
  readonly createCatalogMaterial: string
  readonly deleteMaterial: string
  readonly materialCatalogEmptyDescription: string
  readonly materialCatalogSearchLabel: string
  readonly materialCatalogSearchPlaceholder: string
  readonly materialColorLabel: string
  readonly materialDeleteDescription: string
  readonly materialDeleteTitle: string
  readonly materialEmptyDescription: string
  readonly materialEmptyTitle: string
  readonly materialIconLabel: string
  readonly materialIconSearchLabel: string
  readonly materialIconSearchPlaceholder: string
  readonly materialNameLabel: string
  readonly materialNamePlaceholder: string
  readonly materialSelectLabel: string
  readonly materialWidthLabel: string
  readonly materialWidthPlaceholder: string
  readonly combinationMaterialAssignmentsLabel: string
  readonly combinationMaterialEmptyDescription: string
  readonly combinationMaterialMaterialLabel: string
  readonly combinationMaterialRoleLabel: string
  readonly combinationMaterialToggleLabel: string
  readonly removeCombinationMaterial: string
  readonly newCatalogMaterial: string
  readonly saveMaterial: string
  readonly selectExistingMaterial: string
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
