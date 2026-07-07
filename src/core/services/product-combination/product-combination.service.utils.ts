import type {
  ProductCombinationMaterialAssignmentInput,
  ProductCombinationRecord
} from '@/core/types/product-combination.types'

import { toProductMaterialRecord, type ProductMaterialRow } from '../material/material.service.utils'

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i

/**
 * Product combination material assignment row returned by Prisma.
 */
export type ProductCombinationMaterialAssignmentRow = {
  readonly createdAt: Date
  readonly id: string
  readonly productMaterial: ProductMaterialRow
  readonly roleId: string
  readonly updatedAt: Date
}

/**
 * Product combination row returned by Prisma.
 */
export type ProductCombinationRow = {
  readonly createdAt: Date
  readonly deletedAt: Date | null
  readonly hexColor: string
  readonly id: string
  readonly materialAssignments?: readonly ProductCombinationMaterialAssignmentRow[]
  readonly name: string
  readonly productId: string
  readonly updatedAt: Date
}

/**
 * Normalizes and validates a combination name.
 *
 * @param name - Combination name.
 * @returns Normalized combination name.
 */
export function normalizeCombinationName(name: string): string {
  const trimmed = name.trim()

  if (!trimmed) {
    throw new Error('Combination name is required')
  }

  return trimmed
}

/**
 * Normalizes and validates a combination hex color.
 *
 * @param hexColor - Combination color.
 * @returns Normalized hex color.
 */
export function normalizeHexColor(hexColor: string): string {
  const normalized = hexColor.trim().toUpperCase()

  if (!HEX_COLOR_PATTERN.test(normalized)) {
    throw new Error('Combination color must be a valid hex color')
  }

  return normalized
}

function normalizeRoleId(roleId: string): string {
  const normalized = roleId
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_]+/g, '-')

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    throw new Error('Material role id must use lowercase letters, numbers, or hyphens')
  }

  return normalized
}

/**
 * Normalizes role/material assignment rows.
 *
 * @param assignments - Raw assignment rows.
 * @returns Normalized assignment rows.
 */
export function normalizeMaterialAssignments(
  assignments: readonly ProductCombinationMaterialAssignmentInput[]
): readonly ProductCombinationMaterialAssignmentInput[] {
  const roleIds = new Set<string>()

  return assignments.map(assignment => {
    const roleId = normalizeRoleId(assignment.roleId)

    if (roleIds.has(roleId)) {
      throw new Error(`Material role ${roleId} is duplicated`)
    }

    roleIds.add(roleId)

    return {
      productMaterialId: assignment.productMaterialId,
      roleId
    }
  })
}

/**
 * Maps a Prisma combination material assignment row to a service record.
 *
 * @param row - Combination material assignment row.
 * @returns Product combination material assignment record.
 */
export function toProductCombinationMaterialAssignmentRecord(
  row: ProductCombinationMaterialAssignmentRow
): ProductCombinationRecord['materialAssignments'][number] {
  return {
    createdAt: row.createdAt,
    id: row.id,
    productMaterial: toProductMaterialRecord(row.productMaterial),
    roleId: row.roleId,
    updatedAt: row.updatedAt
  }
}

/**
 * Maps a Prisma combination row to a service record.
 *
 * @param row - Product combination row.
 * @returns Product combination record.
 */
export function toProductCombinationRecord(
  row: ProductCombinationRow
): ProductCombinationRecord {
  return {
    createdAt: row.createdAt,
    deletedAt: row.deletedAt,
    hexColor: row.hexColor,
    id: row.id,
    materialAssignments: (row.materialAssignments ?? []).map(
      toProductCombinationMaterialAssignmentRecord
    ),
    name: row.name,
    productId: row.productId,
    updatedAt: row.updatedAt
  }
}
