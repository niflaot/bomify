import type {
  PieceMaterialRequirementInput,
  PieceRecord
} from '@/core/types/piece.types'

import {
  toProductCombinationMaterialAssignmentRecord,
  type ProductCombinationMaterialAssignmentRow
} from '../product-combination/product-combination.service.utils'
import { toProductMaterialRecord, type ProductMaterialRow } from '../material/material.service.utils'

/**
 * Piece material requirement row returned by Prisma.
 */
export type PieceMaterialRequirementRow = {
  readonly combinationMaterial: ProductCombinationMaterialAssignmentRow | null
  readonly createdAt: Date
  readonly id: string
  readonly productMaterial: ProductMaterialRow | null
  readonly quantity: number
  readonly updatedAt: Date
}

/**
 * Product piece row returned by Prisma.
 */
export type PieceRow = {
  readonly createdAt: Date
  readonly deletedAt: Date | null
  readonly dxfBucket: string
  readonly dxfFileName: string
  readonly dxfObjectKey: string
  readonly dxfUrl: string | null
  readonly heightMm: number
  readonly id: string
  readonly name: string
  readonly number: number
  readonly productId: string
  readonly requirements?: readonly PieceMaterialRequirementRow[]
  readonly updatedAt: Date
  readonly widthMm: number
}

/**
 * Normalizes and validates a piece name.
 *
 * @param name - Raw piece name.
 * @returns Normalized piece name.
 */
export function normalizePieceName(name: string): string {
  const trimmed = name.trim()

  if (!trimmed) {
    throw new Error('Piece name is required')
  }

  return trimmed.toUpperCase()
}

/**
 * Normalizes and validates a piece number.
 *
 * @param number - Raw piece number.
 * @returns Normalized piece number.
 */
export function normalizePieceNumber(number: number): number {
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error('Piece number must be a positive integer')
  }

  return number
}

/**
 * Normalizes and validates a physical dimension in millimeters.
 *
 * @param value - Raw dimension.
 * @param fieldName - Field name used in validation errors.
 * @returns Normalized dimension.
 */
export function normalizeDimensionMm(value: number, fieldName: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive number`)
  }

  return value
}

/**
 * Normalizes and validates material requirements.
 *
 * @param requirements - Raw material requirements.
 * @returns Normalized material requirements.
 */
export function normalizePieceMaterialRequirements(
  requirements: readonly PieceMaterialRequirementInput[]
): readonly PieceMaterialRequirementInput[] {
  const keys = new Set<string>()

  return requirements.map(requirement => {
    const quantity = normalizePieceQuantity(requirement.quantity)
    const key = 'productMaterialId' in requirement
      ? `global:${requirement.productMaterialId}`
      : `combination:${requirement.combinationMaterialId}`

    if (keys.has(key)) {
      throw new Error('Piece material requirements must be unique per scope')
    }

    keys.add(key)

    return 'productMaterialId' in requirement
      ? { productMaterialId: requirement.productMaterialId, quantity }
      : { combinationMaterialId: requirement.combinationMaterialId, quantity }
  })
}

/**
 * Maps a Prisma piece row to a service record.
 *
 * @param row - Product piece row.
 * @returns Product piece record.
 */
export function toPieceRecord(row: PieceRow): PieceRecord {
  return {
    createdAt: row.createdAt,
    deletedAt: row.deletedAt,
    dxfBucket: row.dxfBucket,
    dxfFileName: row.dxfFileName,
    dxfObjectKey: row.dxfObjectKey,
    dxfUrl: row.dxfUrl,
    heightMm: row.heightMm,
    id: row.id,
    materialRequirements: (row.requirements ?? []).map(requirement => ({
      combinationMaterial: requirement.combinationMaterial
        ? toProductCombinationMaterialAssignmentRecord(requirement.combinationMaterial)
        : null,
      createdAt: requirement.createdAt,
      id: requirement.id,
      productMaterial: requirement.productMaterial
        ? toProductMaterialRecord(requirement.productMaterial)
        : null,
      quantity: requirement.quantity,
      updatedAt: requirement.updatedAt
    })),
    name: row.name,
    number: row.number,
    productId: row.productId,
    updatedAt: row.updatedAt,
    widthMm: row.widthMm
  }
}

function normalizePieceQuantity(quantity: number): number {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('Piece material quantity must be a positive integer')
  }

  return quantity
}
