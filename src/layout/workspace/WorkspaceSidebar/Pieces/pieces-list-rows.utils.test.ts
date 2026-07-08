import type {
  ProductWorkspaceCombination,
  ProductWorkspacePiece,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'

import { buildPieceMaterialRows } from './pieces-list-rows.utils'

const globalMaterial: ProductWorkspaceProductMaterial = {
  id: 'global-material',
  material: {
    hexColor: '#111111',
    iconKey: 'SwatchBook',
    id: 'material-one',
    labelName: null,
    name: 'Canvas',
    priceCop: null,
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
    labelName: 'Blue',
    name: 'Blue canvas',
    priceCop: null,
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

describe('buildPieceMaterialRows', () => {
  it('resolves global and active combination requirements', () => {
    const rows = buildPieceMaterialRows([piece], combination)

    expect(rows).toEqual([
      {
        materialColor: '#0033ff',
        materialLabel: 'lona - Blue canvas',
        materialLabelName: 'Blue',
        pieceDxfUrl: '/front.dxf',
        pieceHeightMm: 100,
        pieceId: 'piece-one',
        pieceLabel: '1. Front',
        pieceWidthMm: 300,
        quantity: 1
      },
      {
        materialColor: '#111111',
        materialLabel: 'Canvas',
        materialLabelName: 'Canvas',
        pieceDxfUrl: '/front.dxf',
        pieceHeightMm: 100,
        pieceId: 'piece-one',
        pieceLabel: '1. Front',
        pieceWidthMm: 300,
        quantity: 2
      }
    ])
  })

  it('drops combination-scoped requirements when there is no active combination', () => {
    const rows = buildPieceMaterialRows([piece], null)

    expect(rows).toEqual([{
      materialColor: '#111111',
      materialLabel: 'Canvas',
      materialLabelName: 'Canvas',
      pieceDxfUrl: '/front.dxf',
      pieceHeightMm: 100,
      pieceId: 'piece-one',
      pieceLabel: '1. Front',
      pieceWidthMm: 300,
      quantity: 2
    }])
  })
})
