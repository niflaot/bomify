import type {
  MaterialCutCanvasPiece
} from '@/components/MaterialCutCanvas'
import type { MaterialIconKey } from '@/core/constants/material-icons.constants'
import type { MaterialPackingStats, PackedPiece } from '@/core/utils/material-packing/material-packing.types'

/**
 * Material piece with the required production quantity.
 */
export type ProductionPieceDraft = MaterialCutCanvasPiece & {
  readonly quantity: number
}

/**
 * One material grouped with its production pieces.
 */
export type ProductionMaterialPieces = {
  readonly materialColor: string
  readonly materialId: string
  readonly materialName: string
  readonly materialPriceCop: number | null
  readonly materialWidthCm: number
  readonly iconKey: MaterialIconKey
  readonly pieces: readonly ProductionPieceDraft[]
}

/**
 * One production sheet for a single material.
 */
export type ProductionCutSheet = {
  readonly heightCm: number
  readonly id: string
  readonly index: number
  readonly name: string
  readonly pieces: readonly MaterialCutCanvasPiece[]
  readonly placements: readonly PackedPiece[]
  readonly stats: MaterialPackingStats
  readonly widthCm: number
}

/**
 * Full production consumption summary for one material.
 */
export type ProductionCutSummary = {
  readonly efficiency: number
  readonly iconKey: MaterialIconKey
  readonly lengthMeters: number
  readonly materialColor: string
  readonly materialId: string
  readonly materialName: string
  readonly materialPriceCop: number | null
  readonly sheets: readonly ProductionCutSheet[]
  readonly usedAreaMm2: number
  readonly wasteAreaMm2: number
  readonly widthCm: number
}

export const productionCutGapMm = 5
export const productionSheetHeightCm = 100
