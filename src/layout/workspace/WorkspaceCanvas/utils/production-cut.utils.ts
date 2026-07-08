import { getSheetMarginMm } from '@/core/config/production-cut.config'
import { packMaterialPieces } from '@/core/utils/material-packing/material-packing.utils'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { buildProductionMaterialPieces } from './production-cut.requirements'
import type {
  ProductionCutSheet,
  ProductionCutSummary,
  ProductionMaterialPieces,
  ProductionPieceDraft
} from '../types/production-cut.types'
import {
  productionCutGapMm,
  productionSheetHeightCm
} from '../types/production-cut.types'

function decrementPlaced(
  pieces: readonly ProductionPieceDraft[],
  placements: ProductionCutSheet['placements']
): readonly ProductionPieceDraft[] {
  const placedCounts = placements.reduce<Map<string, number>>((counts, placement) => {
    counts.set(placement.id, (counts.get(placement.id) ?? 0) + 1)

    return counts
  }, new Map())

  return pieces
    .map(piece => ({
      ...piece,
      quantity: piece.quantity - (placedCounts.get(piece.id) ?? 0)
    }))
    .filter(piece => piece.quantity > 0)
}

function buildSheets(materialGroup: ProductionMaterialPieces): readonly ProductionCutSheet[] {
  const sheets: ProductionCutSheet[] = []
  let remaining = [...materialGroup.pieces]

  while (remaining.length > 0) {
    const result = packMaterialPieces(
      materialGroup.materialWidthCm * 10,
      productionSheetHeightCm * 10,
      remaining,
      productionCutGapMm,
      getSheetMarginMm()
    )

    if (result.placed.length === 0) {
      break
    }

    sheets.push({
      heightCm: productionSheetHeightCm,
      id: `${materialGroup.materialId}-sheet-${sheets.length + 1}`,
      index: sheets.length,
      name: `${sheets.length + 1}`,
      pieces: remaining,
      placements: result.placed,
      stats: result.stats,
      widthCm: materialGroup.materialWidthCm
    })
    remaining = [...decrementPlaced(remaining, result.placed)]
  }

  return sheets
}

function buildSummary(materialGroup: ProductionMaterialPieces): ProductionCutSummary {
  const sheets = buildSheets(materialGroup)
  const usedAreaMm2 = sheets.reduce((total, sheet) => total + sheet.stats.usedAreaMm2, 0)
  const wasteAreaMm2 = sheets.reduce((total, sheet) => total + sheet.stats.wasteAreaMm2, 0)
  const materialAreaMm2 = sheets.reduce((total, sheet) => total + sheet.stats.materialAreaMm2, 0)

  return {
    efficiency: materialAreaMm2 === 0 ? 0 : usedAreaMm2 / materialAreaMm2,
    iconKey: materialGroup.iconKey,
    lengthMeters: sheets.length * (productionSheetHeightCm / 100),
    materialColor: materialGroup.materialColor,
    materialId: materialGroup.materialId,
    materialName: materialGroup.materialName,
    sheets,
    usedAreaMm2,
    wasteAreaMm2,
    widthCm: materialGroup.materialWidthCm
  }
}

/**
 * Builds production cut summaries grouped by material for the active combination.
 *
 * @param pieces - Product pieces with material requirements.
 * @param activeCombination - Currently selected combination.
 * @param units - Number of products to cut.
 * @param labels - Workspace labels used by hover details.
 * @returns Production material summaries.
 */
export function buildProductionCutSummaries(
  pieces: readonly ProductWorkspacePiece[],
  activeCombination: ProductWorkspaceCombination | null,
  units: number,
  labels: ProductWorkspaceLabels
): readonly ProductionCutSummary[] {
  return buildProductionMaterialPieces(pieces, activeCombination, units, labels)
    .map(buildSummary)
    .filter(summary => summary.sheets.length > 0)
    .sort((left, right) => left.materialName.localeCompare(right.materialName))
}
