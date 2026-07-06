import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { PieceRenderer } from './PieceRenderer'

const rectangleDxf = `0
SECTION
2
ENTITIES
0
LWPOLYLINE
90
4
70
1
10
0
20
0
10
120
20
0
10
120
20
40
10
0
20
40
0
ENDSEC
0
EOF`

describe('PieceRenderer', () => {
  it('renders DXF geometry with measured dimensions', async () => {
    const file = new File([rectangleDxf], 'piece.dxf', {
      type: 'application/dxf'
    })

    render(<PieceRenderer source={file} />)

    await waitFor(() => {
      expect(screen.getByText('Width: 120.0 mm')).toBeInTheDocument()
    })
    expect(screen.getByText('Height: 40.0 mm')).toBeInTheDocument()
  })

  it('applies hover stroke styling when enabled', async () => {
    const file = new File([rectangleDxf], 'piece.dxf', {
      type: 'application/dxf'
    })

    render(
      <PieceRenderer
        hoverStrokeColor="#ff0000"
        hoverStrokeWidth={2}
        source={file}
        strokeColor="#111111"
        strokeWidth={1}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('piece-renderer-dxf')).toBeInTheDocument()
    })

    const figure = screen.getByLabelText('Pattern piece preview')

    expect(figure.style.getPropertyValue('--piece-renderer-stroke-width')).toBe('1')
    expect(figure.style.getPropertyValue('--piece-renderer-stroke-color')).toBe('#111111')

    fireEvent.pointerEnter(figure)
    expect(figure.style.getPropertyValue('--piece-renderer-stroke-width')).toBe('2')
    expect(figure.style.getPropertyValue('--piece-renderer-stroke-color')).toBe('#ff0000')

    fireEvent.pointerLeave(figure)
    expect(figure.style.getPropertyValue('--piece-renderer-stroke-width')).toBe('1')
    expect(figure.style.getPropertyValue('--piece-renderer-stroke-color')).toBe('#111111')
  })
})
