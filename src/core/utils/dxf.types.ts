/**
 * Two-dimensional point in the DXF source coordinate system.
 */
export type DxfPoint = {
  readonly x: number
  readonly y: number
}

/**
 * Straight DXF segment.
 */
export type DxfLineEntity = {
  readonly type: 'line'
  readonly start: DxfPoint
  readonly end: DxfPoint
}

/**
 * Circular DXF entity.
 */
export type DxfCircleEntity = {
  readonly type: 'circle'
  readonly center: DxfPoint
  readonly radius: number
}

/**
 * Circular arc DXF entity.
 */
export type DxfArcEntity = {
  readonly type: 'arc'
  readonly center: DxfPoint
  readonly radius: number
  readonly startAngle: number
  readonly endAngle: number
}

/**
 * Polyline-style DXF entity, including sampled spline/ellipse curves.
 */
export type DxfPolylineEntity = {
  readonly type: 'polyline'
  readonly points: readonly DxfPoint[]
  readonly closed: boolean
}

/**
 * Renderable DXF entity supported by the piece renderer.
 */
export type DxfEntity =
  | DxfLineEntity
  | DxfCircleEntity
  | DxfArcEntity
  | DxfPolylineEntity

/**
 * Measured geometry bounds in the DXF source coordinate system.
 */
export type DxfBounds = {
  readonly minX: number
  readonly minY: number
  readonly maxX: number
  readonly maxY: number
  readonly width: number
  readonly height: number
}

/**
 * Parsed DXF geometry and its measured bounds.
 */
export type DxfGeometry = {
  readonly entities: readonly DxfEntity[]
  readonly bounds: DxfBounds
}

/**
 * Raw DXF group code and value pair.
 */
export type DxfPair = {
  readonly code: number
  readonly value: string
}

/**
 * Polyline point with optional bulge arc data.
 */
export type DxfBulgeVertex = {
  readonly point: DxfPoint
  readonly bulge: number
}

/**
 * Spline control point with rational weight.
 */
export type DxfWeightedPoint = DxfPoint & {
  readonly weight: number
}
