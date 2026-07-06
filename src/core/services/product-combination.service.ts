import { prisma } from './prisma.service'
import type {
  CreateProductCombinationInput,
  ListProductCombinationsInput,
  ProductCombinationRecord,
  UpdateProductCombinationInput
} from '@/core/types/product-combination.types'

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i

function normalizeCombinationName(name: string): string {
  const trimmed = name.trim()

  if (!trimmed) {
    throw new Error('Combination name is required')
  }

  return trimmed
}

function normalizeHexColor(hexColor: string): string {
  const normalized = hexColor.trim().toUpperCase()

  if (!HEX_COLOR_PATTERN.test(normalized)) {
    throw new Error('Combination color must be a valid hex color')
  }

  return normalized
}

async function ensureActiveCombination(
  productId: string,
  id: string
): Promise<ProductCombinationRecord> {
  const combination = await prisma.productCombination.findFirst({
    where: {
      deletedAt: null,
      id,
      productId
    }
  })

  if (!combination) {
    throw new Error('Combination was not found')
  }

  return combination
}

/**
 * Creates a product combination.
 *
 * @param input - Product combination creation data.
 * @returns Created combination record.
 */
export async function createProductCombination(
  input: CreateProductCombinationInput
): Promise<ProductCombinationRecord> {
  return prisma.productCombination.create({
    data: {
      hexColor: normalizeHexColor(input.hexColor),
      name: normalizeCombinationName(input.name),
      productId: input.productId
    }
  })
}

/**
 * Lists non-deleted combinations for one product.
 *
 * @param input - Combination list options.
 * @returns Matching combination records.
 */
export async function listProductCombinations(
  input: ListProductCombinationsInput
): Promise<ProductCombinationRecord[]> {
  return prisma.productCombination.findMany({
    orderBy: { updatedAt: 'desc' },
    where: {
      deletedAt: input.includeDeleted ? undefined : null,
      productId: input.productId
    }
  })
}

/**
 * Updates one active product combination.
 *
 * @param productId - Product id that owns the combination.
 * @param id - Combination id.
 * @param input - Combination update data.
 * @returns Updated combination record.
 */
export async function updateProductCombination(
  productId: string,
  id: string,
  input: UpdateProductCombinationInput
): Promise<ProductCombinationRecord> {
  await ensureActiveCombination(productId, id)

  return prisma.productCombination.update({
    data: {
      hexColor: input.hexColor === undefined ? undefined : normalizeHexColor(input.hexColor),
      name: input.name === undefined ? undefined : normalizeCombinationName(input.name)
    },
    where: { id }
  })
}

/**
 * Soft-deletes one product combination.
 *
 * @param productId - Product id that owns the combination.
 * @param id - Combination id.
 * @returns Soft-deleted combination record.
 */
export async function softDeleteProductCombination(
  productId: string,
  id: string
): Promise<ProductCombinationRecord> {
  await ensureActiveCombination(productId, id)

  return prisma.productCombination.update({
    data: { deletedAt: new Date() },
    where: { id }
  })
}
