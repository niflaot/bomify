import { parseDxfGeometry } from './dxf.utils'

describe('parseDxfGeometry', () => {
  it('measures line entities', () => {
    const geometry = parseDxfGeometry(`0
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
25
0
ENDSEC
0
EOF`)

    expect(geometry.entities).toHaveLength(1)
    expect(geometry.bounds.width).toBe(50)
    expect(geometry.bounds.height).toBe(25)
  })
})
