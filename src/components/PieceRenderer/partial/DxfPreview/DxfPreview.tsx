import type { ReactElement } from 'react'

import type { DxfArcEntity, DxfEntity, DxfGeometry } from '@/core/utils/dxf.utils'

type DxfPreviewProps = {
  readonly geometry: DxfGeometry
  readonly strokeWidth: number
}

function arcPath(entity: DxfArcEntity): string {
  const startRadians = (entity.startAngle * Math.PI) / 180
  const endRadians = (entity.endAngle * Math.PI) / 180
  const startX = entity.center.x + Math.cos(startRadians) * entity.radius
  const startY = entity.center.y + Math.sin(startRadians) * entity.radius
  const endX = entity.center.x + Math.cos(endRadians) * entity.radius
  const endY = entity.center.y + Math.sin(endRadians) * entity.radius
  const delta = entity.endAngle < entity.startAngle
    ? entity.endAngle + 360 - entity.startAngle
    : entity.endAngle - entity.startAngle
  const largeArcFlag = delta > 180 ? 1 : 0

  return `M ${startX} ${startY} A ${entity.radius} ${entity.radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`
}

function renderEntity(entity: DxfEntity, index: number): ReactElement {
  if (entity.type === 'line') {
    return (
      <line
        key={index}
        vectorEffect="non-scaling-stroke"
        x1={entity.start.x}
        x2={entity.end.x}
        y1={entity.start.y}
        y2={entity.end.y}
      />
    )
  }

  if (entity.type === 'circle') {
    return (
      <circle
        key={index}
        cx={entity.center.x}
        cy={entity.center.y}
        r={entity.radius}
        vectorEffect="non-scaling-stroke"
      />
    )
  }

  if (entity.type === 'arc') {
    return <path key={index} d={arcPath(entity)} vectorEffect="non-scaling-stroke" />
  }

  const points = entity.closed
    ? [...entity.points, entity.points[0]]
    : [...entity.points]

  return (
    <polyline
      key={index}
      points={points.map(point => `${point.x},${point.y}`).join(' ')}
      vectorEffect="non-scaling-stroke"
    />
  )
}

/**
 * Renders parsed DXF geometry as a normalized SVG preview.
 *
 * @param props - DXF preview properties.
 * @returns SVG preview element.
 */
export function DxfPreview(props: DxfPreviewProps): ReactElement {
  const { geometry, strokeWidth } = props
  const { bounds } = geometry
  const width = Math.max(bounds.width, 1)
  const height = Math.max(bounds.height, 1)
  const padding = Math.max(width, height) / 300

  return (
    <svg
      aria-hidden="true"
      data-testid="piece-renderer-dxf"
      preserveAspectRatio="xMidYMid meet"
      style={{
        display: 'block',
        height: 'auto',
        overflow: 'visible',
        width: '100%'
      }}
      viewBox={`${-padding} ${-padding} ${width + padding * 2} ${height + padding * 2}`}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        transform={`translate(${-bounds.minX} ${bounds.maxY}) scale(1 -1)`}
      >
        {geometry.entities.map((entity, index) => renderEntity(entity, index))}
      </g>
    </svg>
  )
}
