import { DEFAULT_MATERIAL_ICON_KEY, type MaterialIconKey } from '@/core/constants/material-icons.constants'
import type { MaterialRecord, ProductMaterialRecord } from '@/core/types/material.types'

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i

/**
 * Material row shape returned by Prisma queries.
 */
export type MaterialRow = {
  readonly id: string
  readonly name: string
  readonly labelName: string | null
  readonly iconKey: string
  readonly hexColor: string
  readonly widthCm: number
  readonly priceCop: number | null
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly deletedAt: Date | null
}

/**
 * Product material row shape returned by Prisma relation queries.
 */
export type ProductMaterialRow = {
  readonly id: string
  readonly productId: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly material: MaterialRow
}

/**
 * Normalizes and validates a material name.
 *
 * @param name - Material name.
 * @returns Normalized material name.
 */
export function normalizeMaterialName(name: string): string {
  const trimmed = name.trim()

  if (!trimmed) {
    throw new Error('Material name is required')
  }

  return trimmed
}

/**
 * Normalizes and validates a material hex color.
 *
 * @param hexColor - Material hex color.
 * @returns Normalized hex color.
 */
export function normalizeMaterialHexColor(hexColor: string): string {
  const normalized = hexColor.trim().toUpperCase()

  if (!HEX_COLOR_PATTERN.test(normalized)) {
    throw new Error('Material color must be a valid hex color')
  }

  return normalized
}

/**
 * Normalizes and validates a material roll width in centimeters.
 *
 * @param widthCm - Material width in centimeters.
 * @returns Normalized width in centimeters.
 */
export function normalizeMaterialWidthCm(widthCm: number): number {
  if (!Number.isFinite(widthCm) || widthCm <= 0) {
    throw new Error('Material width must be greater than 0 cm')
  }

  return Math.round(widthCm * 100) / 100
}

/**
 * Normalizes and validates a material icon key.
 *
 * @param iconKey - Material icon key.
 * @returns Supported material icon key.
 */
export function normalizeMaterialIconKey(iconKey: string): MaterialIconKey {
  const normalized = iconKey.trim() || DEFAULT_MATERIAL_ICON_KEY

  const isLegacyKey = /^[A-Za-z][A-Za-z0-9]*$/.test(normalized)
  const isDynamicKey = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(normalized)

  if (isLegacyKey || isDynamicKey) {
    return normalized
  }

  throw new Error('Material icon is not supported')
}

/**
 * Normalizes and validates a material price in whole Colombian pesos.
 *
 * @param priceCop - Material price in COP, or `null`/`undefined` when unset.
 * @returns Normalized non-negative integer price, or `null`.
 */
export function normalizeMaterialPriceCop(priceCop: number | null | undefined): number | null {
  if (priceCop === null || priceCop === undefined) {
    return null
  }

  if (!Number.isFinite(priceCop) || priceCop < 0) {
    throw new Error('Material price must be a non-negative number')
  }

  return Math.round(priceCop)
}

/**
 * Normalizes a material's short, reusable label name shown on printed
 * stickers instead of its full catalog name.
 *
 * @param labelName - Label name, or `null`/`undefined` when unset.
 * @returns Trimmed label name, or `null` when empty.
 */
export function normalizeMaterialLabelName(labelName: string | null | undefined): string | null {
  if (labelName === null || labelName === undefined) {
    return null
  }

  const trimmed = labelName.trim()

  return trimmed || null
}

/**
 * Maps a Prisma material row to a service record.
 *
 * @param material - Material row.
 * @returns Material record.
 */
export function toMaterialRecord(material: MaterialRow): MaterialRecord {
  return {
    createdAt: material.createdAt,
    deletedAt: material.deletedAt,
    hexColor: material.hexColor,
    iconKey: normalizeMaterialIconKey(material.iconKey),
    id: material.id,
    labelName: material.labelName,
    name: material.name,
    priceCop: material.priceCop,
    updatedAt: material.updatedAt,
    widthCm: material.widthCm
  }
}

/**
 * Maps a Prisma product material row to a service record.
 *
 * @param row - Product material row.
 * @returns Product material record.
 */
export function toProductMaterialRecord(row: ProductMaterialRow): ProductMaterialRecord {
  return {
    createdAt: row.createdAt,
    id: row.id,
    material: toMaterialRecord(row.material),
    productId: row.productId,
    updatedAt: row.updatedAt
  }
}
