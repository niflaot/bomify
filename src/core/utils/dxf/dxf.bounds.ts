import { sampleArc } from './dxf.curves'
import type { DxfBounds, DxfEntity, DxfPoint } from './dxf.types'

/**
 * Calculates measured bounds for parsed DXF entities.
 *
 * @param entities - Parsed DXF entities.
 * @returns Entity bounds.
 */
export function calculateBounds(entities: readonly DxfEntity[]): DxfBounds {
  const points = entities.flatMap(entity => entityPoints(entity))

  if (points.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0
    }
  }

  const minX = Math.min(...points.map(point => point.x))
  const minY = Math.min(...points.map(point => point.y))
  const maxX = Math.max(...points.map(point => point.x))
  const maxY = Math.max(...points.map(point => point.y))

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  }
}

function entityPoints(entity: DxfEntity): DxfPoint[] {
  if (entity.type === 'line') {
    return [entity.start, entity.end]
  }

  if (entity.type === 'circle') {
    return [
      { x: entity.center.x - entity.radius, y: entity.center.y - entity.radius },
      { x: entity.center.x + entity.radius, y: entity.center.y + entity.radius }
    ]
  }

  if (entity.type === 'arc') {
    return sampleArc(entity)
  }

  return [...entity.points]
}
