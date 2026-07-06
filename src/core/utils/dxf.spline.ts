import { numberValue } from './dxf.pairs'
import type { DxfPair, DxfPoint, DxfWeightedPoint } from './dxf.types'

/**
 * Collects spline control points from DXF pairs.
 *
 * @param pairs - Entity pairs.
 * @returns Control points.
 */
export function collectControlPoints(pairs: readonly DxfPair[]): DxfPoint[] {
  const points: DxfPoint[] = []
  let current: { x?: number, y?: number } | null = null

  for (const pair of pairs) {
    if (pair.code === 10) {
      pushPoint(points, current)
      current = { x: numberValue(pair) }
      continue
    }

    if (pair.code === 20 && current) {
      current.y = numberValue(pair)
    }
  }

  pushPoint(points, current)

  return points
}

/**
 * Collects spline fit points from DXF pairs.
 *
 * @param pairs - Entity pairs.
 * @returns Fit points.
 */
export function collectFitPoints(pairs: readonly DxfPair[]): DxfPoint[] {
  const points: DxfPoint[] = []
  let current: { x?: number, y?: number } | null = null

  for (const pair of pairs) {
    if (pair.code === 11) {
      pushPoint(points, current)
      current = { x: numberValue(pair) }
      continue
    }

    if (pair.code === 21 && current) {
      current.y = numberValue(pair)
    }
  }

  pushPoint(points, current)

  return points
}

/**
 * Applies rational weights to spline control points.
 *
 * @param points - Control points.
 * @param weights - DXF weights.
 * @returns Weighted control points.
 */
export function weightedControlPoints(
  points: readonly DxfPoint[],
  weights: readonly number[]
): DxfWeightedPoint[] {
  return points.map((point, index) => ({
    ...point,
    weight: weights[index] ?? 1
  }))
}

/**
 * Evaluates one point on a B-spline/NURBS curve.
 *
 * @param controlPoints - Weighted control points.
 * @param knots - Knot vector.
 * @param degree - Spline degree.
 * @param value - Parameter value.
 * @returns Evaluated point.
 */
export function evaluateSplinePoint(
  controlPoints: readonly DxfWeightedPoint[],
  knots: readonly number[],
  degree: number,
  value: number
): DxfPoint {
  const span = findKnotSpan(knots, degree, controlPoints.length, value)
  const samples = Array.from({ length: degree + 1 }).map((_, index) => {
    const point = controlPoints[span - degree + index]

    return {
      x: point.x * point.weight,
      y: point.y * point.weight,
      weight: point.weight
    }
  })

  for (let level = 1; level <= degree; level += 1) {
    for (let index = degree; index >= level; index -= 1) {
      const left = span - degree + index
      const denominator = knots[left + degree + 1 - level] - knots[left]
      const alpha = denominator === 0 ? 0 : (value - knots[left]) / denominator

      samples[index] = {
        x: (1 - alpha) * samples[index - 1].x + alpha * samples[index].x,
        y: (1 - alpha) * samples[index - 1].y + alpha * samples[index].y,
        weight: (1 - alpha) * samples[index - 1].weight + alpha * samples[index].weight
      }
    }
  }

  const point = samples[degree]
  const weight = point.weight || 1

  return {
    x: point.x / weight,
    y: point.y / weight
  }
}

function pushPoint(points: DxfPoint[], current: { x?: number, y?: number } | null): void {
  if (current?.x === undefined || current.y === undefined) {
    return
  }

  points.push({
    x: current.x,
    y: current.y
  })
}

function findKnotSpan(
  knots: readonly number[],
  degree: number,
  controlCount: number,
  value: number
): number {
  const lastControlIndex = controlCount - 1

  if (value >= knots[lastControlIndex + 1]) {
    return lastControlIndex
  }

  if (value <= knots[degree]) {
    return degree
  }

  let low = degree
  let high = lastControlIndex + 1
  let mid = Math.floor((low + high) / 2)

  while (value < knots[mid] || value >= knots[mid + 1]) {
    if (value < knots[mid]) {
      high = mid
    } else {
      low = mid
    }

    mid = Math.floor((low + high) / 2)
  }

  return mid
}
