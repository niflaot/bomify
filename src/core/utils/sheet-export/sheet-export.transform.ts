import type { DxfEntity, DxfGeometry, DxfPoint } from '@/core/utils/dxf/dxf.types'

import type { ExportablePieceInstance } from './sheet-export.types'

type PointTransform = (point: DxfPoint) => DxfPoint

const minDimensionMm = 0.001

function computeFitScale(geometry: DxfGeometry, piece: ExportablePieceInstance): number {
  const rawWidth = Math.max(geometry.bounds.width, minDimensionMm)
  const rawHeight = Math.max(geometry.bounds.height, minDimensionMm)

  // Uniform scale-to-fit, centered — mirrors the `xMidYMid meet` fit used by
  // the on-screen DXF preview, and keeps circles/arcs circular (a
  // non-uniform scale would turn them into ellipses no DXF entity supports).
  return Math.min(piece.sourceWidthMm / rawWidth, piece.sourceHeightMm / rawHeight)
}

function buildPointTransform(
  geometry: DxfGeometry,
  piece: ExportablePieceInstance,
  scale: number,
  offsetXMm: number,
  offsetYMm: number
): PointTransform {
  const { bounds } = geometry
  const centerOffsetX = (piece.sourceWidthMm - bounds.width * scale) / 2
  const centerOffsetY = (piece.sourceHeightMm - bounds.height * scale) / 2

  return (point: DxfPoint): DxfPoint => {
    const normalizedX = (point.x - bounds.minX) * scale + centerOffsetX
    const normalizedY = (point.y - bounds.minY) * scale + centerOffsetY
    const rotatedX = piece.rotated ? normalizedY : normalizedX
    const rotatedY = piece.rotated ? piece.sourceWidthMm - normalizedX : normalizedY

    return {
      x: rotatedX + piece.xMm + offsetXMm,
      y: rotatedY + piece.yMm + offsetYMm
    }
  }
}

function transformEntity(
  entity: DxfEntity,
  transformPoint: PointTransform,
  scale: number,
  rotated: boolean
): DxfEntity {
  if (entity.type === 'line') {
    return {
      end: transformPoint(entity.end),
      start: transformPoint(entity.start),
      type: 'line'
    }
  }

  if (entity.type === 'circle') {
    return {
      center: transformPoint(entity.center),
      radius: entity.radius * scale,
      type: 'circle'
    }
  }

  if (entity.type === 'arc') {
    const angleShift = rotated ? -90 : 0

    return {
      center: transformPoint(entity.center),
      endAngle: entity.endAngle + angleShift,
      radius: entity.radius * scale,
      startAngle: entity.startAngle + angleShift,
      type: 'arc'
    }
  }

  return {
    closed: entity.closed,
    points: entity.points.map(transformPoint),
    type: 'polyline'
  }
}

/**
 * Transforms one piece's parsed DXF geometry into absolute sheet
 * coordinates: scale-to-fit its declared size, rotate 90° when nested
 * rotated, then translate to its packed position (plus any extra offset
 * used to stack multiple sheets in one combined document).
 *
 * @param geometry - Parsed source DXF geometry.
 * @param piece - Nested piece placement and declared size.
 * @param offsetXMm - Extra X offset (e.g. when combining sheets).
 * @param offsetYMm - Extra Y offset (e.g. when combining sheets).
 * @returns Entities positioned in the final document's coordinate space.
 */
export function transformPieceEntities(
  geometry: DxfGeometry,
  piece: ExportablePieceInstance,
  offsetXMm = 0,
  offsetYMm = 0
): DxfEntity[] {
  const scale = computeFitScale(geometry, piece)
  const transformPoint = buildPointTransform(geometry, piece, scale, offsetXMm, offsetYMm)

  return geometry.entities.map(entity => transformEntity(entity, transformPoint, scale, piece.rotated))
}
