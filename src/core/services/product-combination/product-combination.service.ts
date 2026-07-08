import { prisma } from '../prisma/prisma.service'
import type {
  CreateProductCombinationInput,
  ListProductCombinationsInput,
  ProductCombinationRecord,
  UpdateProductCombinationInput
} from '@/core/types/product-combination.types'
import {
  normalizeCombinationName,
  normalizeHexColor,
  normalizeMaterialAssignments,
  normalizeSalePriceCop,
  toProductCombinationRecord
} from './product-combination.service.utils'

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

  return toProductCombinationRecord(combination)
}

async function ensureProductMaterialsBelongToProduct(
  productId: string,
  productMaterialIds: readonly string[]
): Promise<void> {
  const uniqueIds = [...new Set(productMaterialIds)]

  if (uniqueIds.length === 0) {
    return
  }

  const count = await prisma.productMaterial.count({
    where: {
      id: { in: uniqueIds },
      material: { deletedAt: null },
      productId
    }
  })

  if (count !== uniqueIds.length) {
    throw new Error('One or more assigned materials were not found')
  }
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
  const materialAssignments = normalizeMaterialAssignments(input.materialAssignments ?? [])

  await ensureProductMaterialsBelongToProduct(
    input.productId,
    materialAssignments.map(assignment => assignment.productMaterialId)
  )

  return prisma.$transaction(async transaction => {
    const combination = await transaction.productCombination.create({
      data: {
        hexColor: normalizeHexColor(input.hexColor),
        name: normalizeCombinationName(input.name),
        productId: input.productId,
        salePriceCop: normalizeSalePriceCop(input.salePriceCop)
      }
    })

    if (materialAssignments.length > 0) {
      await transaction.productCombinationMaterial.createMany({
        data: materialAssignments.map(assignment => ({
          combinationId: combination.id,
          productMaterialId: assignment.productMaterialId,
          roleId: assignment.roleId
        }))
      })
    }

    const createdCombination = await transaction.productCombination.findUniqueOrThrow({
      include: {
        materialAssignments: {
          include: { productMaterial: { include: { material: true } } },
          orderBy: { roleId: 'asc' }
        }
      },
      where: { id: combination.id }
    })

    return toProductCombinationRecord(createdCombination)
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
  const combinations = await prisma.productCombination.findMany({
    include: {
      materialAssignments: {
        include: { productMaterial: { include: { material: true } } },
        orderBy: { roleId: 'asc' }
      }
    },
    orderBy: { updatedAt: 'desc' },
    where: {
      deletedAt: input.includeDeleted ? undefined : null,
      productId: input.productId
    }
  })

  return combinations.map(toProductCombinationRecord)
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
  const materialAssignments = input.materialAssignments === undefined
    ? undefined
    : normalizeMaterialAssignments(input.materialAssignments)

  if (materialAssignments) {
    await ensureProductMaterialsBelongToProduct(
      productId,
      materialAssignments.map(assignment => assignment.productMaterialId)
    )
  }

  return prisma.$transaction(async transaction => {
    await transaction.productCombination.update({
      data: {
        hexColor: input.hexColor === undefined ? undefined : normalizeHexColor(input.hexColor),
        name: input.name === undefined ? undefined : normalizeCombinationName(input.name),
        salePriceCop: input.salePriceCop === undefined
          ? undefined
          : normalizeSalePriceCop(input.salePriceCop)
      },
      where: { id }
    })

    if (materialAssignments) {
      await transaction.productCombinationMaterial.deleteMany({
        where: { combinationId: id }
      })

      if (materialAssignments.length > 0) {
        await transaction.productCombinationMaterial.createMany({
          data: materialAssignments.map(assignment => ({
            combinationId: id,
            productMaterialId: assignment.productMaterialId,
            roleId: assignment.roleId
          }))
        })
      }
    }

    const combination = await transaction.productCombination.findUniqueOrThrow({
      include: {
        materialAssignments: {
          include: { productMaterial: { include: { material: true } } },
          orderBy: { roleId: 'asc' }
        }
      },
      where: { id }
    })

    return toProductCombinationRecord(combination)
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

  const combination = await prisma.productCombination.update({
    data: { deletedAt: new Date() },
    where: { id }
  })

  return toProductCombinationRecord(combination)
}
