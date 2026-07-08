import type { MutationFormState } from './form-state.types'

/**
 * Predefined addition categories (hardware, labor, misc.).
 */
export type ProductAdditionCategory = 'herrajes' | 'mano_obra' | 'varios'

/**
 * Input used to create a product addition (hardware/labor/misc line item).
 */
export type CreateProductAdditionInput = {
  readonly category: ProductAdditionCategory
  readonly name: string
  readonly productId: string
  readonly quantity: number
  readonly unitPriceCop: number
}

/**
 * Input used to update a product addition.
 */
export type UpdateProductAdditionInput = {
  readonly category?: ProductAdditionCategory
  readonly name?: string
  readonly quantity?: number
  readonly unitPriceCop?: number
}

/**
 * Product addition query options.
 */
export type ListProductAdditionsInput = {
  readonly includeDeleted?: boolean
  readonly productId: string
}

/**
 * Product addition record returned by services.
 */
export type ProductAdditionRecord = {
  readonly category: ProductAdditionCategory
  readonly createdAt: Date
  readonly deletedAt: Date | null
  readonly id: string
  readonly name: string
  readonly productId: string
  readonly quantity: number
  readonly unitPriceCop: number
  readonly updatedAt: Date
}

/**
 * Generic state returned by product addition mutation actions.
 */
export type ProductAdditionFormState = MutationFormState
