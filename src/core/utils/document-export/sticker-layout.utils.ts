/**
 * Sticker sheet dimensions used by both the on-screen preview and the
 * downloaded PDF, so the two can never drift apart.
 */
export type StickerLayoutInput = {
  readonly stickerWidthMm: number
  readonly stickerHeightMm: number
  readonly gapMm: number
  readonly pageWidthMm: number
  readonly pageHeightMm: number
  readonly marginMm: number
}

/**
 * Computed grid of stickers that fits one page.
 */
export type StickerLayout = {
  readonly columns: number
  readonly rows: number
  readonly capacity: number
}

/**
 * Computes how many sticker columns/rows fit one page for a given sticker
 * size, gap, and page margin.
 *
 * @param input - Sticker and page dimensions.
 * @returns The sticker grid that fits one page.
 */
export function computeStickerLayout(input: StickerLayoutInput): StickerLayout {
  const { gapMm, marginMm, pageHeightMm, pageWidthMm, stickerHeightMm, stickerWidthMm } = input
  const usableWidthMm = pageWidthMm - marginMm * 2
  const usableHeightMm = pageHeightMm - marginMm * 2
  const columns = Math.max(1, Math.floor((usableWidthMm + gapMm) / (stickerWidthMm + gapMm)))
  const rows = Math.max(1, Math.floor((usableHeightMm + gapMm) / (stickerHeightMm + gapMm)))

  return { columns, rows, capacity: columns * rows }
}

/**
 * Splits a flat list of stickers into pages, `capacity` stickers per page.
 *
 * @param items - Stickers to paginate.
 * @param capacity - Stickers per page.
 * @returns One array of stickers per page.
 */
export function paginateStickers<T>(items: readonly T[], capacity: number): readonly (readonly T[])[] {
  if (items.length === 0) {
    return []
  }

  const pages: T[][] = []

  for (let index = 0; index < items.length; index += capacity) {
    pages.push(items.slice(index, index + capacity) as T[])
  }

  return pages
}
