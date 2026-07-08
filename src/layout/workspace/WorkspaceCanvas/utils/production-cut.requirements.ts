import type {
  MaterialCutCanvasPieceTooltip
} from '@/components/MaterialCutCanvas'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece,
  ProductWorkspacePieceMaterialRequirement,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'
import type { ProductionMaterialPieces, ProductionPieceDraft } from '../types/production-cut.types'

type MaterialDraft = {
  readonly material: ProductWorkspaceProductMaterial
  readonly piece: ProductWorkspacePiece
  quantity: number
  roles: string[]
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100
}

function formatRequirementLabel(requirement: ProductWorkspacePieceMaterialRequirement): string {
  if (requirement.combinationMaterial) {
    return `${requirement.combinationMaterial.roleId} - ${requirement.combinationMaterial.productMaterial.material.name}`
  }

  return requirement.productMaterial?.material.name ?? ''
}

function getRequirementMaterial(
  requirement: ProductWorkspacePieceMaterialRequirement
): ProductWorkspaceProductMaterial | null {
  return requirement.combinationMaterial?.productMaterial
    ?? requirement.productMaterial
    ?? null
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

function buildTooltip(
  labels: ProductWorkspaceLabels,
  material: ProductWorkspaceProductMaterial,
  piece: ProductWorkspacePiece,
  quantity: number,
  roles: readonly string[]
): MaterialCutCanvasPieceTooltip {
  return {
    title: `${piece.number}. ${piece.name}`,
    rows: [{
      color: material.material.hexColor,
      icon: 'material',
      iconKey: material.material.iconKey,
      label: roles.join(', '),
      value: `${labels.pieceQuantityLabel}: ${quantity}`
    }, {
      icon: 'piece',
      label: labels.pieces,
      value: `${roundToTwoDecimals(piece.widthMm / 10)} x ${roundToTwoDecimals(piece.heightMm / 10)} cm`
    }]
  }
}

function addDraft(
  groups: Map<string, Map<string, MaterialDraft>>,
  material: ProductWorkspaceProductMaterial,
  piece: ProductWorkspacePiece,
  quantity: number,
  role: string
): void {
  const materialGroup = groups.get(material.id) ?? new Map()
  const current = materialGroup.get(piece.id)

  if (current) {
    current.quantity += quantity
    current.roles.push(role)
  } else {
    materialGroup.set(piece.id, {
      material,
      piece,
      quantity,
      roles: [role]
    })
  }

  groups.set(material.id, materialGroup)
}

function buildMaterialGroups(
  pieces: readonly ProductWorkspacePiece[],
  activeCombination: ProductWorkspaceCombination | null,
  units: number
): Map<string, Map<string, MaterialDraft>> {
  const groups = new Map<string, Map<string, MaterialDraft>>()

  pieces.forEach(piece => {
    if (!piece.dxfUrl) {
      return
    }

    getActiveRequirements(piece, activeCombination).forEach(requirement => {
      const material = getRequirementMaterial(requirement)

      if (material) {
        addDraft(groups, material, piece, requirement.quantity * units, formatRequirementLabel(requirement))
      }
    })
  })

  return groups
}

function toProductionPiece(
  labels: ProductWorkspaceLabels,
  draft: MaterialDraft
): ProductionPieceDraft {
  return {
    heightMm: draft.piece.heightMm,
    hoverStrokeColor: draft.material.material.hexColor,
    hoverStrokeWidth: 1.25,
    id: draft.piece.id,
    name: `${draft.piece.number}. ${draft.piece.name}`,
    quantity: draft.quantity,
    source: draft.piece.dxfUrl ?? '',
    sourceType: 'dxf',
    strokeColor: draft.material.material.hexColor,
    strokeWidth: 0.85,
    tooltipDetails: buildTooltip(labels, draft.material, draft.piece, draft.quantity, draft.roles),
    widthMm: draft.piece.widthMm
  }
}

function toMaterialPieces(
  labels: ProductWorkspaceLabels,
  drafts: readonly MaterialDraft[]
): ProductionMaterialPieces | null {
  const material = drafts[0]?.material

  if (!material) {
    return null
  }

  return {
    iconKey: material.material.iconKey,
    materialColor: material.material.hexColor,
    materialId: material.id,
    materialName: material.material.name,
    materialPriceCop: material.material.priceCop,
    materialWidthCm: material.material.widthCm,
    pieces: drafts.map(draft => toProductionPiece(labels, draft))
  }
}

/**
 * Builds material-grouped production pieces for the active combination.
 *
 * @param pieces - Product pieces with material requirements.
 * @param activeCombination - Currently selected combination.
 * @param units - Number of products to cut.
 * @param labels - Workspace labels used by hover details.
 * @returns Material groups with production pieces.
 */
export function buildProductionMaterialPieces(
  pieces: readonly ProductWorkspacePiece[],
  activeCombination: ProductWorkspaceCombination | null,
  units: number,
  labels: ProductWorkspaceLabels
): readonly ProductionMaterialPieces[] {
  return [...buildMaterialGroups(pieces, activeCombination, units).values()]
    .map(group => toMaterialPieces(labels, [...group.values()]))
    .filter((group): group is ProductionMaterialPieces => Boolean(group))
}
