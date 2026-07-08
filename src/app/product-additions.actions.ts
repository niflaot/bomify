'use server'

import { revalidatePath } from 'next/cache'

import {
  createProductAddition,
  softDeleteProductAddition,
  updateProductAddition
} from '@/core/services/product-addition/product-addition.service'
import type {
  ProductAdditionCategory,
  ProductAdditionFormState
} from '@/core/types/product-addition.types'
import {
  createErrorState,
  createSuccessState,
  getErrorMessage
} from '@/core/utils/form/form-state.utils'

function readRequiredText(formData: FormData, key: string): string {
  const value = formData.get(key)

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${key} is required`)
  }

  return value
}

function readQuantity(formData: FormData): number {
  const quantity = Number(readRequiredText(formData, 'quantity'))

  if (!Number.isFinite(quantity)) {
    throw new Error('quantity must be a valid number')
  }

  return quantity
}

function readUnitPriceCop(formData: FormData): number {
  const unitPriceCop = Number(readRequiredText(formData, 'unitPriceCop'))

  if (!Number.isFinite(unitPriceCop)) {
    throw new Error('unitPriceCop must be a valid number')
  }

  return unitPriceCop
}

function toFormState(error: unknown): ProductAdditionFormState {
  const message = getErrorMessage(error, 'Could not save addition')

  return createErrorState(message, getAdditionFieldErrors(message))
}

function getAdditionFieldErrors(message: string): Record<string, string> | undefined {
  if (/name/i.test(message)) {
    return { name: message }
  }

  if (/categor/i.test(message)) {
    return { category: message }
  }

  if (/quantity/i.test(message)) {
    return { quantity: message }
  }

  if (/price/i.test(message)) {
    return { unitPriceCop: message }
  }

  return undefined
}

/**
 * Creates a product addition from a dialog form.
 *
 * @param _state - Previous form state.
 * @param formData - Addition form payload.
 * @returns Form state describing the mutation result.
 */
export async function createProductAdditionAction(
  _state: ProductAdditionFormState,
  formData: FormData
): Promise<ProductAdditionFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await createProductAddition({
      category: readRequiredText(formData, 'category') as ProductAdditionCategory,
      name: readRequiredText(formData, 'name'),
      productId,
      quantity: readQuantity(formData),
      unitPriceCop: readUnitPriceCop(formData)
    })
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toFormState(error)
  }
}

/**
 * Updates a product addition from a dialog form.
 *
 * @param _state - Previous form state.
 * @param formData - Addition form payload.
 * @returns Form state describing the mutation result.
 */
export async function updateProductAdditionAction(
  _state: ProductAdditionFormState,
  formData: FormData
): Promise<ProductAdditionFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await updateProductAddition(productId, readRequiredText(formData, 'additionId'), {
      category: readRequiredText(formData, 'category') as ProductAdditionCategory,
      name: readRequiredText(formData, 'name'),
      quantity: readQuantity(formData),
      unitPriceCop: readUnitPriceCop(formData)
    })
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toFormState(error)
  }
}

/**
 * Soft-deletes a product addition from a confirmation dialog.
 *
 * @param _state - Previous form state.
 * @param formData - Addition delete payload.
 * @returns Form state describing the mutation result.
 */
export async function deleteProductAdditionAction(
  _state: ProductAdditionFormState,
  formData: FormData
): Promise<ProductAdditionFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await softDeleteProductAddition(productId, readRequiredText(formData, 'additionId'))
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toFormState(error)
  }
}
