import type { MaterialCutCanvasPiece } from '@/components/MaterialCutCanvas'
import type { PackedPiece } from '@/core/utils/material-packing/material-packing.types'

import type { PackedMaterialSheet } from './sheet-export.mappers'
import { toExportableSheet, toExportableSheets } from './sheet-export.mappers'

function buildPiece(overrides: Partial<MaterialCutCanvasPiece> = {}): MaterialCutCanvasPiece {
  return {
    heightMm: 400,
    id: 'piece-1',
    name: 'Piece 1',
    source: '/piece-1.dxf',
    widthMm: 300,
    ...overrides
  }
}

function buildPlacement(overrides: Partial<PackedPiece> = {}): PackedPiece {
  return {
    heightMm: 400,
    id: 'piece-1',
    instanceId: 'piece-1-1',
    rotated: false,
    widthMm: 300,
    xMm: 10,
    yMm: 20,
    ...overrides
  }
}

describe('toExportableSheet', () => {
  it('maps placements to exportable pieces using the nominal sheet size', () => {
    const sheet: PackedMaterialSheet = {
      heightCm: 70,
      id: 'sheet-1',
      name: 'Hoja 1',
      pieces: [buildPiece()],
      placements: [buildPlacement()],
      widthCm: 100
    }

    const exportable = toExportableSheet(sheet)

    expect(exportable).toEqual({
      heightMm: 700,
      id: 'sheet-1',
      name: 'Hoja 1',
      pieces: [{
        dxfUrl: '/piece-1.dxf',
        instanceId: 'piece-1-1',
        rotated: false,
        sourceHeightMm: 400,
        sourceWidthMm: 300,
        xMm: 10,
        yMm: 20
      }],
      widthMm: 1000
    })
  })

  it('drops placements whose piece source is not a persisted DXF URL', () => {
    const sheet: PackedMaterialSheet = {
      heightCm: 70,
      id: 'sheet-1',
      name: 'Hoja 1',
      pieces: [buildPiece({ source: new File([], 'local.dxf') })],
      placements: [buildPlacement()],
      widthCm: 100
    }

    expect(toExportableSheet(sheet)).toBeNull()
  })

  it('tags the sheet with its group key/label when given one', () => {
    const sheet: PackedMaterialSheet = {
      heightCm: 70,
      id: 'sheet-1',
      name: 'Hoja 1',
      pieces: [buildPiece()],
      placements: [buildPlacement()],
      widthCm: 100
    }

    expect(toExportableSheet(sheet, { key: 'material-1', label: 'Lona Azul' })).toMatchObject({
      groupKey: 'material-1',
      groupLabel: 'Lona Azul'
    })
  })

  it('grows the document size for an oversized ("de largo") piece', () => {
    const sheet: PackedMaterialSheet = {
      heightCm: 70,
      id: 'sheet-1',
      name: 'Largo 1',
      pieces: [buildPiece({ heightMm: 1500, widthMm: 900 })],
      placements: [buildPlacement({ heightMm: 1500, widthMm: 900 })],
      widthCm: 100
    }

    expect(toExportableSheet(sheet)).toMatchObject({ heightMm: 1500, widthMm: 1000 })
  })
})

describe('toExportableSheets', () => {
  it('drops sheets that end up with no exportable pieces', () => {
    const emptySheet: PackedMaterialSheet = {
      heightCm: 70,
      id: 'sheet-empty',
      name: 'Empty',
      pieces: [],
      placements: [],
      widthCm: 100
    }
    const validSheet: PackedMaterialSheet = {
      heightCm: 70,
      id: 'sheet-1',
      name: 'Hoja 1',
      pieces: [buildPiece()],
      placements: [buildPlacement()],
      widthCm: 100
    }

    expect(toExportableSheets([emptySheet, validSheet])).toHaveLength(1)
  })
})
