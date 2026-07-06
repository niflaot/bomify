import type {
  MaterialPackingResult,
  PackablePiece,
  PackedPiece,
  PackingRect,
  UnplacedPiece
} from './material-packing.types'

type ExpandedPiece = {
  readonly id: string
  readonly instanceId: string
  readonly widthMm: number
  readonly heightMm: number
  readonly allowRotation: boolean
}

type PlacementCandidate = {
  readonly rectIndex: number
  readonly widthMm: number
  readonly heightMm: number
  readonly rotated: boolean
  readonly score: number
}

/**
 * Packs rectangular piece bounds into one material sheet.
 *
 * @param materialWidthMm - Material width in millimeters.
 * @param materialHeightMm - Material height in millimeters.
 * @param pieces - Piece definitions to pack.
 * @param gapMm - Gap between pieces in millimeters.
 * @returns Placement result and usage statistics.
 */
export function packMaterialPieces(
  materialWidthMm: number,
  materialHeightMm: number,
  pieces: readonly PackablePiece[],
  gapMm = 0
): MaterialPackingResult {
  const expandedPieces = expandPieces(pieces)
  const orderedPieces = sortPieces(expandedPieces)
  const freeRects: PackingRect[] = [{
    xMm: 0,
    yMm: 0,
    widthMm: materialWidthMm,
    heightMm: materialHeightMm
  }]
  const placed: PackedPiece[] = []
  const unplaced: UnplacedPiece[] = []

  orderedPieces.forEach(piece => {
    const candidate = findBestCandidate(piece, freeRects, gapMm)

    if (!candidate) {
      unplaced.push(toUnplacedPiece(piece))
      return
    }

    const rect = freeRects[candidate.rectIndex]
    const packedPiece: PackedPiece = {
      id: piece.id,
      instanceId: piece.instanceId,
      xMm: rect.xMm,
      yMm: rect.yMm,
      widthMm: candidate.widthMm,
      heightMm: candidate.heightMm,
      rotated: candidate.rotated
    }

    placed.push(packedPiece)
    splitFreeRects(freeRects, packedPiece, gapMm)
    pruneContainedRects(freeRects)
  })

  return {
    placed,
    unplaced,
    stats: calculateStats(materialWidthMm, materialHeightMm, placed)
  }
}

function expandPieces(pieces: readonly PackablePiece[]): ExpandedPiece[] {
  return pieces.flatMap(piece =>
    Array.from({ length: piece.quantity ?? 1 }).map((_, index) => ({
      id: piece.id,
      instanceId: `${piece.id}-${index + 1}`,
      widthMm: piece.widthMm,
      heightMm: piece.heightMm,
      allowRotation: piece.allowRotation ?? false
    }))
  )
}

function sortPieces(pieces: readonly ExpandedPiece[]): ExpandedPiece[] {
  return [...pieces].sort((left, right) => {
    const areaDelta = right.widthMm * right.heightMm - left.widthMm * left.heightMm

    if (areaDelta !== 0) {
      return areaDelta
    }

    return Math.max(right.widthMm, right.heightMm) - Math.max(left.widthMm, left.heightMm)
  })
}

function findBestCandidate(
  piece: ExpandedPiece,
  freeRects: readonly PackingRect[],
  gapMm: number
): PlacementCandidate | null {
  const candidates = piece.allowRotation && piece.widthMm !== piece.heightMm
    ? [
        { widthMm: piece.widthMm, heightMm: piece.heightMm, rotated: false },
        { widthMm: piece.heightMm, heightMm: piece.widthMm, rotated: true }
      ]
    : [{ widthMm: piece.widthMm, heightMm: piece.heightMm, rotated: false }]
  let bestCandidate: PlacementCandidate | null = null

  freeRects.forEach((rect, rectIndex) => {
    candidates.forEach(candidate => {
      if (candidate.widthMm > rect.widthMm || candidate.heightMm > rect.heightMm) {
        return
      }

      const score = scoreCandidate(rect, candidate.widthMm, candidate.heightMm, gapMm)

      if (!bestCandidate || score < bestCandidate.score) {
        bestCandidate = {
          rectIndex,
          ...candidate,
          score
        }
      }
    })
  })

  return bestCandidate
}

