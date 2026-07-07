const defaultSheetMarginMm = 10

/**
 * Reads the configured laser-safe margin kept empty around every material
 * sheet edge. This border is never packed with pieces and is counted as
 * waste, so the laser has room to cut without touching the sheet edge.
 *
 * @returns Sheet margin in millimeters.
 */
export function getSheetMarginMm(): number {
  const raw = process.env.NEXT_PUBLIC_SHEET_MARGIN_MM
  const parsed = raw ? Number(raw) : NaN

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultSheetMarginMm
}
