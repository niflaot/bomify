import { labels } from '@/views/ProductWorkspace/testing/product-workspace.test-fixtures'
import type {
  ProductWorkspaceCombination,
  ProductWorkspacePiece,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { buildProductionCutSummaries } from './production-cut.utils'

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

describe('buildProductionCutSummaries', () => {
  it('groups production quantities by material for the active combination', () => {
    const summaries = buildProductionCutSummaries([piece], combination, 3, labels)
    const blue = summaries.find(summary => summary.materialId === 'combination-material')
    const canvas = summaries.find(summary => summary.materialId === 'global-material')

    expect(summaries).toHaveLength(2)
    expect(blue?.sheets).toHaveLength(1)
    expect(blue?.sheets[0]?.placements).toHaveLength(3)
    expect(blue?.sheets[0]?.pieces[0]?.strokeColor).toBe('#0033ff')
    expect(blue?.sheets[0]?.pieces[0]?.tooltipDetails?.rows[0]?.label).toBe(
      'lona - Blue canvas'
    )
    expect(blue?.sheets[0]?.pieces[0]?.tooltipDetails?.rows[0]?.value).toBe(
      'Quantity: 3'
    )
    expect(canvas?.sheets).toHaveLength(1)
    expect(canvas?.sheets[0]?.placements).toHaveLength(6)
    expect(canvas?.sheets[0]?.pieces[0]?.tooltipDetails?.rows[0]?.value).toBe(
      'Quantity: 6'
    )
    expect(canvas?.lengthMeters).toBe(1)
  })
})
