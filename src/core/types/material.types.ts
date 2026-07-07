import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import type { MutationFormState } from './form-state.types'

/**
 * Input used to create a global reusable material.
 */
export type CreateMaterialInput = {
  readonly hexColor: string
  readonly iconKey: MaterialIconKey
  readonly name: string
  readonly widthCm: number
}

/**
 * Input used to update a global reusable material.
 */
export type UpdateMaterialInput = {
  readonly hexColor?: string
  readonly iconKey?: MaterialIconKey
  readonly name?: string
  readonly widthCm?: number
}

/**
 * Material query options.
 */
export type ListMaterialsInput = {
  readonly includeDeleted?: boolean
  readonly search?: string
}

/**
 * Global material record returned by services.
 */
export type MaterialRecord = {
  readonly id: string
  readonly name: string
  readonly iconKey: MaterialIconKey
  readonly hexColor: string
  readonly widthCm: number
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null
}

/**
 * Input used to attach a material to a product.
 */
export type AttachProductMaterialInput = {
  readonly materialId: string
  readonly productId: string
}

/**
 * Product material relation rendered in the workspace.
 */
export type ProductMaterialRecord = {
  readonly id: string
  readonly createdAt: Date
  readonly material: MaterialRecord
  readonly productId: string
  readonly updatedAt: Date
}

/**
 * Generic state returned by material mutation actions.
 */
export type MaterialFormState = MutationFormState
