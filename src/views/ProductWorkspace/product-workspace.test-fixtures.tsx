import { render } from '@testing-library/react'

import { ProductWorkspace } from './ProductWorkspace'
import type {
  ProductWorkspaceCombinationActions,
  ProductWorkspaceLabels,
  ProductWorkspaceMaterialActions,
  ProductWorkspacePieceActions
} from './product-workspace.types'

export const labels: ProductWorkspaceLabels = {
  addCombination: 'Add combination',
  addCombinationMaterial: 'Add material role',
  addMaterial: 'Add material',
  addPiece: 'Add piece',
  cancel: 'Cancel',
  canvasEmptyDescription: 'Canvas placeholder description.',
  canvasEmptyTitle: 'Canvas placeholder',
  canvasEfficiency: 'Efficiency',
  canvasFallbackError: 'Could not render piece',
  canvasLabel: 'Product canvas',
  canvasLoadingPiece: 'Loading piece...',
  canvasUnplaced: 'Unplaced',
  canvasUsed: 'Used',
  canvasWaste: 'Waste',
  closeDialog: 'Close dialog',
  combinationColorLabel: 'Hex color',
  combinationCreateTitle: 'New combination',
  combinationDeleteDescription: 'Delete confirmation.',
  combinationDeleteTitle: 'Delete combination',
  combinationEmptyDescription: 'Create a combination.',
  combinationEmptyTitle: 'No combinations yet',
  combinationLabel: 'Combination',
  combinationMaterialAssignmentsLabel: 'Material roles',
  combinationMaterialEmptyDescription: 'Attach materials first.',
  combinationMaterialMaterialLabel: 'Material',
  combinationMaterialRoleLabel: 'Role id',
  combinationMaterialToggleLabel: 'Toggle assigned materials',
  combinationNameLabel: 'Name',
  combinationNamePlaceholder: 'Leather standard',
  combinations: 'Combinations',
  combinationsPanelDescription: 'Combination panel.',
  createCatalogMaterial: 'Create catalog material',
  createCombination: 'Create combination',
  createPiece: 'Create piece',
  deleteCombination: 'Delete',
  deleteMaterial: 'Remove',
  deletePiece: 'Delete',
  deleting: 'Deleting',
  despieceView: 'Despiece',
  editCombination: 'Edit',
  editPiece: 'Edit',
  export: 'Export',
  home: 'Products home',
  materialCatalogEmptyDescription: 'No materials match.',
  materialCatalogSearchLabel: 'Search materials',
  materialCatalogSearchPlaceholder: 'Search material catalog',
  materialColorLabel: 'Color',
  materialDeleteDescription: 'Remove only from this product.',
  materialDeleteTitle: 'Remove material',
  materialEmptyDescription: 'Attach a material.',
  materialEmptyTitle: 'No materials attached',
  materialIconLabel: 'Icon',
  materialIconSearchLabel: 'Search icons',
  materialIconSearchPlaceholder: 'Search Lucide icons',
  materialNameLabel: 'Name',
  materialNamePlaceholder: 'Canvas',
  materialSelectLabel: 'Material',
  materialWidthLabel: 'Width in cm',
  materialWidthPlaceholder: '140',
  materials: 'Materials',
  materialsPanelDescription: 'Materials panel.',
  newCatalogMaterial: 'New material',
  noCombination: 'No combinations',
  pieceAddMaterialRequirement: 'Add material',
  pieceCombinationScopeEmptyDescription: 'Assign roles first.',
  pieceDeleteDescription: 'Delete piece confirmation.',
  pieceDeleteTitle: 'Delete piece',
  pieceDxfChooseAction: 'Choose DXF',
  pieceDxfCurrentLabel: 'Current DXF',
  pieceDxfDropHint: 'Drag a DXF here.',
  pieceDxfInvalidFile: 'Choose a .dxf file.',
  pieceDxfLabel: 'DXF file',
  pieceDxfPreviewLabel: 'DXF preview',
  pieceDxfSelectedLabel: 'Selected DXF',
  pieceEmptyDescription: 'Upload a piece.',
  pieceEmptyTitle: 'No pieces yet',
  pieceGlobalScopeEmptyDescription: 'Attach materials first.',
  pieceGlobalScopeLabel: 'Global',
  pieceHeightLabel: 'Height in cm',
  pieceMaterialsLabel: 'Material quantities',
  pieceNameLabel: 'Name',
  pieceNamePlaceholder: 'Front pocket',
  pieceNumberLabel: 'Number',
  pieceQuantityLabel: 'Quantity',
  pieceRemoveMaterialRequirement: 'Remove material',
  pieceReplaceDxfLabel: 'Replace DXF file',
  pieceSave: 'Save piece',
  pieceScopeAllLabel: 'All combinations',
  pieceWidthLabel: 'Width in cm',
  pieces: 'Pieces',
  piecesPanelDescription: 'Pieces panel.',
  product: 'Product',
  productPanelDescription: 'Product panel.',
  removeCombinationMaterial: 'Remove material role',
  saveCombination: 'Save combination',
  saveMaterial: 'Save material',
  saving: 'Saving',
  selectExistingMaterial: 'Use catalog',
  sidebarTitle: 'Workspace panel',
  stickers: 'Stickers',
  stickersPanelDescription: 'Stickers panel.',
  updated: 'Updated',
  uploads: 'Uploads',
  uploadsPanelDescription: 'Uploads panel.',
  viewLabel: 'View',
  workspace: 'Workspace',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  zoomReset: 'Reset zoom'
}

