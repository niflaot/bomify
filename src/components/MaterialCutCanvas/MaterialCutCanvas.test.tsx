import { render, screen } from '@testing-library/react'

import { MaterialCutCanvas } from './MaterialCutCanvas'

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

describe('MaterialCutCanvas', () => {
  it('renders material stats and packed piece instances', () => {
    const source = new File([rectangleDxf], 'piece.dxf')

    render(
      <MaterialCutCanvas
        materialHeightCm={10}
        materialWidthCm={10}
        pieces={[
          {
            id: 'front',
            name: 'Front',
            source,
            sourceType: 'dxf',
            widthMm: 50,
            heightMm: 20,
            quantity: 2
          }
        ]}
      />
    )

    expect(screen.getByText('Efficiency: 20%')).toBeInTheDocument()
    expect(screen.getByLabelText('Front front-1')).toBeInTheDocument()
    expect(screen.getByLabelText('Front front-2')).toBeInTheDocument()
  })

  it('can hide the material canvas while keeping stats visible', () => {
    render(
      <MaterialCutCanvas
        materialHeightCm={10}
        materialWidthCm={10}
        pieces={[]}
        showCanvas={false}
      />
    )

    expect(screen.getByText('Efficiency: 0%')).toBeInTheDocument()
    expect(screen.queryByTestId('metric-canvas-surface')).not.toBeInTheDocument()
  })
})
