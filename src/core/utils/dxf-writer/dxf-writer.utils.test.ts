import type { DxfEntity } from '@/core/utils/dxf/dxf.types'

import { serializeDxfDocument } from './dxf-writer.utils'

function extractEntitiesSection(document: string): string {
  const start = document.indexOf('2\nENTITIES')
  const end = document.indexOf('0\nENDSEC', start)

  return document.slice(start, end)
}

describe('serializeDxfDocument', () => {
  it('produces a full document with a millimeter header and an empty ENTITIES section', () => {
    const document = serializeDxfDocument([])

    expect(document).toContain('$ACADVER')
    expect(document).toContain('$INSUNITS\n70\n4\n')
    expect(extractEntitiesSection(document)).not.toContain('0\nLINE')
    expect(document.trim().endsWith('EOF')).toBe(true)
  })

  it('writes a line entity on its layer with its coordinates', () => {
    const entities: DxfEntity[] = [{
      type: 'line',
      start: { x: 11, y: 22 },
      end: { x: 33, y: 44 }
    }]

    const section = extractEntitiesSection(serializeDxfDocument([{ layer: 'HOJA_1', entities }]))

    expect(section).toContain('0\nLINE')
    expect(section).toContain('8\nHOJA_1')
    expect(section).toContain('10\n11\n20\n22\n')
    expect(section).toContain('11\n33\n21\n44\n')
  })

  it('writes a circle entity with its center and radius', () => {
    const entities: DxfEntity[] = [{
      type: 'circle',
      center: { x: 3, y: 4 },
      radius: 2
    }]

    const section = extractEntitiesSection(serializeDxfDocument([{ layer: 'HOJA_1', entities }]))

    expect(section).toContain('0\nCIRCLE')
    expect(section).toContain('10\n3\n20\n4\n')
    expect(section).toContain('40\n2\n')
  })

  it('writes an arc entity with its angles', () => {
    const entities: DxfEntity[] = [{
      type: 'arc',
      center: { x: 0, y: 0 },
      radius: 5,
      startAngle: 12,
      endAngle: 98
    }]

    const section = extractEntitiesSection(serializeDxfDocument([{ layer: 'HOJA_1', entities }]))

    expect(section).toContain('0\nARC')
    expect(section).toContain('50\n12\n')
    expect(section).toContain('51\n98\n')
  })

  it('writes a polyline as a closed LWPOLYLINE with every vertex', () => {
    const entities: DxfEntity[] = [{
      type: 'polyline',
      points: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
      closed: true
    }]

    const section = extractEntitiesSection(serializeDxfDocument([{ layer: 'HOJA_1', entities }]))

    expect(section).toContain('0\nLWPOLYLINE')
    expect(section).toContain('70\n1\n')
    expect(section).toContain('10\n0\n20\n0\n')
    expect(section).toContain('10\n1\n20\n1\n')
  })

  it('declares one layer per group, in order', () => {
    const document = serializeDxfDocument([
      { layer: 'HOJA_1', entities: [{ type: 'circle', center: { x: 0, y: 0 }, radius: 1 }] },
      { layer: 'HOJA_2', entities: [{ type: 'circle', center: { x: 0, y: 0 }, radius: 2 }] }
    ])
    const section = extractEntitiesSection(document)
    const firstIndex = section.indexOf('HOJA_1')
    const secondIndex = section.indexOf('HOJA_2')

    expect(firstIndex).toBeGreaterThanOrEqual(0)
    expect(secondIndex).toBeGreaterThan(firstIndex)
  })

  it('points $CLAYER at the last layer instead of the empty default "0" layer', () => {
    const document = serializeDxfDocument([
      { layer: 'HOJA_1', entities: [{ type: 'circle', center: { x: 0, y: 0 }, radius: 1 }] }
    ])

    expect(document).toContain('$CLAYER\n8\nHOJA_1\n')
  })

  it('gives every layer a thin, explicit lineweight instead of an unset default', () => {
    const document = serializeDxfDocument([
      { layer: 'HOJA_1', entities: [{ type: 'circle', center: { x: 0, y: 0 }, radius: 1 }] }
    ])

    expect(document).not.toContain('370\n0\n')
    expect(document).toContain('370\n25\n')
  })
})
