import { render, screen, waitFor } from '@testing-library/react'

import type { PackedPiece } from '@/core/utils/material-packing/material-packing.types'

import type { MaterialCutCanvasLabels, MaterialCutCanvasPiece } from '../../material-cut-canvas.types'
import { PlacedMaterialPiece } from './PlacedMaterialPiece'

const labels: MaterialCutCanvasLabels = {
  efficiency: 'Efficiency',
  fallbackError: 'Could not render piece',
  height: 'Height',
  loading: 'Loading',
  piece: 'Piece',
  unplaced: 'Unplaced',
  used: 'Used',
  waste: 'Waste',
  width: 'Width'
}

const rectangleDxf = `0
SECTION
2
ENTITIES
0
LINE
10
0
20
0
11
50
21
20
0
ENDSEC
0
EOF`

const placement: PackedPiece = {
  heightMm: 20,
  id: 'front',
  instanceId: 'front-1',
  rotated: false,
  widthMm: 50,
  xMm: 10,
  yMm: 20
}

function makePiece(): MaterialCutCanvasPiece {
  return {
    heightMm: 20,
    id: 'front',
    name: 'Front',
    source: new File([rectangleDxf], 'front.dxf'),
    sourceType: 'dxf',
    widthMm: 50
  }
}

describe('PlacedMaterialPiece', () => {
  it('positions a packed piece while preserving its own renderer', async () => {
    render(
      <PlacedMaterialPiece
        defaultHoverEnabled
        defaultStrokeWidth={1}
        labels={labels}
        piece={makePiece()}
        pixelsPerMm={0.6}
        placement={placement}
        showPieceBounds
      />
    )

    const wrapper = screen.getByLabelText('Front front-1')

    expect(wrapper).toHaveStyle({
      height: '12px',
      position: 'absolute',
      transform: 'translate3d(6px, 12px, 0)',
      width: '30px'
    })

    await waitFor(() => {
      expect(screen.getByTestId('piece-renderer-dxf')).toBeInTheDocument()
    })
  })
})
