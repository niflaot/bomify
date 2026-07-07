import type {
  MaterialCutCanvasPiece,
  MaterialCutCanvasPieceTooltip
} from '@/components/MaterialCutCanvas'
import type { MaterialPackingStats, PackedPiece } from '@/core/utils/material-packing/material-packing.types'
import { packMaterialPieces } from '@/core/utils/material-packing/material-packing.utils'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece,
  ProductWorkspacePieceMaterialRequirement
} from '../../product-workspace.types'

/**
 * One material sheet rendered by the despiece view.
 */
export type DespieceMaterialSheet = {
  readonly id: string
  readonly heightCm: number
  readonly name: string
  readonly pieces: readonly MaterialCutCanvasPiece[]
  readonly placements: readonly PackedPiece[]
  readonly stats: MaterialPackingStats
  readonly widthCm: number
}

export const despieceGapMm = 5
export const pliegoWidthCm = 100
export const pliegoHeightCm = 70

function formatMaterialLabel(requirement: ProductWorkspacePieceMaterialRequirement): string {
  if (requirement.combinationMaterial) {
    const material = requirement.combinationMaterial.productMaterial.material

    return `${requirement.combinationMaterial.roleId} - ${material.name}`
  }

  return requirement.productMaterial?.material.name ?? ''
}

function buildTooltipDetails(
  labels: ProductWorkspaceLabels,
  piece: ProductWorkspacePiece,
  requirements: readonly ProductWorkspacePieceMaterialRequirement[]
): MaterialCutCanvasPieceTooltip {
  return {
    title: `${piece.number}. ${piece.name}`,
    rows: requirements.map(requirement => {
      const productMaterial = getRequirementMaterial(requirement)
      const material = productMaterial?.material

      return {
        color: material?.hexColor,
        iconKey: material?.iconKey,
        icon: 'material',
        label: formatMaterialLabel(requirement),
        value: `${labels.pieceQuantityLabel}: ${requirement.quantity}`
      }
    })
  }
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

  if (!activeCombination) {
    return globalRequirements
  }

  return [...combinationRequirements, ...globalRequirements]
}

function getRequirementMaterial(
  requirement: ProductWorkspacePieceMaterialRequirement
): ProductWorkspacePieceMaterialRequirement['productMaterial'] {
  return requirement.combinationMaterial?.productMaterial
    ?? requirement.productMaterial
}

function getStrokeRequirement(
  requirements: readonly ProductWorkspacePieceMaterialRequirement[]
): ProductWorkspacePieceMaterialRequirement | null {
  return requirements.find(requirement => requirement.combinationMaterial)
    ?? requirements.find(requirement => requirement.productMaterial)
    ?? null
}

function toDespiecePiece(
  labels: ProductWorkspaceLabels,
  piece: ProductWorkspacePiece,
  requirements: readonly ProductWorkspacePieceMaterialRequirement[]
): MaterialCutCanvasPiece | null {
  if (!piece.dxfUrl || requirements.length === 0) {
    return null
  }

  const strokeRequirement = getStrokeRequirement(requirements)
  const strokeMaterial = strokeRequirement
    ? getRequirementMaterial(strokeRequirement)?.material
    : null

  if (!strokeMaterial) {
    return null
  }

  return {
    heightMm: piece.heightMm,
    hoverStrokeColor: strokeMaterial.hexColor,
    hoverStrokeWidth: 1.25,
    id: piece.id,
    name: `${piece.number}. ${piece.name}`,
    quantity: 1,
    source: piece.dxfUrl,
    sourceType: 'dxf',
    strokeColor: strokeMaterial.hexColor,
    strokeWidth: 0.85,
    tooltipDetails: buildTooltipDetails(labels, piece, requirements),
    widthMm: piece.widthMm
  }
}

function buildUniqueDespiecePieces(
  pieces: readonly ProductWorkspacePiece[],
  activeCombination: ProductWorkspaceCombination | null,
  labels: ProductWorkspaceLabels
): readonly MaterialCutCanvasPiece[] {
  return pieces.flatMap(piece => {
    const requirements = getActiveRequirements(piece, activeCombination)
    const despiecePiece = toDespiecePiece(labels, piece, requirements)

    return despiecePiece ? [despiecePiece] : []
  })
}

function toPliegoSheet(
  index: number,
  pieces: readonly MaterialCutCanvasPiece[],
  placements: readonly PackedPiece[],
  stats: MaterialPackingStats
): DespieceMaterialSheet {
  return {
    heightCm: pliegoHeightCm,
    id: `pliego-${index + 1}`,
    name: `Pliego ${index + 1}`,
    pieces,
    placements,
    stats,
    widthCm: pliegoWidthCm
  }
}

function toOversizedPlacement(piece: MaterialCutCanvasPiece): PackedPiece {
  return {
    heightMm: piece.heightMm,
    id: piece.id,
    instanceId: `${piece.id}-1`,
    rotated: false,
    widthMm: piece.widthMm,
    xMm: 0,
    yMm: 0
  }
}

function toOversizedStats(piece: MaterialCutCanvasPiece): MaterialPackingStats {
  const materialAreaMm2 = pliegoWidthCm * 10 * pliegoHeightCm * 10
  const usedAreaMm2 = piece.widthMm * piece.heightMm

  return {
    efficiency: usedAreaMm2 / materialAreaMm2,
    materialAreaMm2,
    usedAreaMm2,
    wasteAreaMm2: Math.max(materialAreaMm2 - usedAreaMm2, 0)
  }
}

function splitIntoPliegos(
  pieces: readonly MaterialCutCanvasPiece[]
): readonly DespieceMaterialSheet[] {
  const sheets: DespieceMaterialSheet[] = []
  let remaining = [...pieces]

  while (remaining.length > 0) {
    const result = packMaterialPieces(
      pliegoWidthCm * 10,
      pliegoHeightCm * 10,
      remaining.map(piece => ({
        heightMm: piece.heightMm,
        id: piece.id,
        quantity: 1,
        widthMm: piece.widthMm
      })),
      despieceGapMm
    )
    const placedIds = new Set(result.placed.map(placement => placement.id))

    if (placedIds.size === 0) {
      sheets.push(toPliegoSheet(
        sheets.length,
        [remaining[0]],
        [toOversizedPlacement(remaining[0])],
        toOversizedStats(remaining[0])
      ))
      remaining = remaining.slice(1)
      continue
    }

    const sheetPieces = remaining.filter(piece => placedIds.has(piece.id))

    sheets.push(toPliegoSheet(
      sheets.length,
      sheetPieces,
      result.placed,
      result.stats
    ))
    remaining = remaining.filter(piece => !placedIds.has(piece.id))
  }

  return sheets
}

/**
 * Groups active piece requirements into material sheets for the despiece view.
 *
 * @param pieces - Product pieces with material requirements.
 * @param activeCombination - Currently selected combination.
 * @param labels - Workspace labels used in hover copy.
 * @returns Material sheets ready for packing.
 */
export function buildDespieceSheets(
  pieces: readonly ProductWorkspacePiece[],
  activeCombination: ProductWorkspaceCombination | null,
  labels: ProductWorkspaceLabels
): readonly DespieceMaterialSheet[] {
  return splitIntoPliegos(buildUniqueDespiecePieces(pieces, activeCombination, labels))
}
