import type { getTranslations } from 'next-intl/server'

import type { MaterialRecord, ProductMaterialRecord } from '@/core/types/material.types'
import type { PieceRecord } from '@/core/types/piece.types'
import type { ProductCombinationRecord } from '@/core/types/product-combination.types'
import type { ProductRecord } from '@/core/types/product.types'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspaceMaterial,
  ProductWorkspacePiece,
  ProductWorkspaceProductMaterial
} from './product-workspace.types'

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
 * Builds translated workspace labels.
 *
 * @param t - Product workspace translation helper.
 * @returns Workspace labels.
 */
export function getWorkspaceLabels(
  t: Awaited<ReturnType<typeof getTranslations>>
): ProductWorkspaceLabels {
  return {
    addCombination: t('addCombination'),
    addCombinationMaterial: t('addCombinationMaterial'),
    addMaterial: t('addMaterial'),
    addPiece: t('addPiece'),
    calculate: t('calculate'),
    cancel: t('cancel'),
    canvasEmptyDescription: t('canvasEmptyDescription'),
    canvasEmptyTitle: t('canvasEmptyTitle'),
    canvasLabel: t('canvasLabel'),
    closeDialog: t('closeDialog'),
    combinationColorLabel: t('combinationColorLabel'),
    combinationCreateTitle: t('combinationCreateTitle'),
    combinationDeleteDescription: t('combinationDeleteDescription'),
    combinationDeleteTitle: t('combinationDeleteTitle'),
    combinationEmptyDescription: t('combinationEmptyDescription'),
    combinationEmptyTitle: t('combinationEmptyTitle'),
    combinationMaterialAssignmentsLabel: t('combinationMaterialAssignmentsLabel'),
    combinationMaterialEmptyDescription: t('combinationMaterialEmptyDescription'),
    combinationMaterialMaterialLabel: t('combinationMaterialMaterialLabel'),
    combinationMaterialRoleLabel: t('combinationMaterialRoleLabel'),
    combinationMaterialToggleLabel: t('combinationMaterialToggleLabel'),
    combinationNameLabel: t('combinationNameLabel'),
    combinationNamePlaceholder: t('combinationNamePlaceholder'),
    combinations: t('combinations'),
    combinationsPanelDescription: t('combinationsPanelDescription'),
    createCatalogMaterial: t('createCatalogMaterial'),
    createCombination: t('createCombination'),
    createPiece: t('createPiece'),
    deleteCombination: t('deleteCombination'),
    deleteMaterial: t('deleteMaterial'),
    deletePiece: t('deletePiece'),
    deleting: t('deleting'),
    editCombination: t('editCombination'),
    editPiece: t('editPiece'),
    export: t('export'),
    home: t('home'),
    materialCatalogEmptyDescription: t('materialCatalogEmptyDescription'),
    materialCatalogSearchLabel: t('materialCatalogSearchLabel'),
    materialCatalogSearchPlaceholder: t('materialCatalogSearchPlaceholder'),
    materialColorLabel: t('materialColorLabel'),
    materialDeleteDescription: t('materialDeleteDescription'),
    materialDeleteTitle: t('materialDeleteTitle'),
    materialEmptyDescription: t('materialEmptyDescription'),
    materialEmptyTitle: t('materialEmptyTitle'),
    materialIconLabel: t('materialIconLabel'),
    materialIconSearchLabel: t('materialIconSearchLabel'),
    materialIconSearchPlaceholder: t('materialIconSearchPlaceholder'),
    materialNameLabel: t('materialNameLabel'),
    materialNamePlaceholder: t('materialNamePlaceholder'),
    materialSelectLabel: t('materialSelectLabel'),
    materialWidthLabel: t('materialWidthLabel'),
    materialWidthPlaceholder: t('materialWidthPlaceholder'),
    materials: t('materials'),
    materialsPanelDescription: t('materialsPanelDescription'),
    newCatalogMaterial: t('newCatalogMaterial'),
    pieceAddMaterialRequirement: t('pieceAddMaterialRequirement'),
    pieceCombinationScopeEmptyDescription: t('pieceCombinationScopeEmptyDescription'),
    pieceDeleteDescription: t('pieceDeleteDescription'),
    pieceDeleteTitle: t('pieceDeleteTitle'),
    pieceDxfChooseAction: t('pieceDxfChooseAction'),
    pieceDxfCurrentLabel: t('pieceDxfCurrentLabel'),
    pieceDxfDropHint: t('pieceDxfDropHint'),
    pieceDxfInvalidFile: t('pieceDxfInvalidFile'),
    pieceDxfLabel: t('pieceDxfLabel'),
    pieceDxfPreviewLabel: t('pieceDxfPreviewLabel'),
    pieceDxfSelectedLabel: t('pieceDxfSelectedLabel'),
    pieceEmptyDescription: t('pieceEmptyDescription'),
    pieceEmptyTitle: t('pieceEmptyTitle'),
    pieceGlobalScopeEmptyDescription: t('pieceGlobalScopeEmptyDescription'),
    pieceGlobalScopeLabel: t('pieceGlobalScopeLabel'),
    pieceHeightLabel: t('pieceHeightLabel'),
    pieceMaterialsLabel: t('pieceMaterialsLabel'),
    pieceNameLabel: t('pieceNameLabel'),
    pieceNamePlaceholder: t('pieceNamePlaceholder'),
    pieceNumberLabel: t('pieceNumberLabel'),
    pieceQuantityLabel: t('pieceQuantityLabel'),
    pieceRemoveMaterialRequirement: t('pieceRemoveMaterialRequirement'),
    pieceReplaceDxfLabel: t('pieceReplaceDxfLabel'),
    pieceSave: t('pieceSave'),
    pieceScopeAllLabel: t('pieceScopeAllLabel'),
    pieceWidthLabel: t('pieceWidthLabel'),
    pieces: t('pieces'),
    piecesPanelDescription: t('piecesPanelDescription'),
    product: t('product'),
    productPanelDescription: t('productPanelDescription'),
    removeCombinationMaterial: t('removeCombinationMaterial'),
    save: t('save'),
    saveCombination: t('saveCombination'),
    saveMaterial: t('saveMaterial'),
    saving: t('saving'),
    selectExistingMaterial: t('selectExistingMaterial'),
    sidebarTitle: t('sidebarTitle'),
    stickers: t('stickers'),
    stickersPanelDescription: t('stickersPanelDescription'),
    updated: t('updated'),
    uploads: t('uploads'),
    uploadsPanelDescription: t('uploadsPanelDescription'),
    workspace: t('workspace')
  }
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
    name: material.name,
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
