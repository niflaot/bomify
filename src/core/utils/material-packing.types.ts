/**
 * Piece input used by the material packing algorithm.
 */
export type PackablePiece = {
  readonly id: string
  readonly widthMm: number
  readonly heightMm: number
  readonly quantity?: number
  readonly allowRotation?: boolean
}

/**
 * One placed piece instance inside a material sheet.
 */
export type PackedPiece = {
  readonly id: string
  readonly instanceId: string
  readonly xMm: number
  readonly yMm: number
  readonly widthMm: number
  readonly heightMm: number
  readonly rotated: boolean
}

/**
 * One unplaced piece instance.
 */
export type UnplacedPiece = {
  readonly id: string
  readonly instanceId: string
  readonly widthMm: number
  readonly heightMm: number
}

/**
 * Calculated material usage statistics.
 */
export type MaterialPackingStats = {
  readonly materialAreaMm2: number
  readonly usedAreaMm2: number
  readonly wasteAreaMm2: number
  readonly efficiency: number
}

/**
 * Full packing result.
 */
export type MaterialPackingResult = {
  readonly placed: readonly PackedPiece[]
  readonly unplaced: readonly UnplacedPiece[]
  readonly stats: MaterialPackingStats
}

export type PackingRect = {
  readonly xMm: number
  readonly yMm: number
  readonly widthMm: number
  readonly heightMm: number
}
