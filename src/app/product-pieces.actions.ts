'use server'

import { revalidatePath } from 'next/cache'

import {
  createPiece,
  softDeletePiece,
  updatePiece
} from '@/core/services/piece/piece.service'
import type {
  PieceDxfInput,
  PieceFormState,
  PieceMaterialRequirementInput
} from '@/core/types/piece.types'

function readRequiredText(formData: FormData, key: string): string {
  const value = formData.get(key)

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${key} is required`)
  }

  return value.trim()
}

function readOptionalText(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)

  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function readRequiredInteger(formData: FormData, key: string): number {
  const value = Number(readRequiredText(formData, key))

  if (!Number.isInteger(value)) {
    throw new Error(`${key} must be an integer`)
  }

  return value
}

function readOptionalCmAsMm(formData: FormData, key: string): number | undefined {
  const value = readOptionalText(formData, key)

  if (value === undefined) {
    return undefined
  }

  const centimeters = Number(value)

  if (!Number.isFinite(centimeters)) {
    throw new Error(`${key} must be a valid number`)
  }

  return centimeters * 10
}

function toFormState(error: unknown): PieceFormState {
  return {
    message: error instanceof Error ? error.message : 'Could not save piece',
    status: 'error'
  }
}

async function readDxfFile(file: File): Promise<PieceDxfInput> {
  if (!file.name.toLowerCase().endsWith('.dxf')) {
    throw new Error('Piece file must be a DXF')
  }

  return {
    body: new Uint8Array(await file.arrayBuffer()),
    contentType: file.type || 'application/dxf',
    fileName: file.name,
    text: await file.text()
  }
}

async function readRequiredDxf(formData: FormData): Promise<PieceDxfInput> {
  const value = formData.get('dxf')

  if (!(value instanceof File) || value.size === 0) {
    throw new Error('DXF file is required')
  }

  return readDxfFile(value)
}

async function readOptionalDxf(formData: FormData): Promise<PieceDxfInput | undefined> {
  const value = formData.get('dxf')

  if (!(value instanceof File) || value.size === 0) {
    return undefined
  }

  return readDxfFile(value)
}

function readMaterialRequirements(formData: FormData): readonly PieceMaterialRequirementInput[] {
  return [
    ...readGlobalRequirements(formData),
    ...readCombinationRequirements(formData)
  ]
}

function readGlobalRequirements(formData: FormData): PieceMaterialRequirementInput[] {
  const ids = formData.getAll('globalProductMaterialId')
  const quantities = formData.getAll('globalQuantity')

  return ids.flatMap((id, index) => {
    const quantity = quantities[index]

    if (typeof id !== 'string' || !id.trim()) {
      return []
    }

    if (typeof quantity !== 'string') {
      throw new Error('Global material quantity is required')
    }

    return [{
      productMaterialId: id.trim(),
      quantity: Number(quantity)
    }]
  })
}

function readCombinationRequirements(formData: FormData): PieceMaterialRequirementInput[] {
  const ids = formData.getAll('combinationMaterialId')
  const quantities = formData.getAll('combinationQuantity')

  return ids.flatMap((id, index) => {
    const quantity = quantities[index]

    if (typeof id !== 'string' || !id.trim()) {
      return []
    }

    if (typeof quantity !== 'string') {
      throw new Error('Combination material quantity is required')
    }

    return [{
      combinationMaterialId: id.trim(),
      quantity: Number(quantity)
    }]
  })
}

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

    return { status: 'success' }
  } catch (error) {
    return toFormState(error)
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

    return { status: 'success' }
  } catch (error) {
    return toFormState(error)
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

    return { status: 'success' }
  } catch (error) {
    return toFormState(error)
  }
}
