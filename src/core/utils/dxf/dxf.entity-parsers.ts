import { expandPolylineVertices } from './dxf.curves'
import { numberValue } from './dxf.pairs'
import {
  collectControlPoints,
  collectFitPoints,
  evaluateSplinePoint,
  weightedControlPoints
} from './dxf.spline'
import type {
  DxfBulgeVertex,
  DxfCircleEntity,
  DxfEntity,
  DxfLineEntity,
  DxfPair,
  DxfPoint,
  DxfPolylineEntity
} from './dxf.types'

/**
 * Parses a DXF entity by its entity type.
 *
 * @param type - DXF entity type.
 * @param entityPairs - Entity group pairs.
 * @returns Parsed entity when supported.
 */
export function parseEntityByType(type: string, entityPairs: readonly DxfPair[]): DxfEntity | null {
  switch (type) {
    case 'LINE':
      return parseLine(entityPairs)
    case 'CIRCLE':
      return parseCircle(entityPairs)
    case 'ARC':
      return parseArc(entityPairs)
    case 'LWPOLYLINE':
    case 'POLYLINE':
      return parsePolyline(entityPairs)
    case 'SPLINE':
      return parseSplineAsPolyline(entityPairs)
    case 'ELLIPSE':
      return parseEllipseAsPolyline(entityPairs)
    default:
      return null
  }
}

function parseLine(pairs: readonly DxfPair[]): DxfLineEntity | null {
  const startX = pairs.find(pair => pair.code === 10)
  const startY = pairs.find(pair => pair.code === 20)
  const endX = pairs.find(pair => pair.code === 11)
  const endY = pairs.find(pair => pair.code === 21)

  if (!startX || !startY || !endX || !endY) {
    return null
  }

  return {
    type: 'line',
    start: { x: numberValue(startX), y: numberValue(startY) },
    end: { x: numberValue(endX), y: numberValue(endY) }
  }
}

function parseCircle(pairs: readonly DxfPair[]): DxfCircleEntity | null {
  const centerX = pairs.find(pair => pair.code === 10)
  const centerY = pairs.find(pair => pair.code === 20)
  const radius = pairs.find(pair => pair.code === 40)

  if (!centerX || !centerY || !radius) {
    return null
  }

  return {
    type: 'circle',
    center: { x: numberValue(centerX), y: numberValue(centerY) },
    radius: numberValue(radius)
  }
}

function parseArc(pairs: readonly DxfPair[]): DxfEntity | null {
  const circle = parseCircle(pairs)
  const startAngle = pairs.find(pair => pair.code === 50)
  const endAngle = pairs.find(pair => pair.code === 51)

  if (!circle || !startAngle || !endAngle) {
    return null
  }

  return {
    type: 'arc',
    center: circle.center,
    radius: circle.radius,
    startAngle: numberValue(startAngle),
    endAngle: numberValue(endAngle)
  }
}

function parsePolyline(pairs: readonly DxfPair[]): DxfPolylineEntity | null {
  const vertices: DxfBulgeVertex[] = []
  const flags = numberValue(pairs.find(pair => pair.code === 70))
  let current: { x?: number, y?: number, bulge: number } | null = null

  pairs.forEach(pair => {
    if (pair.code === 10) {
      appendCurrentVertex(vertices, current)
      current = { x: numberValue(pair), bulge: 0 }
      return
    }

    if (pair.code === 20 && current) {
      current.y = numberValue(pair)
      return
    }

    if (pair.code === 42 && current) {
      current.bulge = numberValue(pair)
    }
  })
  appendCurrentVertex(vertices, current)

  if (vertices.length < 2) {
    return null
  }

  const closed = (flags & 1) === 1

  return {
    type: 'polyline',
    points: expandPolylineVertices(vertices, closed),
    closed
  }
}

function parseSplineAsPolyline(pairs: readonly DxfPair[]): DxfPolylineEntity | null {
  const degree = numberValue(pairs.find(pair => pair.code === 71), 3)
  const knots = pairs.filter(pair => pair.code === 40).map(pair => numberValue(pair))
  const weights = pairs.filter(pair => pair.code === 41).map(pair => numberValue(pair, 1))
  const controlPoints = collectControlPoints(pairs)
  const flags = numberValue(pairs.find(pair => pair.code === 70))
  const closed = (flags & 1) === 1

  if (controlPoints.length > degree && knots.length >= controlPoints.length + degree + 1) {
    return {
      type: 'polyline',
      points: sampleSpline(controlPoints, weights, knots, degree),
      closed
    }
  }

  const fitPoints = collectFitPoints(pairs)
  const polyline = fitPoints.length >= 2 ? { points: fitPoints } : parsePolyline(pairs)

  return polyline
    ? { type: 'polyline', points: polyline.points, closed }
    : null
}

function parseEllipseAsPolyline(pairs: readonly DxfPair[]): DxfPolylineEntity | null {
  const center = readPoint(pairs, 10, 20)
  const major = readPoint(pairs, 11, 21)
  const ratio = pairs.find(pair => pair.code === 40)

  if (!center || !major || !ratio) {
    return null
  }

  const minorScale = numberValue(ratio, 1)
  const start = numberValue(pairs.find(pair => pair.code === 41), 0)
  const end = numberValue(pairs.find(pair => pair.code === 42), Math.PI * 2)
  const delta = end < start ? end + Math.PI * 2 - start : end - start
  const steps = Math.max(24, Math.ceil(delta / (Math.PI / 18)))
  const minor = { x: -major.y * minorScale, y: major.x * minorScale }
  const points = Array.from({ length: steps + 1 }).map((_, index) => {
    const theta = start + (delta * index) / steps

    return {
      x: center.x + major.x * Math.cos(theta) + minor.x * Math.sin(theta),
      y: center.y + major.y * Math.cos(theta) + minor.y * Math.sin(theta)
    }
  })

  return {
    type: 'polyline',
    points,
    closed: Math.abs(delta - Math.PI * 2) < 0.000001
  }
}

function appendCurrentVertex(
  vertices: DxfBulgeVertex[],
  current: { x?: number, y?: number, bulge: number } | null
): void {
  if (current?.x === undefined || current.y === undefined) {
    return
  }

  vertices.push({ point: { x: current.x, y: current.y }, bulge: current.bulge })
}

function sampleSpline(
  controlPoints: readonly DxfPoint[],
  weights: readonly number[],
  knots: readonly number[],
  degree: number
): DxfPoint[] {
  const start = knots[degree]
  const end = knots[controlPoints.length]
  const weightedPoints = weightedControlPoints(controlPoints, weights)
  const stepCount = Math.max(controlPoints.length * 18, 96)

  return Array.from({ length: stepCount + 1 }).map((_, index) => {
    const ratio = index / stepCount

    return evaluateSplinePoint(weightedPoints, knots, degree, start + (end - start) * ratio)
  })
}

function readPoint(pairs: readonly DxfPair[], xCode: number, yCode: number): DxfPoint | null {
  const x = pairs.find(pair => pair.code === xCode)
  const y = pairs.find(pair => pair.code === yCode)

  return x && y ? { x: numberValue(x), y: numberValue(y) } : null
}
