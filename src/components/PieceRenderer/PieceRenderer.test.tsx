import { render, screen, waitFor } from '@testing-library/react'

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
})
