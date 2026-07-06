'use server'

import { revalidatePath } from 'next/cache'

import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import { createMaterial } from '@/core/services/material/material.service'
import {
  attachProductMaterial,
  detachProductMaterial
} from '@/core/services/product-material/product-material.service'
import type { MaterialFormState } from '@/core/types/material.types'

function readRequiredText(formData: FormData, key: string): string {
  const value = formData.get(key)

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${key} is required`)
  }

  return value
}

function readWidthCm(formData: FormData): number {
  const width = Number(readRequiredText(formData, 'widthCm'))

  if (!Number.isFinite(width)) {
    throw new Error('widthCm must be a valid number')
  }

  return width
}

function readIconKey(formData: FormData): MaterialIconKey {
  return readRequiredText(formData, 'iconKey')
}

function toFormState(error: unknown): MaterialFormState {
  return {
    message: error instanceof Error ? error.message : 'Could not save material',
    status: 'error'
  }
}

/**
 * Creates or selects a global material, then attaches it to a product.
 *
 * @param _state - Previous form state.
 * @param formData - Product material form payload.
 * @returns Form state describing the mutation result.
 */
export async function addProductMaterialAction(
  _state: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')
    const materialMode = readRequiredText(formData, 'materialMode')
    const material = materialMode === 'new'
      ? await createMaterial({
          hexColor: readRequiredText(formData, 'hexColor'),
          iconKey: readIconKey(formData),
          name: readRequiredText(formData, 'name'),
          widthCm: readWidthCm(formData)
        })
      : { id: readRequiredText(formData, 'materialId') }

    await attachProductMaterial({
      materialId: material.id,
      productId
    })
    revalidatePath(`/products/${productId}`)

    return { status: 'success' }
  } catch (error) {
    return toFormState(error)
  }
}

/**
 * Hard-deletes a product material link without deleting the global material.
 *
 * @param _state - Previous form state.
 * @param formData - Product material delete payload.
 * @returns Form state describing the mutation result.
 */
export async function deleteProductMaterialAction(
  _state: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await detachProductMaterial(productId, readRequiredText(formData, 'productMaterialId'))
    revalidatePath(`/products/${productId}`)

    return { status: 'success' }
  } catch (error) {
    return toFormState(error)
  }
}
