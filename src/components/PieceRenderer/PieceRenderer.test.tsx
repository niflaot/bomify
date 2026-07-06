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
    const group = screen.getByTestId('piece-renderer-dxf').querySelector('g')
    const stage = figure.querySelector('div') as HTMLElement

    expect(group).toHaveAttribute('stroke-width', '1')
    fireEvent.mouseEnter(figure)
    expect(group).toHaveAttribute('stroke-width', '2')
    expect(stage).toHaveStyle({ color: '#ff0000' })
  })
})
