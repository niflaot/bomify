'use server'

import { revalidatePath } from 'next/cache'

import {
  createProductCombination,
  softDeleteProductCombination,
  updateProductCombination
} from '@/core/services/product-combination/product-combination.service'
import type { ProductCombinationMaterialAssignmentInput } from '@/core/types/product-combination.types'
import type { ProductCombinationFormState } from '@/core/types/product-combination.types'
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

function toFormState(error: unknown): ProductCombinationFormState {
  if (isUniqueConstraintError(error, ['combination_id', 'role_id'])) {
    return createErrorState('Material role ids must be unique per combination', {
      materialRoleId: 'Material role ids must be unique per combination'
    })
  }

  const message = getErrorMessage(error, 'Could not save combination')

  return createErrorState(message, getCombinationFieldErrors(message))
}

function getCombinationFieldErrors(message: string): Record<string, string> | undefined {
  if (/name/i.test(message)) {
    return { name: message }
  }

  if (/color|hex/i.test(message)) {
    return { hexColor: message }
  }

  if (/role|assignment|material/i.test(message)) {
    return { materialRoleId: message }
  }

  return undefined
}

function readMaterialAssignments(
  formData: FormData
): readonly ProductCombinationMaterialAssignmentInput[] {
  const roleIds = formData.getAll('materialRoleId')
  const productMaterialIds = formData.getAll('materialRoleProductMaterialId')

  if (roleIds.length !== productMaterialIds.length) {
    throw new Error('Material assignments are incomplete')
  }

  return roleIds.map((roleId, index) => {
    const productMaterialId = productMaterialIds[index]

    if (typeof roleId !== 'string' || typeof productMaterialId !== 'string') {
      throw new Error('Material assignments are invalid')
    }

    return {
      productMaterialId: productMaterialId.trim(),
      roleId: roleId.trim()
    }
  })
}

/**
 * Creates a product combination from a dialog form.
 *
 * @param _state - Previous form state.
 * @param formData - Combination form payload.
 * @returns Form state describing the mutation result.
 */
export async function createProductCombinationAction(
  _state: ProductCombinationFormState,
  formData: FormData
): Promise<ProductCombinationFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await createProductCombination({
      hexColor: readRequiredText(formData, 'hexColor'),
      materialAssignments: readMaterialAssignments(formData),
      name: readRequiredText(formData, 'name'),
      productId
    })
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toFormState(error)
  }
}

/**
 * Updates a product combination from a dialog form.
 *
 * @param _state - Previous form state.
 * @param formData - Combination form payload.
 * @returns Form state describing the mutation result.
 */
export async function updateProductCombinationAction(
  _state: ProductCombinationFormState,
  formData: FormData
): Promise<ProductCombinationFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await updateProductCombination(productId, readRequiredText(formData, 'combinationId'), {
      hexColor: readRequiredText(formData, 'hexColor'),
      materialAssignments: readMaterialAssignments(formData),
      name: readRequiredText(formData, 'name')
    })
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toFormState(error)
  }
}

/**
 * Soft-deletes a product combination from a confirmation dialog.
 *
 * @param _state - Previous form state.
 * @param formData - Combination delete payload.
 * @returns Form state describing the mutation result.
 */
export async function deleteProductCombinationAction(
  _state: ProductCombinationFormState,
  formData: FormData
): Promise<ProductCombinationFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await softDeleteProductCombination(productId, readRequiredText(formData, 'combinationId'))
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toFormState(error)
  }
}
