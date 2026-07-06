import type {
  AttachProductMaterialInput,
  ProductMaterialRecord,
  UpdateProductMaterialInput
} from '@/core/types/material.types'

import { toMaterialRecord, toProductMaterialRecord } from '../material/material.service.utils'
import { prisma } from '../prisma/prisma.service'

async function ensureActiveMaterial(materialId: string): Promise<void> {
  const material = await prisma.material.findFirst({
    where: {
      deletedAt: null,
      id: materialId
    }
  })

  if (!material) {
    throw new Error('Material was not found')
  }

  toMaterialRecord(material)
}

async function ensureProductCombination(
  productId: string,
  combinationId?: string | null
): Promise<void> {
  if (!combinationId) {
    return
  }

  const combination = await prisma.productCombination.findFirst({
    where: {
      deletedAt: null,
      id: combinationId,
      productId
    }
  })

  if (!combination) {
    throw new Error('Combination was not found')
  }
}

async function findProductMaterial(
  productId: string,
  productMaterialId: string
): Promise<ProductMaterialRecord> {
  const row = await prisma.productMaterial.findFirst({
    include: { material: true },
    where: {
      id: productMaterialId,
      material: { deletedAt: null },
      productId
    }
  })

  if (!row) {
    throw new Error('Product material was not found')
  }

  return toProductMaterialRecord(row)
}

/**
 * Lists materials attached to one product.
 *
 * @param productId - Product id.
 * @returns Product material links.
 */
export async function listProductMaterials(productId: string): Promise<ProductMaterialRecord[]> {
  const rows = await prisma.productMaterial.findMany({
    include: { material: true },
    orderBy: { updatedAt: 'desc' },
    where: {
      material: { deletedAt: null },
      productId
    }
  })

  return rows.map(toProductMaterialRecord)
}

/**
 * Attaches an active global material to a product, scoped globally or to one combination.
 *
 * @param input - Product material attachment data.
 * @returns Product material link.
 */
export async function attachProductMaterial(
  input: AttachProductMaterialInput
): Promise<ProductMaterialRecord> {
  await ensureActiveMaterial(input.materialId)
  await ensureProductCombination(input.productId, input.combinationId)

  const existing = await prisma.productMaterial.findFirst({
    include: { material: true },
    where: {
      combinationId: input.combinationId ?? null,
      materialId: input.materialId,
      productId: input.productId
    }
  })

  if (existing) {
    return toProductMaterialRecord(existing)
  }

  const row = await prisma.productMaterial.create({
    data: {
      combinationId: input.combinationId ?? null,
      materialId: input.materialId,
      productId: input.productId
    },
    include: { material: true }
  })

  return toProductMaterialRecord(row)
}

/**
 * Updates a product material link scope or selected material.
 *
 * @param productId - Product id.
 * @param id - Product material link id.
 * @param input - Product material update data.
 * @returns Updated product material link.
 */
export async function updateProductMaterial(
  productId: string,
  id: string,
  input: UpdateProductMaterialInput
): Promise<ProductMaterialRecord> {
  const current = await findProductMaterial(productId, id)
  const materialId = input.materialId ?? current.material.id
  const combinationId = input.combinationId === undefined
    ? current.combinationId
    : input.combinationId

  await ensureActiveMaterial(materialId)
  await ensureProductCombination(productId, combinationId)

  const duplicate = await prisma.productMaterial.findFirst({
    where: {
      combinationId: combinationId ?? null,
      id: { not: id },
      materialId,
      productId
    }
  })

  if (duplicate) {
    throw new Error('This material is already attached with that scope')
  }

  const row = await prisma.productMaterial.update({
    data: {
      combinationId,
      materialId
    },
    include: { material: true },
    where: { id }
  })

  return toProductMaterialRecord(row)
}

/**
 * Hard-deletes a product material relation without deleting the global material.
 *
 * @param productId - Product id.
 * @param id - Product material link id.
 * @returns Removed product material link.
 */
export async function detachProductMaterial(
  productId: string,
  id: string
): Promise<ProductMaterialRecord> {
  await findProductMaterial(productId, id)

  const row = await prisma.productMaterial.delete({
    include: { material: true },
    where: { id }
  })

  return toProductMaterialRecord(row)
}
