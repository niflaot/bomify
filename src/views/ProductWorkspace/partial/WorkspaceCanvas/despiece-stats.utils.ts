import type { DespieceMaterialSheet } from './despiece-view.utils'

/**
 * Aggregated usage stats for every visible pliego.
 */
export type DespieceStats = {
  readonly efficiency: number
  readonly materialAreaMm2: number
  readonly unplacedCount: number
  readonly usedAreaMm2: number
  readonly wasteAreaMm2: number
}

/**
 * Calculates aggregate despiece stats from all visible pliegos.
 *
 * @param sheets - Despiece pliego sheets.
 * @returns Aggregate efficiency, area, and unplaced count.
 */
export function calculateDespieceStats(
  sheets: readonly DespieceMaterialSheet[]
): DespieceStats {
  const materialAreaMm2 = sheets.reduce((total, sheet) =>
    total + sheet.stats.materialAreaMm2, 0)
  const usedAreaMm2 = sheets.reduce((total, sheet) =>
    total + sheet.stats.usedAreaMm2, 0)
  const wasteAreaMm2 = sheets.reduce((total, sheet) =>
    total + sheet.stats.wasteAreaMm2, 0)

  return {
    efficiency: materialAreaMm2 === 0 ? 0 : usedAreaMm2 / materialAreaMm2,
    materialAreaMm2,
    unplacedCount: 0,
    usedAreaMm2,
    wasteAreaMm2
  }
}
