'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createProduct, softDeleteProduct } from '@/core/services/product/product.service'
import type { ProductFormState, ProductPhotoInput } from '@/core/types/product.types'

function readRequiredText(formData: FormData, key: string): string {
  const value = formData.get(key)

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${key} is required`)
  }

  return value
}

function readOptionalText(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)

  return typeof value === 'string' && value.trim() ? value : undefined
}

async function readProductPhoto(formData: FormData): Promise<ProductPhotoInput | undefined> {
  const value = formData.get('photo')

  if (!(value instanceof File) || value.size === 0) {
    return undefined
  }

  return {
    body: new Uint8Array(await value.arrayBuffer()),
    contentType: value.type || 'application/octet-stream',
    fileName: value.name
  }
}

/**
 * Creates a product from the new product form.
 *
 * @param _state - Previous form state.
 * @param formData - Product form payload.
 * @returns Form state when creation fails.
 */
export async function createProductAction(
  _state: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    await createProduct({
      description: readOptionalText(formData, 'description'),
      name: readRequiredText(formData, 'name'),
      photo: await readProductPhoto(formData)
    })
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'Could not create product'
    }
  }

  revalidatePath('/')
  redirect('/')
}

/**
 * Soft-deletes a product from the products overview.
 *
 * @param formData - Form payload containing the product id.
 */
export async function deleteProductAction(formData: FormData): Promise<void> {
  const productId = formData.get('productId')

  if (typeof productId !== 'string' || !productId) {
    throw new Error('Product id is required')
  }

  await softDeleteProduct(productId)
  revalidatePath('/')
}
