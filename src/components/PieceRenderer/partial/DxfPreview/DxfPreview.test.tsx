import { render, screen } from '@testing-library/react'

import type { DxfGeometry } from '@/core/utils/dxf/dxf.utils'

import { DxfPreview } from './DxfPreview'

const geometry: DxfGeometry = {
  bounds: {
    minX: 0,
    minY: 0,
    maxX: 100,
    maxY: 50,
    width: 100,
    height: 50
  },
  entities: [
    {
      type: 'line',
      start: { x: 0, y: 0 },
      end: { x: 100, y: 50 }
    },
    {
      type: 'circle',
      center: { x: 25, y: 25 },
      radius: 10
    }
  ]
}

describe('DxfPreview', () => {
  it('renders all entities with a non-scaling uniform stroke', () => {
    render(<DxfPreview geometry={geometry} strokeWidth={1} />)

    const svg = screen.getByTestId('piece-renderer-dxf')
    const group = svg.querySelector('g')
    const line = svg.querySelector('line')
    const circle = svg.querySelector('circle')

    expect(group).toHaveStyle({ strokeWidth: 'var(--piece-renderer-stroke-width, 1)' })
    expect(line).toHaveAttribute('vector-effect', 'non-scaling-stroke')
    expect(circle).toHaveAttribute('vector-effect', 'non-scaling-stroke')
  })
})
