/**
 * Input used to create a product combination.
 */
export type CreateProductCombinationInput = {
  readonly hexColor: string
  readonly name: string
  readonly productId: string
}

/**
 * Input used to update a product combination.
 */
export type UpdateProductCombinationInput = {
  readonly hexColor?: string
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
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null
}

/**
 * Generic state returned by product combination mutation actions.
 */
export type ProductCombinationFormState = {
  readonly message?: string
  readonly status?: 'error' | 'success'
}