function scoreCandidate(rect: PackingRect, widthMm: number, heightMm: number, gapMm: number): number {
  const remainingWidth = rect.widthMm - widthMm - gapMm
  const remainingHeight = rect.heightMm - heightMm - gapMm
  const shortSide = Math.min(Math.abs(remainingWidth), Math.abs(remainingHeight))
  const longSide = Math.max(Math.abs(remainingWidth), Math.abs(remainingHeight))

  return shortSide * 100000 + longSide
}

function splitFreeRects(freeRects: PackingRect[], placed: PackedPiece, gapMm: number): void {
  const usedRect = inflatePlacedPiece(placed, gapMm)

  for (let index = freeRects.length - 1; index >= 0; index -= 1) {
    const rect = freeRects[index]

    if (!intersects(rect, usedRect)) {
      continue
    }

    freeRects.splice(index, 1, ...splitRect(rect, usedRect))
  }
}

function splitRect(rect: PackingRect, used: PackingRect): PackingRect[] {
  return [
    makeRect(rect.xMm, rect.yMm, used.xMm - rect.xMm, rect.heightMm),
    makeRect(used.xMm + used.widthMm, rect.yMm, rect.xMm + rect.widthMm - used.xMm - used.widthMm, rect.heightMm),
    makeRect(rect.xMm, rect.yMm, rect.widthMm, used.yMm - rect.yMm),
    makeRect(rect.xMm, used.yMm + used.heightMm, rect.widthMm, rect.yMm + rect.heightMm - used.yMm - used.heightMm)
  ].filter(isUsableRect)
}

function pruneContainedRects(freeRects: PackingRect[]): void {
  for (let index = freeRects.length - 1; index >= 0; index -= 1) {
    const rect = freeRects[index]
    const contained = freeRects.some((other, otherIndex) =>
      index !== otherIndex && containsRect(other, rect)
    )

    if (contained) {
      freeRects.splice(index, 1)
    }
  }
}

function inflatePlacedPiece(placed: PackedPiece, gapMm: number): PackingRect {
  return {
    xMm: placed.xMm,
    yMm: placed.yMm,
    widthMm: placed.widthMm + gapMm,
    heightMm: placed.heightMm + gapMm
  }
}

function makeRect(xMm: number, yMm: number, widthMm: number, heightMm: number): PackingRect {
  return { xMm, yMm, widthMm, heightMm }
}

function isUsableRect(rect: PackingRect): boolean {
  return rect.widthMm > 0.001 && rect.heightMm > 0.001
}

function intersects(left: PackingRect, right: PackingRect): boolean {
  return left.xMm < right.xMm + right.widthMm
    && left.xMm + left.widthMm > right.xMm
    && left.yMm < right.yMm + right.heightMm
    && left.yMm + left.heightMm > right.yMm
}

function containsRect(container: PackingRect, rect: PackingRect): boolean {
  return rect.xMm >= container.xMm
    && rect.yMm >= container.yMm
    && rect.xMm + rect.widthMm <= container.xMm + container.widthMm
    && rect.yMm + rect.heightMm <= container.yMm + container.heightMm
}

function toUnplacedPiece(piece: ExpandedPiece): UnplacedPiece {
  return {
    id: piece.id,
    instanceId: piece.instanceId,
    widthMm: piece.widthMm,
    heightMm: piece.heightMm
  }
}

function calculateStats(
  materialWidthMm: number,
  materialHeightMm: number,
  placed: readonly PackedPiece[]
): MaterialPackingResult['stats'] {
  const materialAreaMm2 = materialWidthMm * materialHeightMm
  const usedAreaMm2 = placed.reduce(
    (total, piece) => total + piece.widthMm * piece.heightMm,
    0
  )
  const wasteAreaMm2 = Math.max(materialAreaMm2 - usedAreaMm2, 0)

  return {
    materialAreaMm2,
    usedAreaMm2,
    wasteAreaMm2,
    efficiency: materialAreaMm2 === 0 ? 0 : usedAreaMm2 / materialAreaMm2
  }
}
