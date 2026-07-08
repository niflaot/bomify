import type {
  CreateProductAdditionInput,
  ListProductAdditionsInput,
  ProductAdditionRecord,
  UpdateProductAdditionInput
} from '@/core/types/product-addition.types'

import {
  normalizeAdditionCategory,
  normalizeAdditionName,
  normalizeAdditionQuantity,
  normalizeAdditionUnitPriceCop,
  toProductAdditionRecord
} from './product-addition.service.utils'
import { prisma } from '../prisma/prisma.service'

async function ensureActiveAddition(
  productId: string,
  id: string
): Promise<ProductAdditionRecord> {
  const addition = await prisma.productAddition.findFirst({
    where: {
      deletedAt: null,
      id,
      productId
    }
  })

  if (!addition) {
    throw new Error('Addition was not found')
  }

  return toProductAdditionRecord(addition)
}

/**
 * Creates a product addition (hardware/labor/misc line item).
 *
 * @param input - Product addition creation data.
 * @returns Created addition record.
 */
export async function createProductAddition(
  input: CreateProductAdditionInput
): Promise<ProductAdditionRecord> {
  const addition = await prisma.productAddition.create({
    data: {
      category: normalizeAdditionCategory(input.category),
      name: normalizeAdditionName(input.name),
      productId: input.productId,
      quantity: normalizeAdditionQuantity(input.quantity),
      unitPriceCop: normalizeAdditionUnitPriceCop(input.unitPriceCop)
    }
  })

  return toProductAdditionRecord(addition)
}

/**
 * Lists non-deleted additions for one product.
 *
 * @param input - Product addition list options.
 * @returns Matching addition records.
 */
export async function listProductAdditions(
  input: ListProductAdditionsInput
): Promise<ProductAdditionRecord[]> {
  const additions = await prisma.productAddition.findMany({
    orderBy: { createdAt: 'asc' },
    where: {
      deletedAt: input.includeDeleted ? undefined : null,
      productId: input.productId
    }
  })

  return additions.map(toProductAdditionRecord)
}

/**
 * Updates one active product addition.
 *
 * @param productId - Product id that owns the addition.
 * @param id - Addition id.
 * @param input - Product addition update data.
 * @returns Updated addition record.
 */
export async function updateProductAddition(
  productId: string,
  id: string,
  input: UpdateProductAdditionInput
): Promise<ProductAdditionRecord> {
  await ensureActiveAddition(productId, id)

  const addition = await prisma.productAddition.update({
    data: {
      category: input.category === undefined
        ? undefined
        : normalizeAdditionCategory(input.category),
      name: input.name === undefined ? undefined : normalizeAdditionName(input.name),
      quantity: input.quantity === undefined
        ? undefined
        : normalizeAdditionQuantity(input.quantity),
      unitPriceCop: input.unitPriceCop === undefined
        ? undefined
        : normalizeAdditionUnitPriceCop(input.unitPriceCop)
    },
    where: { id }
  })

  return toProductAdditionRecord(addition)
}

/**
 * Soft-deletes one product addition.
 *
 * @param productId - Product id that owns the addition.
 * @param id - Addition id.
 * @returns Soft-deleted addition record.
 */
export async function softDeleteProductAddition(
  productId: string,
  id: string
): Promise<ProductAdditionRecord> {
  await ensureActiveAddition(productId, id)

  const addition = await prisma.productAddition.update({
    data: { deletedAt: new Date() },
    where: { id }
  })

  return toProductAdditionRecord(addition)
}
