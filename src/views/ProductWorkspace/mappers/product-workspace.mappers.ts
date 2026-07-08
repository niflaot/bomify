import type { MaterialRecord, ProductMaterialRecord } from '@/core/types/material.types'
import type { PieceRecord } from '@/core/types/piece.types'
import type { ProductCombinationRecord } from '@/core/types/product-combination.types'
import type { ProductRecord } from '@/core/types/product.types'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceItem,
  ProductWorkspaceMaterial,
  ProductWorkspacePiece,
  ProductWorkspaceProductMaterial
} from '../types/product-workspace.types'

/**
 * Workspace data returned by server mappers.
 */
export type ProductWorkspaceData = {
  readonly catalogMaterials: readonly ProductWorkspaceMaterial[]
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly pieces: readonly ProductWorkspacePiece[]
  readonly product: ProductWorkspaceItem
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}

/**
 * Raw service records required to build workspace props.
 */
export type ProductWorkspaceDataInput = {
  readonly catalogMaterials: readonly MaterialRecord[]
  readonly combinations: readonly ProductCombinationRecord[]
  readonly pieces: readonly PieceRecord[]
  readonly product: ProductRecord
  readonly productMaterials: readonly ProductMaterialRecord[]
}

/**
 * Maps service records to product workspace props.
 *
 * @param input - Raw workspace service records.
 * @returns Workspace data props.
 */
export function toProductWorkspaceData(input: ProductWorkspaceDataInput): ProductWorkspaceData {
  return {
    catalogMaterials: input.catalogMaterials.map(toWorkspaceMaterial),
    combinations: input.combinations.map(toWorkspaceCombination),
    pieces: input.pieces.map(toWorkspacePiece),
    product: toWorkspaceItem(input.product),
    productMaterials: input.productMaterials.map(toWorkspaceProductMaterial)
  }
}

function toWorkspaceItem(product: ProductRecord): ProductWorkspaceItem {
  return {
    description: product.description,
    id: product.id,
    name: product.name,
    photoUrl: product.photoUrl,
    updatedAt: product.updatedAt.toISOString()
  }
}

function toWorkspaceCombination(
  combination: ProductCombinationRecord
): ProductWorkspaceCombination {
  return {
    hexColor: combination.hexColor,
    id: combination.id,
    materialAssignments: combination.materialAssignments.map(toWorkspaceCombinationMaterial),
    name: combination.name,
    updatedAt: combination.updatedAt.toISOString()
  }
}

function toWorkspaceCombinationMaterial(
  assignment: ProductCombinationRecord['materialAssignments'][number]
): ProductWorkspaceCombination['materialAssignments'][number] {
  return {
    id: assignment.id,
    productMaterial: toWorkspaceProductMaterial(assignment.productMaterial),
    roleId: assignment.roleId
  }
}

function toWorkspaceMaterial(material: MaterialRecord): ProductWorkspaceMaterial {
  return {
    hexColor: material.hexColor,
    iconKey: material.iconKey,
    id: material.id,
    labelName: material.labelName,
    name: material.name,
    priceCop: material.priceCop,
    updatedAt: material.updatedAt.toISOString(),
    widthCm: material.widthCm
  }
}

function toWorkspaceProductMaterial(
  productMaterial: ProductMaterialRecord
): ProductWorkspaceProductMaterial {
  return {
    id: productMaterial.id,
    material: toWorkspaceMaterial(productMaterial.material),
    updatedAt: productMaterial.updatedAt.toISOString()
  }
}

function toWorkspacePiece(piece: PieceRecord): ProductWorkspacePiece {
  return {
    dxfFileName: piece.dxfFileName,
    dxfUrl: piece.dxfUrl,
    heightMm: piece.heightMm,
    id: piece.id,
    materialRequirements: piece.materialRequirements.map(requirement => ({
      combinationMaterial: requirement.combinationMaterial
        ? toWorkspaceCombinationMaterial(requirement.combinationMaterial)
        : null,
      id: requirement.id,
      productMaterial: requirement.productMaterial
        ? toWorkspaceProductMaterial(requirement.productMaterial)
        : null,
      quantity: requirement.quantity
    })),
    name: piece.name,
    number: piece.number,
    updatedAt: piece.updatedAt.toISOString(),
    widthMm: piece.widthMm
  }
}
