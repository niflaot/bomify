import type { PieceMaterialRow } from '@/core/utils/document-export/pieces-list.types'

import type {
  ProductWorkspaceCombination,
  ProductWorkspacePiece,
  ProductWorkspacePieceMaterialRequirement,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'

function getRequirementMaterial(
  requirement: ProductWorkspacePieceMaterialRequirement
): ProductWorkspaceProductMaterial | null {
  return requirement.combinationMaterial?.productMaterial ?? requirement.productMaterial ?? null
}

function formatMaterialLabel(requirement: ProductWorkspacePieceMaterialRequirement): string {
  if (requirement.combinationMaterial) {
    return `${requirement.combinationMaterial.roleId} - ${requirement.combinationMaterial.productMaterial.material.name}`
  }

  return requirement.productMaterial?.material.name ?? ''
}

function formatMaterialLabelName(material: ProductWorkspaceProductMaterial): string {
  return material.material.labelName?.trim() || material.material.name
}

function getActiveRequirements(
  piece: ProductWorkspacePiece,
  activeCombination: ProductWorkspaceCombination | null
): readonly ProductWorkspacePieceMaterialRequirement[] {
  const activeAssignmentIds = new Set(
    activeCombination?.materialAssignments.map(assignment => assignment.id) ?? []
  )
  const combinationRequirements = piece.materialRequirements.filter(requirement =>
    requirement.combinationMaterial
      ? activeAssignmentIds.has(requirement.combinationMaterial.id)
      : false
  )
  const globalRequirements = piece.materialRequirements.filter(requirement =>
    requirement.productMaterial
  )

  return activeCombination
    ? [...combinationRequirements, ...globalRequirements]
    : globalRequirements
}

/**
 * Resolves every piece/material pairing active for the given combination,
 * for use by the pieces list PDF (grouped by material or by piece).
 *
 * @param pieces - Product pieces with material requirements.
 * @param activeCombination - Currently selected combination.
 * @returns Resolved piece/material rows, one per requirement.
 */
export function buildPieceMaterialRows(
  pieces: readonly ProductWorkspacePiece[],
  activeCombination: ProductWorkspaceCombination | null
): readonly PieceMaterialRow[] {
  const rows: PieceMaterialRow[] = []

  pieces.forEach(piece => {
    getActiveRequirements(piece, activeCombination).forEach(requirement => {
      const material = getRequirementMaterial(requirement)

      if (!material) {
        return
      }

      rows.push({
        materialColor: material.material.hexColor,
        materialLabel: formatMaterialLabel(requirement),
        materialLabelName: formatMaterialLabelName(material),
        pieceDxfUrl: piece.dxfUrl,
        pieceHeightMm: piece.heightMm,
        pieceId: piece.id,
        pieceLabel: `${piece.number}. ${piece.name}`,
        pieceWidthMm: piece.widthMm,
        quantity: requirement.quantity
      })
    })
  })

  return rows
}
