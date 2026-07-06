import { render, screen } from '@testing-library/react'

import { MetricCanvas } from './MetricCanvas'

describe('MetricCanvas', () => {
  it('can render without the millimeter grid and with custom colors', () => {
    render(
      <MetricCanvas
        backgroundColor="#ffffff"
        borderColor="#222222"
        heightMm={100}
        showGrid={false}
        widthMm={200}
      />
    )

    const surface = screen.getByTestId('metric-canvas-surface')

    expect(surface).toHaveStyle({ backgroundColor: '#ffffff' })
    expect(surface).toHaveStyle({ border: '1px solid #222222' })
    expect(surface.style.backgroundImage).toBe('')
  })
})
