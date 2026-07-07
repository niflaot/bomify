import type {
  CreatePieceInput,
  ListPiecesInput,
  PieceRecord,
  UpdatePieceInput
} from '@/core/types/piece.types'

import { prisma } from '../prisma/prisma.service'
import {
  ensureActivePiece,
  ensureActiveProduct,
  ensureRequirementsBelongToProduct,
  pieceInclude,
  toRequirementCreateRows,
  uploadPieceDxf
} from './piece.service.helpers'
import {
  normalizeDimensionMm,
  normalizePieceMaterialRequirements,
  normalizePieceName,
  normalizePieceNumber,
  toPieceRecord
} from './piece.service.utils'

/**
 * Creates a product piece and stores its DXF in S3-compatible storage.
 *
 * @param input - Product piece creation data.
 * @returns Created piece record.
 */
export async function createPiece(input: CreatePieceInput): Promise<PieceRecord> {
  await ensureActiveProduct(input.productId)
  const dxf = await uploadPieceDxf(input.dxf)
  const requirements = normalizePieceMaterialRequirements(input.materialRequirements)

  await ensureRequirementsBelongToProduct(input.productId, requirements)

  return prisma.$transaction(async transaction => {
    const piece = await transaction.piece.create({
      data: {
        ...dxf,
        heightMm: input.heightMm === undefined
          ? dxf.heightMm
          : normalizeDimensionMm(input.heightMm, 'Piece height'),
        name: normalizePieceName(input.name),
        number: normalizePieceNumber(input.number),
        productId: input.productId,
        widthMm: input.widthMm === undefined
          ? dxf.widthMm
          : normalizeDimensionMm(input.widthMm, 'Piece width')
      }
    })

    if (requirements.length > 0) {
      await transaction.pieceMaterialRequirement.createMany({
        data: toRequirementCreateRows(piece.id, requirements)
      })
    }

    return toPieceRecord(await transaction.piece.findUniqueOrThrow({
      include: pieceInclude,
      where: { id: piece.id }
    }))
  })
}

/**
 * Lists non-deleted pieces for one product.
 *
 * @param input - Piece list options.
 * @returns Matching piece records.
 */
export async function listPieces(input: ListPiecesInput): Promise<PieceRecord[]> {
  const pieces = await prisma.piece.findMany({
    include: pieceInclude,
    orderBy: { number: 'asc' },
    where: {
      deletedAt: input.includeDeleted ? undefined : null,
      productId: input.productId
    }
  })

  return pieces.map(toPieceRecord)
}

/**
 * Updates one active product piece.
 *
 * @param productId - Product id that owns the piece.
 * @param id - Piece id.
 * @param input - Product piece update data.
 * @returns Updated piece record.
 */
export async function updatePiece(
  productId: string,
  id: string,
  input: UpdatePieceInput
): Promise<PieceRecord> {
  await ensureActivePiece(productId, id)
  const dxf = input.dxf ? await uploadPieceDxf(input.dxf) : undefined
  const requirements = input.materialRequirements === undefined
    ? undefined
    : normalizePieceMaterialRequirements(input.materialRequirements)

  if (requirements) {
    await ensureRequirementsBelongToProduct(productId, requirements)
  }

  return prisma.$transaction(async transaction => {
    await transaction.piece.update({
      data: {
        ...dxf,
        heightMm: input.heightMm === undefined
          ? dxf?.heightMm
          : normalizeDimensionMm(input.heightMm, 'Piece height'),
        name: input.name === undefined ? undefined : normalizePieceName(input.name),
        number: input.number === undefined ? undefined : normalizePieceNumber(input.number),
        widthMm: input.widthMm === undefined
          ? dxf?.widthMm
          : normalizeDimensionMm(input.widthMm, 'Piece width')
      },
      where: { id }
    })

    if (requirements) {
      await transaction.pieceMaterialRequirement.deleteMany({ where: { pieceId: id } })

      if (requirements.length > 0) {
        await transaction.pieceMaterialRequirement.createMany({
          data: toRequirementCreateRows(id, requirements)
        })
      }
    }

    return toPieceRecord(await transaction.piece.findUniqueOrThrow({
      include: pieceInclude,
      where: { id }
    }))
  })
}

/**
 * Soft-deletes one product piece.
 *
 * @param productId - Product id that owns the piece.
 * @param id - Piece id.
 * @returns Soft-deleted piece record.
 */
export async function softDeletePiece(productId: string, id: string): Promise<PieceRecord> {
  await ensureActivePiece(productId, id)

  const piece = await prisma.piece.update({
    data: { deletedAt: new Date() },
    include: pieceInclude,
    where: { id }
  })

  return toPieceRecord(piece)
}
