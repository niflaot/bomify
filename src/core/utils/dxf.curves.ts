import type { DxfArcEntity, DxfBulgeVertex, DxfPoint } from './dxf.types'

/**
 * Converts an angle on a circle to a point.
 *
 * @param center - Circle center.
 * @param radius - Circle radius.
 * @param angle - Angle in degrees.
 * @returns Point on the circle.
 */
export function angleToPoint(center: DxfPoint, radius: number, angle: number): DxfPoint {
  const radians = (angle * Math.PI) / 180

  return {
    x: center.x + Math.cos(radians) * radius,
    y: center.y + Math.sin(radians) * radius
  }
}

/**
 * Samples an arc into points so its bounds can be measured.
 *
 * @param entity - Arc entity.
 * @returns Sampled arc points.
 */
export function sampleArc(entity: DxfArcEntity): DxfPoint[] {
  const start = entity.startAngle
  const rawEnd = entity.endAngle
  const end = rawEnd < start ? rawEnd + 360 : rawEnd
  const steps = Math.max(6, Math.ceil((end - start) / 15))

  return Array.from({ length: steps + 1 }).map((_, index) =>
    angleToPoint(entity.center, entity.radius, start + ((end - start) * index) / steps)
  )
}

/**
 * Samples a DXF polyline bulge segment into points.
 *
 * @param start - Segment start.
 * @param end - Segment end.
 * @param bulge - DXF bulge value.
 * @returns Sampled segment points.
 */
export function sampleBulgeSegment(start: DxfPoint, end: DxfPoint, bulge: number): DxfPoint[] {
  if (Math.abs(bulge) < 0.000001) {
    return [end]
  }

  const chordX = end.x - start.x
  const chordY = end.y - start.y
  const chord = Math.hypot(chordX, chordY)

  if (chord === 0) {
    return [end]
  }

  const theta = 4 * Math.atan(bulge)
  const radius = Math.abs(chord / (2 * Math.sin(theta / 2)))
  const unitX = chordX / chord
  const unitY = chordY / chord
  const normalX = -unitY
  const normalY = unitX
  const midX = (start.x + end.x) / 2
  const midY = (start.y + end.y) / 2
  const centerDistance = Math.sqrt(Math.max(radius ** 2 - (chord / 2) ** 2, 0))
  const direction = bulge > 0 ? 1 : -1
  const center = {
    x: midX + normalX * centerDistance * direction,
    y: midY + normalY * centerDistance * direction
  }
  const startAngle = Math.atan2(start.y - center.y, start.x - center.x)
  const steps = Math.max(6, Math.ceil(Math.abs(theta) / (Math.PI / 12)))

  return Array.from({ length: steps }).map((_, index) => {
    const ratio = (index + 1) / steps
    const angle = startAngle + theta * ratio

    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    }
  })
}

/**
 * Expands polyline vertices into drawable points.
 *
 * @param vertices - Polyline vertices.
 * @param closed - Whether the polyline is closed.
 * @returns Expanded points.
 */
export function expandPolylineVertices(vertices: readonly DxfBulgeVertex[], closed: boolean): DxfPoint[] {
  if (vertices.length === 0) {
    return []
  }

  const points: DxfPoint[] = [vertices[0].point]
  const segmentCount = closed ? vertices.length : vertices.length - 1

  for (let index = 0; index < segmentCount; index += 1) {
    const start = vertices[index]
    const end = vertices[(index + 1) % vertices.length]

    points.push(...sampleBulgeSegment(start.point, end.point, start.bulge))
  }

  return points
}
