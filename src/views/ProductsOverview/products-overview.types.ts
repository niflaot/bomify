/**
 * Product data rendered by the products overview.
 */
export type ProductOverviewItem = {
  readonly id: string
  readonly name: string
  readonly description: string | null
  readonly photoUrl: string | null
  readonly updatedAt: string
}

/**
 * Text labels used by the products overview.
 */
export type ProductsOverviewLabels = {
  readonly title: string
  readonly subtitle: string
  readonly searchPlaceholder: string
  readonly newProduct: string
  readonly recent: string
  readonly productsCount: string
  readonly edited: string
  readonly editProduct: string
  readonly deleteProduct: string
  readonly deleteProductConfirmation: string
  readonly deleteProductError: string
  readonly deleteProductSuccess: string
  readonly noDescription: string
  readonly emptyTitle: string
  readonly emptyDescription: string
  readonly loadErrorTitle: string
  readonly loadErrorDescription: string
}

/**
 * Server action used to delete one product from a card form.
 */
export type DeleteProductAction = (formData: FormData) => void | Promise<void>