const product = {
  description: 'A product',
  id: 'product-one',
  name: 'Explorer',
  photoUrl: null,
  updatedAt: '2026-07-06T12:00:00.000Z'
}

const combinationActions: ProductWorkspaceCombinationActions = {
  create: async () => ({ status: 'success' }),
  delete: async () => ({ status: 'success' }),
  update: async () => ({ status: 'success' })
}

const catalogMaterials = [
  {
    hexColor: '#222222',
    iconKey: 'SwatchBook' as const,
    id: 'material-one',
    name: 'Canvas',
    updatedAt: '2026-07-06T12:00:00.000Z',
    widthCm: 140
  }
]

const productMaterials = [
  {
    id: 'product-material-one',
    material: catalogMaterials[0],
    updatedAt: '2026-07-06T12:00:00.000Z'
  }
]

const combinations = [
  {
    hexColor: '#111111',
    id: 'combination-one',
    materialAssignments: [
      {
        id: 'assignment-one',
        productMaterial: productMaterials[0],
        roleId: 'lona'
      }
    ],
    name: 'Leather standard',
    updatedAt: '2026-07-06T12:00:00.000Z'
  }
]

const materialActions: ProductWorkspaceMaterialActions = {
  add: async () => ({ status: 'success' }),
  delete: async () => ({ status: 'success' })
}

const pieceActions: ProductWorkspacePieceActions = {
  create: async () => ({ status: 'success' }),
  delete: async () => ({ status: 'success' }),
  update: async () => ({ status: 'success' })
}

const pieces = [
  {
    dxfFileName: 'front-pocket.dxf',
    dxfUrl: null,
    heightMm: 100,
    id: 'piece-one',
    materialRequirements: [
      {
        combinationMaterial: null,
        id: 'piece-requirement-one',
        productMaterial: productMaterials[0],
        quantity: 2
      },
      {
        combinationMaterial: combinations[0].materialAssignments[0],
        id: 'piece-requirement-two',
        productMaterial: null,
        quantity: 1
      }
    ],
    name: 'Front pocket',
    number: 1,
    updatedAt: '2026-07-06T12:00:00.000Z',
    widthMm: 305
  }
]

/**
 * Renders the product workspace test fixture.
 *
 * @returns Render result for the workspace fixture.
 */
export function renderWorkspace(): ReturnType<typeof render> {
  return render(
    <ProductWorkspace
      catalogMaterials={catalogMaterials}
      combinationActions={combinationActions}
      combinations={combinations}
      labels={labels}
      materialActions={materialActions}
      pieceActions={pieceActions}
      pieces={pieces}
      product={product}
      productMaterials={productMaterials}
    />
  )
}
