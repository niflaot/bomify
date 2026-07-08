'use server'

import { revalidatePath } from 'next/cache'

import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import { createMaterial, updateMaterial } from '@/core/services/material/material.service'
import {
  attachProductMaterial,
  detachProductMaterial
} from '@/core/services/product-material/product-material.service'
import type { MaterialFormState } from '@/core/types/material.types'
import {
  createErrorState,
  createSuccessState,
  getErrorMessage,
  isUniqueConstraintError
} from '@/core/utils/form/form-state.utils'

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

function readOptionalPriceCop(formData: FormData): number | null {
  const raw = formData.get('priceCop')

  if (typeof raw !== 'string' || !raw.trim()) {
    return null
  }

  const price = Number(raw)

  if (!Number.isFinite(price)) {
    throw new Error('priceCop must be a valid number')
  }

  return price
}

function readOptionalLabelName(formData: FormData): string | null {
  const raw = formData.get('labelName')

  if (typeof raw !== 'string' || !raw.trim()) {
    return null
  }

  return raw
}

function toFormState(error: unknown): MaterialFormState {
  if (isUniqueConstraintError(error, ['product_id', 'material_id'])) {
    return createErrorState('This material is already attached to this product', {
      materialId: 'This material is already attached to this product'
    })
  }

  const message = getErrorMessage(error, 'Could not save material')

  return createErrorState(message, getMaterialFieldErrors(message))
}

function getMaterialFieldErrors(message: string): Record<string, string> | undefined {
  if (/name/i.test(message)) {
    return { name: message }
  }

  if (/width/i.test(message)) {
    return { widthCm: message }
  }

  if (/color|hex/i.test(message)) {
    return { hexColor: message }
  }

  if (/materialId|material/i.test(message)) {
    return { materialId: message }
  }

  if (/price/i.test(message)) {
    return { priceCop: message }
  }

  return undefined
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
          labelName: readOptionalLabelName(formData),
          name: readRequiredText(formData, 'name'),
          priceCop: readOptionalPriceCop(formData),
          widthCm: readWidthCm(formData)
        })
      : { id: readRequiredText(formData, 'materialId') }

    await attachProductMaterial({
      materialId: material.id,
      productId
    })
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toFormState(error)
  }
}

/**
 * Updates a global material's catalog data (name, color, width, icon,
 * price). This affects every product that uses this material, not just
 * the one the edit was opened from.
 *
 * @param _state - Previous form state.
 * @param formData - Material edit form payload.
 * @returns Form state describing the mutation result.
 */
export async function updateMaterialAction(
  _state: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')
    const materialId = readRequiredText(formData, 'materialId')

    await updateMaterial(materialId, {
      hexColor: readRequiredText(formData, 'hexColor'),
      iconKey: readIconKey(formData),
      labelName: readOptionalLabelName(formData),
      name: readRequiredText(formData, 'name'),
      priceCop: readOptionalPriceCop(formData),
      widthCm: readWidthCm(formData)
    })
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
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

    return createSuccessState()
  } catch (error) {
    return toFormState(error)
  }
}
