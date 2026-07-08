import { ADDITION_CATEGORIES } from '@/core/constants/addition-category.constants'
import type {
  ProductAdditionCategory,
  ProductAdditionRecord
} from '@/core/types/product-addition.types'

/**
 * Product addition row shape returned by Prisma queries.
 */
export type ProductAdditionRow = {
  readonly category: string
  readonly createdAt: Date
  readonly deletedAt: Date | null
  readonly id: string
  readonly name: string
  readonly productId: string
  readonly quantity: number
  readonly unitPriceCop: number
  readonly updatedAt: Date
}

/**
 * Normalizes and validates an addition name.
 *
 * @param name - Addition name.
 * @returns Normalized addition name.
 */
export function normalizeAdditionName(name: string): string {
  const trimmed = name.trim()

  if (!trimmed) {
    throw new Error('Addition name is required')
  }

  return trimmed
}

/**
 * Normalizes and validates an addition category against the predefined list.
 *
 * @param category - Addition category.
 * @returns Normalized addition category.
 */
export function normalizeAdditionCategory(category: string): ProductAdditionCategory {
  const normalized = category.trim() as ProductAdditionCategory

  if (!ADDITION_CATEGORIES.includes(normalized)) {
    throw new Error('Addition category is not supported')
  }

  return normalized
}

/**
 * Normalizes and validates an addition quantity (unitary or decimal, e.g.
 * hours/meters), rounded to 2 decimal places.
 *
 * @param quantity - Addition quantity.
 * @returns Normalized quantity.
 */
export function normalizeAdditionQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Addition quantity must be greater than 0')
  }

  return Math.round(quantity * 100) / 100
}

/**
 * Normalizes and validates an addition's unit price in whole Colombian pesos.
 *
 * @param unitPriceCop - Unit price in COP.
 * @returns Normalized non-negative integer price.
 */
export function normalizeAdditionUnitPriceCop(unitPriceCop: number): number {
  if (!Number.isFinite(unitPriceCop) || unitPriceCop < 0) {
    throw new Error('Addition unit price must be a non-negative number')
  }

  return Math.round(unitPriceCop)
}

/**
 * Maps a Prisma product addition row to a service record.
 *
 * @param addition - Product addition row.
 * @returns Product addition record.
 */
export function toProductAdditionRecord(addition: ProductAdditionRow): ProductAdditionRecord {
  return {
    category: normalizeAdditionCategory(addition.category),
    createdAt: addition.createdAt,
    deletedAt: addition.deletedAt,
    id: addition.id,
    name: addition.name,
    productId: addition.productId,
    quantity: addition.quantity,
    unitPriceCop: addition.unitPriceCop,
    updatedAt: addition.updatedAt
  }
}
