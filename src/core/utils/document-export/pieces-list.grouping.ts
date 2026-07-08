import type {
  PieceMaterialGroup,
  PieceMaterialRow,
  PiecesListGroupBy
} from './pieces-list.types'

/**
 * Groups pieces-list rows either by material (which pieces + quantities go
 * into each material — a piece can legitimately repeat across materials)
 * or by piece (which materials + quantities that piece needs).
 *
 * @param rows - Resolved piece/material rows.
 * @param groupBy - Grouping mode.
 * @returns Groups, in first-seen order.
 */
export function groupPieceMaterialRows(
  rows: readonly PieceMaterialRow[],
  groupBy: PiecesListGroupBy
): readonly PieceMaterialGroup[] {
  const order: string[] = []
  const groups = new Map<string, PieceMaterialRow[]>()

  rows.forEach(row => {
    const key = groupBy === 'material' ? row.materialLabel : row.pieceId
    const existing = groups.get(key)

    if (existing) {
      existing.push(row)
      return
    }

    order.push(key)
    groups.set(key, [row])
  })

  return order.map(key => {
    const items = groups.get(key) ?? []
    const groupLabel = groupBy === 'material' ? key : items[0]?.pieceLabel ?? key

    return { groupLabel, items }
  })
}
