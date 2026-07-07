import type {
  PieceDxfInput,
  PieceFormState,
  PieceMaterialRequirementInput
} from '@/core/types/piece.types'
import {
  createErrorState,
  getErrorMessage,
  isUniqueConstraintError
} from '@/core/utils/form/form-state.utils'

function readOptionalText(formData: FormData, key: string): string | undefined {
  const value = formData.get(key)

  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

/**
 * Reads a required text field from form data.
 *
 * @param formData - Submitted form data.
 * @param key - Field name.
 * @returns Trimmed text value.
 */
export function readRequiredText(formData: FormData, key: string): string {
  const value = readOptionalText(formData, key)

  if (!value) {
    throw new Error(`${key} is required`)
  }

  return value
}

/**
 * Reads a required positive integer from form data.
 *
 * @param formData - Submitted form data.
 * @param key - Field name.
 * @returns Parsed integer.
 */
export function readRequiredInteger(formData: FormData, key: string): number {
  const value = Number(readRequiredText(formData, key))

  if (!Number.isInteger(value)) {
    throw new Error(`${key} must be an integer`)
  }

  return value
}

/**
 * Reads an optional centimeter value and converts it to millimeters.
 *
 * @param formData - Submitted form data.
 * @param key - Field name.
 * @returns Millimeters when present.
 */
export function readOptionalCmAsMm(formData: FormData, key: string): number | undefined {
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

/**
 * Reads a required DXF file from form data.
 *
 * @param formData - Submitted form data.
 * @returns DXF upload payload.
 */
export async function readRequiredDxf(formData: FormData): Promise<PieceDxfInput> {
  const value = formData.get('dxf')

  if (!(value instanceof File) || value.size === 0) {
    throw new Error('DXF file is required')
  }

  return readDxfFile(value)
}

/**
 * Reads an optional DXF file from form data.
 *
 * @param formData - Submitted form data.
 * @returns DXF upload payload when present.
 */
export async function readOptionalDxf(
  formData: FormData
): Promise<PieceDxfInput | undefined> {
  const value = formData.get('dxf')

  if (!(value instanceof File) || value.size === 0) {
    return undefined
  }

  return readDxfFile(value)
}

function readRequirementRows(
  ids: FormDataEntryValue[],
  quantities: FormDataEntryValue[],
  scope: 'global' | 'combination'
): PieceMaterialRequirementInput[] {
  const rows: PieceMaterialRequirementInput[] = []

  ids.forEach((id, index) => {
    const quantity = quantities[index]

    if (typeof id !== 'string' || !id.trim()) {
      return
    }

    if (typeof quantity !== 'string') {
      throw new Error(`${scope} material quantity is required`)
    }

    const amount = Number(quantity)

    if (!Number.isInteger(amount) || amount < 1) {
      throw new Error(`${scope} material quantity must be a positive integer`)
    }

    if (scope === 'global') {
      rows.push({ productMaterialId: id.trim(), quantity: amount })
      return
    }

    rows.push({ combinationMaterialId: id.trim(), quantity: amount })
  })

  return rows
}

/**
 * Reads all material requirements from a piece form.
 *
 * @param formData - Submitted form data.
 * @returns Material requirement inputs.
 */
export function readMaterialRequirements(
  formData: FormData
): readonly PieceMaterialRequirementInput[] {
  const requirements = [
    ...readRequirementRows(
      formData.getAll('globalProductMaterialId'),
      formData.getAll('globalQuantity'),
      'global'
    ),
    ...readRequirementRows(
      formData.getAll('combinationMaterialId'),
      formData.getAll('combinationQuantity'),
      'combination'
    )
  ]

  if (requirements.length === 0) {
    throw new Error('At least one material assignment is required')
  }

  return requirements
}

/**
 * Converts a caught piece action error into form state.
 *
 * @param error - Unknown caught error.
 * @returns Piece form state.
 */
export function toPieceFormState(error: unknown): PieceFormState {
  const duplicateMessage = 'Piece number already exists for this product'

  if (
    isUniqueConstraintError(error, ['product_id', 'number'])
    || getErrorMessage(error, '').includes(duplicateMessage)
  ) {
    return createErrorState(duplicateMessage, { number: duplicateMessage })
  }

  const message = getErrorMessage(error, 'Could not save piece')
  const field = getPieceErrorField(message)

  return createErrorState(message, field ? { [field]: message } : undefined)
}

function getPieceErrorField(message: string): string | null {
  if (/number|Piece number/i.test(message)) {
    return 'number'
  }

  if (/name|Piece name/i.test(message)) {
    return 'name'
  }

  if (/DXF|file/i.test(message)) {
    return 'dxf'
  }

  if (/width/i.test(message)) {
    return 'widthCm'
  }

  if (/height/i.test(message)) {
    return 'heightCm'
  }

  if (/material|quantity/i.test(message)) {
    return 'materialRequirements'
  }

  return null
}
