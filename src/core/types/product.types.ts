/**
 * Product photo upload payload before it is stored in object storage.
 */
export type ProductPhotoInput = {
  readonly body: Uint8Array
  readonly contentType: string
  readonly fileName: string
}

/**
 * Input used to create a product.
 */
export type CreateProductInput = {
  readonly name: string
  readonly description?: string
  readonly photo?: ProductPhotoInput
}

/**
 * Input used to update a product.
 */
export type UpdateProductInput = {
  readonly name?: string
  readonly description?: string
  readonly photo?: ProductPhotoInput
}

/**
 * Product query options.
 */
export type ListProductsInput = {
  readonly search?: string
  readonly includeDeleted?: boolean
}

/**
 * Product record returned by services.
 */
export type ProductRecord = {
  readonly id: string
  readonly name: string
  readonly description: string | null
  readonly photoBucket: string | null
  readonly photoObjectKey: string | null
  readonly photoUrl: string | null
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null
}

/**
 * Generic state returned by product mutation form actions.
 */
export type ProductFormState = {
  readonly message?: string
}
