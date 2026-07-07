import type { ProductFormState } from '@/core/types/product.types'

/**
 * Text labels used by the product creation view.
 */
export type ProductCreateLabels = {
  readonly eyebrow: string
  readonly title: string
  readonly subtitle: string
  readonly nameLabel: string
  readonly namePlaceholder: string
  readonly descriptionLabel: string
  readonly descriptionPlaceholder: string
  readonly formErrorToast: string
  readonly photoLabel: string
  readonly photoHelp: string
  readonly submit: string
  readonly submitting: string
  readonly cancel: string
}

/**
 * Server action used by the product creation form.
 */
export type CreateProductFormAction = (
  state: ProductFormState,
  formData: FormData
) => Promise<ProductFormState>
