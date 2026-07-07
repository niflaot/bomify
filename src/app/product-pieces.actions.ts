'use server'

import { revalidatePath } from 'next/cache'

import {
  createPiece,
  softDeletePiece,
  updatePiece
} from '@/core/services/piece/piece.service'
import type { PieceFormState } from '@/core/types/piece.types'
import { createSuccessState } from '@/core/utils/form/form-state.utils'
import {
  readMaterialRequirements,
  readOptionalCmAsMm,
  readOptionalDxf,
  readRequiredDxf,
  readRequiredInteger,
  readRequiredText,
  toPieceFormState
} from './product-pieces.action-utils'

/**
 * Creates a product piece from a dialog form.
 *
 * @param _state - Previous form state.
 * @param formData - Piece form payload.
 * @returns Form state describing the mutation result.
 */
export async function createPieceAction(
  _state: PieceFormState,
  formData: FormData
): Promise<PieceFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await createPiece({
      dxf: await readRequiredDxf(formData),
      heightMm: readOptionalCmAsMm(formData, 'heightCm'),
      materialRequirements: readMaterialRequirements(formData),
      name: readRequiredText(formData, 'name'),
      number: readRequiredInteger(formData, 'number'),
      productId,
      widthMm: readOptionalCmAsMm(formData, 'widthCm')
    })
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toPieceFormState(error)
  }
}

/**
 * Updates a product piece from a dialog form.
 *
 * @param _state - Previous form state.
 * @param formData - Piece form payload.
 * @returns Form state describing the mutation result.
 */
export async function updatePieceAction(
  _state: PieceFormState,
  formData: FormData
): Promise<PieceFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await updatePiece(productId, readRequiredText(formData, 'pieceId'), {
      dxf: await readOptionalDxf(formData),
      heightMm: readOptionalCmAsMm(formData, 'heightCm'),
      materialRequirements: readMaterialRequirements(formData),
      name: readRequiredText(formData, 'name'),
      number: readRequiredInteger(formData, 'number'),
      widthMm: readOptionalCmAsMm(formData, 'widthCm')
    })
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toPieceFormState(error)
  }
}

/**
 * Soft-deletes a product piece from a confirmation dialog.
 *
 * @param _state - Previous form state.
 * @param formData - Piece delete payload.
 * @returns Form state describing the mutation result.
 */
export async function deletePieceAction(
  _state: PieceFormState,
  formData: FormData
): Promise<PieceFormState> {
  try {
    const productId = readRequiredText(formData, 'productId')

    await softDeletePiece(productId, readRequiredText(formData, 'pieceId'))
    revalidatePath(`/products/${productId}`)

    return createSuccessState()
  } catch (error) {
    return toPieceFormState(error)
  }
}
