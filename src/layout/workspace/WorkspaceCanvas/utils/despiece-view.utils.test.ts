import { labels } from '../../product-workspace.test-fixtures'
import type {
  ProductWorkspaceCombination,
  ProductWorkspacePiece,
  ProductWorkspaceProductMaterial
} from '../../product-workspace.types'
import { buildDespieceSheets } from './despiece-view.utils'

const globalMaterial: ProductWorkspaceProductMaterial = {
  id: 'global-material',
  material: {
    hexColor: '#111111',
    iconKey: 'SwatchBook',
    id: 'material-one',
    name: 'Canvas',
    updatedAt: '2026-07-06T12:00:00.000Z',
    widthCm: 140
  },
  updatedAt: '2026-07-06T12:00:00.000Z'
}

const combinationMaterial: ProductWorkspaceProductMaterial = {
  id: 'combination-material',
  material: {
    hexColor: '#0033ff',
    iconKey: 'SwatchBook',
    id: 'material-two',
    name: 'Blue canvas',
    updatedAt: '2026-07-06T12:00:00.000Z',
    widthCm: 140
  },
  updatedAt: '2026-07-06T12:00:00.000Z'
}

const combination: ProductWorkspaceCombination = {
  hexColor: '#0033ff',
  id: 'combination-one',
  materialAssignments: [{
    id: 'assignment-one',
    productMaterial: combinationMaterial,
    roleId: 'lona'
  }],
  name: 'Blue',
  updatedAt: '2026-07-06T12:00:00.000Z'
}

const piece: ProductWorkspacePiece = {
  dxfFileName: 'front.dxf',
  dxfUrl: '/front.dxf',
  heightMm: 100,
  id: 'piece-one',
  materialRequirements: [
    {
      combinationMaterial: null,
      id: 'global-requirement',
      productMaterial: globalMaterial,
      quantity: 2
    },
    {
      combinationMaterial: combination.materialAssignments[0],
      id: 'combination-requirement',
      productMaterial: null,
      quantity: 1
    }
  ],
  name: 'Front',
  number: 1,
  updatedAt: '2026-07-06T12:00:00.000Z',
  widthMm: 300
}

describe('buildDespieceSheets', () => {
  it('uses the active combination material before global material', () => {
    const sheets = buildDespieceSheets([piece], combination, labels)

    expect(sheets).toHaveLength(1)
    expect(sheets[0]?.id).toBe('pliego-1')
    expect(sheets[0]?.widthCm).toBe(100)
    expect(sheets[0]?.heightCm).toBe(70)
    expect(sheets[0]?.pieces).toHaveLength(1)
    expect(sheets[0]?.placements).toHaveLength(1)
    expect(sheets[0]?.pieces[0]?.quantity).toBe(1)
    expect(sheets[0]?.pieces[0]?.strokeColor).toBe('#0033ff')
    expect(sheets[0]?.pieces[0]?.fillColor).toBeUndefined()
    expect(sheets[0]?.pieces[0]?.tooltipDetails?.rows).toHaveLength(2)
    expect(sheets[0]?.pieces[0]?.tooltipDetails?.rows[0]?.iconKey).toBe('SwatchBook')
    expect(sheets[0]?.pieces[0]?.tooltipDetails?.rows[0]?.label).toBe('lona - Blue canvas')
    expect(sheets[0]?.pieces[0]?.tooltipDetails?.rows[1]?.label).toBe('Canvas')
  })

  it('falls back to global requirements without an active combination', () => {
    const sheets = buildDespieceSheets([piece], null, labels)

    expect(sheets).toHaveLength(1)
    expect(sheets[0]?.id).toBe('pliego-1')
    expect(sheets[0]?.pieces[0]?.quantity).toBe(1)
    expect(sheets[0]?.pieces[0]?.strokeColor).toBe('#111111')
    expect(sheets[0]?.pieces[0]?.tooltipDetails?.rows[0]?.value).toBe('Quantity: 2')
  })
})
