import { parseDxfGeometry } from '@/core/utils/dxf/dxf.utils'
import type {
  PieceDxfInput,
  PieceMaterialRequirementInput
} from '@/core/types/piece.types'

import { prisma } from '../prisma/prisma.service'
import { uploadObject } from '../storage/storage.service'
import { normalizeDimensionMm } from './piece.service.utils'

/**
 * Include graph used by piece service queries.
 */
export const pieceInclude = {
  requirements: {
    include: {
      combinationMaterial: {
        include: { productMaterial: { include: { material: true } } }
      },
      productMaterial: { include: { material: true } }
    },
    orderBy: { createdAt: 'asc' as const }
  }
}

/**
 * Stored DXF metadata and measured source dimensions.
 */
export type StoredPieceDxf = {
  readonly dxfBucket: string
  readonly dxfFileName: string
  readonly dxfObjectKey: string
  readonly dxfUrl?: string
  readonly heightMm: number
  readonly widthMm: number
}

/**
 * Ensures a product exists and is not soft-deleted.
 *
 * @param productId - Product id.
 * @returns Nothing when the product is active.
 */
export async function ensureActiveProduct(productId: string): Promise<void> {
  const count = await prisma.product.count({
    where: {
      deletedAt: null,
      id: productId
    }
  })

  if (count !== 1) {
    throw new Error('Product was not found')
  }
}

/**
 * Ensures a product piece exists and is not soft-deleted.
 *
 * @param productId - Product id that owns the piece.
 * @param id - Piece id.
 * @returns Nothing when the piece is active.
 */
export async function ensureActivePiece(productId: string, id: string): Promise<void> {
  const count = await prisma.piece.count({
    where: {
      deletedAt: null,
      id,
      productId
    }
  })

  if (count !== 1) {
    throw new Error('Piece was not found')
  }
}

/**
 * Ensures a product does not already have an active piece with the same number.
 *
 * @param productId - Product id that owns the piece.
 * @param number - Piece number to validate.
 * @param excludedPieceId - Optional piece id excluded during updates.
 * @returns Nothing when the number is available.
 */
export async function ensurePieceNumberAvailable(
  productId: string,
  number: number,
  excludedPieceId?: string
): Promise<void> {
  const count = await prisma.piece.count({
    where: {
      deletedAt: null,
      id: excludedPieceId ? { not: excludedPieceId } : undefined,
      number,
      productId
    }
  })

  if (count > 0) {
    throw new Error('Piece number already exists for this product')
  }
}

/**
 * Ensures every material requirement points to this product.
 *
 * @param productId - Product id.
 * @param requirements - Normalized material requirements.
 * @returns Nothing when every relation belongs to the product.
 */
export async function ensureRequirementsBelongToProduct(
  productId: string,
  requirements: readonly PieceMaterialRequirementInput[]
): Promise<void> {
  const globalIds = requirements
    .filter(requirement => 'productMaterialId' in requirement)
    .map(requirement => requirement.productMaterialId)
  const combinationIds = requirements
    .filter(requirement => 'combinationMaterialId' in requirement)
    .map(requirement => requirement.combinationMaterialId)

  await Promise.all([
    ensureProductMaterialIds(productId, globalIds),
    ensureCombinationMaterialIds(productId, combinationIds)
  ])
}

/**
 * Uploads a DXF and measures its parsed geometry.
 *
 * @param dxf - DXF payload.
 * @returns Stored DXF metadata with measured dimensions.
 */
export async function uploadPieceDxf(dxf: PieceDxfInput): Promise<StoredPieceDxf> {
  const geometry = parseDxfGeometry(dxf.text)
  const storedDxf = await uploadObject({
    body: dxf.body,
    contentType: dxf.contentType,
    fileName: dxf.fileName,
    namespace: 'pieces'
  })

  return {
    dxfBucket: storedDxf.bucket,
    dxfFileName: dxf.fileName,
    dxfObjectKey: storedDxf.objectKey,
    dxfUrl: storedDxf.publicUrl,
    heightMm: normalizeDimensionMm(geometry.bounds.height, 'Piece DXF height'),
    widthMm: normalizeDimensionMm(geometry.bounds.width, 'Piece DXF width')
  }
}

/**
 * Converts material requirement inputs to Prisma create rows.
 *
 * @param pieceId - Piece id.
 * @param requirements - Normalized material requirements.
 * @returns Prisma create rows.
 */
export function toRequirementCreateRows(
  pieceId: string,
  requirements: readonly PieceMaterialRequirementInput[]
): Array<{
  readonly combinationMaterialId: string | null
  readonly pieceId: string
  readonly productMaterialId: string | null
  readonly quantity: number
}> {
  return requirements.map(requirement => 'productMaterialId' in requirement
    ? {
        combinationMaterialId: null,
        pieceId,
        productMaterialId: requirement.productMaterialId,
        quantity: requirement.quantity
      }
    : {
        combinationMaterialId: requirement.combinationMaterialId,
        pieceId,
        productMaterialId: null,
        quantity: requirement.quantity
      })
}

async function ensureProductMaterialIds(
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
    throw new Error('One or more piece materials were not found')
  }
}

async function ensureCombinationMaterialIds(
  productId: string,
  combinationMaterialIds: readonly string[]
): Promise<void> {
  const uniqueIds = [...new Set(combinationMaterialIds)]

  if (uniqueIds.length === 0) {
    return
  }

  const count = await prisma.productCombinationMaterial.count({
    where: {
      combination: {
        deletedAt: null,
        productId
      },
      id: { in: uniqueIds },
      productMaterial: {
        material: { deletedAt: null },
        productId
      }
    }
  })

  if (count !== uniqueIds.length) {
    throw new Error('One or more combination material roles were not found')
  }
}
