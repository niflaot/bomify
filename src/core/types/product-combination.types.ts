import type { MutationFormState } from './form-state.types'
import type { ProductMaterialRecord } from './material.types'

/**
 * Product material assignment used by one combination role.
 */
export type ProductCombinationMaterialAssignmentInput = {
  readonly productMaterialId: string
  readonly roleId: string
}

/**
 * Input used to create a product combination.
 */
export type CreateProductCombinationInput = {
  readonly hexColor: string
  readonly materialAssignments?: readonly ProductCombinationMaterialAssignmentInput[]
  readonly name: string
  readonly productId: string
}

/**
 * Input used to update a product combination.
 */
export type UpdateProductCombinationInput = {
  readonly hexColor?: string
  readonly materialAssignments?: readonly ProductCombinationMaterialAssignmentInput[]
  readonly name?: string
}

/**
 * Product combination query options.
 */
export type ListProductCombinationsInput = {
  readonly includeDeleted?: boolean
  readonly productId: string
}

/**
 * Product combination record returned by services.
 */
export type ProductCombinationRecord = {
  readonly id: string
  readonly productId: string
  readonly name: string
  readonly hexColor: string
  readonly materialAssignments: readonly ProductCombinationMaterialAssignmentRecord[]
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null
}

/**
 * Material assigned to a combination role.
 */
export type ProductCombinationMaterialAssignmentRecord = {
  readonly id: string
  readonly productMaterial: ProductMaterialRecord
  readonly roleId: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

/**
 * Generic state returned by product combination mutation actions.
 */
export type ProductCombinationFormState = MutationFormState
