import type {
  FormFieldErrors,
  MutationFormState
} from '@/core/types/form-state.types'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

/**
 * Builds a successful mutation form state.
 *
 * @returns Success form state.
 */
export function createSuccessState(): MutationFormState {
  return { status: 'success' }
}

/**
 * Builds an error mutation form state.
 *
 * @param message - User-facing error message.
 * @param fieldErrors - Optional field-level validation messages.
 * @returns Error form state.
 */
export function createErrorState(
  message: string,
  fieldErrors?: FormFieldErrors
): MutationFormState {
  return {
    fieldErrors,
    message,
    status: 'error'
  }
}

/**
 * Reads a safe message from an unknown error object.
 *
 * @param error - Unknown caught error.
 * @param fallback - Fallback message.
 * @returns User-facing error message.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) {
    return fallback
  }

  if (error.message.startsWith('Invalid `')) {
    return fallback
  }

  return error.message
}

function normalizeFieldName(value: string): string {
  return value.replace(/[_-]/g, '').toLowerCase()
}

/**
 * Checks whether an unknown error is a Prisma unique constraint error.
 *
 * @param error - Unknown caught error.
 * @param fields - Expected field names from Prisma metadata.
 * @returns True when the error target includes every field.
 */
export function isUniqueConstraintError(error: unknown, fields: readonly string[]): boolean {
  if (!isRecord(error) || error.code !== 'P2002') {
    return false
  }

  const target = isRecord(error.meta) ? error.meta.target : undefined
  const values = (Array.isArray(target) ? target.map(String) : [String(target ?? '')])
    .map(normalizeFieldName)

  return fields
    .map(normalizeFieldName)
    .every(field => values.some(value => value.includes(field)))
}
