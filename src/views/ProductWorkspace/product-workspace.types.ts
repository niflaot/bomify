import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import type { MaterialFormState } from '@/core/types/material.types'
import type { PieceFormState } from '@/core/types/piece.types'
import type { ProductCombinationFormState } from '@/core/types/product-combination.types'

export type { ProductWorkspaceLabels } from './product-workspace-labels.types'

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
 * Material quantity required by one piece.
 */
export type ProductWorkspacePieceMaterialRequirement = {
  readonly combinationMaterial: ProductWorkspaceCombinationMaterialAssignment | null
  readonly id: string
  readonly productMaterial: ProductWorkspaceProductMaterial | null
  readonly quantity: number
}

/**
 * Product piece data rendered in the workspace.
 */
export type ProductWorkspacePiece = {
  readonly dxfFileName: string
  readonly dxfUrl: string | null
  readonly heightMm: number
  readonly id: string
  readonly materialRequirements: readonly ProductWorkspacePieceMaterialRequirement[]
  readonly name: string
  readonly number: number
  readonly updatedAt: string
  readonly widthMm: number
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
 * Server action shape used by piece forms.
 */
export type PieceFormAction = (
  state: PieceFormState,
  formData: FormData
) => Promise<PieceFormState>

/**
 * Server actions used by the pieces panel.
 */
export type ProductWorkspacePieceActions = {
  readonly create: PieceFormAction
  readonly delete: PieceFormAction
  readonly update: PieceFormAction
}

/**
 * Workspace panel keys available from the left rail.
 */
export type ProductWorkspacePanel =
  | 'product'
  | 'pieces'
  | 'materials'
  | 'combinations'
  | 'consumption'
  | 'uploads'
  | 'stickers'

/**
 * Workspace canvas views available from the header selector.
 */
export type ProductWorkspaceView = 'despiece' | 'productionCut'
