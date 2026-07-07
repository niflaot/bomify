import type { ProductCombinationMaterialAssignmentRecord } from './product-combination.types'
import type { ProductMaterialRecord } from './material.types'
import type { MutationFormState } from './form-state.types'

/**
 * Binary DXF file payload accepted by piece services.
 */
export type PieceDxfInput = {
  readonly body: Uint8Array
  readonly contentType: string
  readonly fileName: string
  readonly text: string
}

/**
 * Material quantity required by a piece across every combination.
 */
export type PieceGlobalMaterialRequirementInput = {
  readonly productMaterialId: string
  readonly quantity: number
}

/**
 * Material quantity required by a piece for one combination material role.
 */
export type PieceCombinationMaterialRequirementInput = {
  readonly combinationMaterialId: string
  readonly quantity: number
}

/**
 * Material requirement input accepted by piece mutation services.
 */
export type PieceMaterialRequirementInput =
  | PieceGlobalMaterialRequirementInput
  | PieceCombinationMaterialRequirementInput

/**
 * Input used to create a product piece.
 */
export type CreatePieceInput = {
  readonly dxf: PieceDxfInput
  readonly heightMm?: number
  readonly materialRequirements: readonly PieceMaterialRequirementInput[]
  readonly name: string
  readonly number: number
  readonly productId: string
  readonly widthMm?: number
}

/**
 * Input used to update a product piece.
 */
export type UpdatePieceInput = {
  readonly dxf?: PieceDxfInput
  readonly heightMm?: number
  readonly materialRequirements?: readonly PieceMaterialRequirementInput[]
  readonly name?: string
  readonly number?: number
  readonly widthMm?: number
}

/**
 * Product piece query options.
 */
export type ListPiecesInput = {
  readonly includeDeleted?: boolean
  readonly productId: string
}

/**
 * Material quantity required by a persisted piece.
 */
export type PieceMaterialRequirementRecord = {
  readonly combinationMaterial: ProductCombinationMaterialAssignmentRecord | null
  readonly createdAt: Date
  readonly id: string
  readonly productMaterial: ProductMaterialRecord | null
  readonly quantity: number
  readonly updatedAt: Date
}

/**
 * Product piece record returned by services.
 */
export type PieceRecord = {
  readonly createdAt: Date
  readonly deletedAt: Date | null
  readonly dxfBucket: string
  readonly dxfFileName: string
  readonly dxfObjectKey: string
  readonly dxfUrl: string | null
  readonly heightMm: number
  readonly id: string
  readonly materialRequirements: readonly PieceMaterialRequirementRecord[]
  readonly name: string
  readonly number: number
  readonly productId: string
  readonly updatedAt: Date
  readonly widthMm: number
}

/**
 * Generic state returned by product piece mutation actions.
 */
export type PieceFormState = MutationFormState
