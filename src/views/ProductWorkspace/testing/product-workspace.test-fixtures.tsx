import { render } from '@testing-library/react'

import { ProductWorkspace } from '../ProductWorkspace'
import type {
  ProductWorkspaceAdditionActions,
  ProductWorkspaceCombinationActions,
  ProductWorkspaceLabels,
  ProductWorkspaceMaterialActions,
  ProductWorkspacePieceActions
} from '../types/product-workspace.types'

export const labels: ProductWorkspaceLabels = {
  addAddition: 'Add addition',
  addCombination: 'Add combination',
  addCombinationMaterial: 'Add material role',
  additionCategoryHerrajes: 'Hardware',
  additionCategoryLabel: 'Category',
  additionCategoryManoDeObra: 'Labor',
  additionCategoryVarios: 'Miscellaneous',
  additionDeleteDescription: 'This removes the addition from this product.',
  additionDeleteTitle: 'Remove addition',
  additionEmptyDescription: 'Add hardware, labor, or other costs for this product.',
  additionEmptyTitle: 'No additions yet',
  additionNameLabel: 'Name',
  additionNamePlaceholder: 'Zipper',
  additionQuantityColumnLabel: 'Quantity',
  additionQuantityLabel: 'Quantity',
  additionRemovedToast: 'Addition removed',
  additions: 'Additions',
  additionSavedToast: 'Addition saved',
  additionsPanelDescription: 'Additions panel.',
  additionsSectionTitle: 'Additions',
  additionUnitPriceLabel: 'Unit price (COP)',
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
  combinationRemovedToast: 'Combination removed',
  combinationSalePriceLabel: 'Sale price (COP)',
  combinationSalePricePlaceholder: '150000',
  combinationSavedToast: 'Combination saved',
  combinations: 'Combinations',
  combinationsPanelDescription: 'Combination panel.',
  consumption: 'Consumo',
  consumptionDecreaseUnits: 'Decrease production units',
  consumptionEfficiency: 'Efficiency',
  consumptionEmptyDescription: 'Assign pieces to materials.',
  consumptionLength: 'Length',
  consumptionMeters: 'meters',
  consumptionCost: 'Cost',
  consumptionPanelDescription: 'Consumption panel.',
  consumptionSheets: 'Sheets',
  consumptionUnitsLabel: 'Production units',
  consumptionIncreaseUnits: 'Increase production units',
  consumptionUsed: 'Used',
  consumptionWaste: 'Waste',
  createCatalogMaterial: 'Create catalog material',
  createCombination: 'Create combination',
  createPiece: 'Create piece',
  deleteAddition: 'Delete addition',
  deleteCombination: 'Delete',
  deleteMaterial: 'Remove',
  deletePiece: 'Delete',
  deleting: 'Deleting',
  despieceView: 'Despiece',
  downloadDialogDescription: 'Choose a format and how you want the files bundled.',
  downloadDialogTitle: 'Download files',
  downloadFormatDxf: 'DXF',
  downloadFormatLabel: 'Format',
  downloadFormatPdf: 'PDF',
  downloadMaterialsList: 'Download materials list',
  downloadPiecesList: 'Download pieces list',
  downloadScopeCombined: 'One file',
  downloadScopeLabel: 'Files',
  downloadScopePerMaterial: 'One file per material',
  downloadScopePerPliego: 'One file per pliego',
  downloadScopePerSheet: 'One file per sheet',
  downloading: 'Downloading',
  editAddition: 'Edit',
  editCombination: 'Edit',
  editMaterial: 'Edit',
  editPiece: 'Edit',
  export: 'Export',
  formErrorToast: 'Could not complete the action',
  home: 'Products home',
  materialCatalogEmptyDescription: 'No materials match.',
  materialCatalogSearchLabel: 'Search materials',
  materialCatalogSearchPlaceholder: 'Search material catalog',
  materialColorLabel: 'Color',
  materialDeleteDescription: 'Remove only from this product.',
  materialDeleteTitle: 'Remove material',
  materialEditDescription: "Update this material's shared catalog data.",
  materialEditTitle: 'Edit material',
  materialEditWarning: 'This affects every product using this material.',
  materialEmptyDescription: 'Attach a material.',
  materialEmptyTitle: 'No materials attached',
  materialIconLabel: 'Icon',
  materialIconSearchLabel: 'Search icons',
  materialIconSearchPlaceholder: 'Search Lucide icons',
  materialLabelNameLabel: 'Label name',
  materialLabelNamePlaceholder: 'Canvas',
  materialNameLabel: 'Name',
  materialNamePlaceholder: 'Canvas',
  materialPriceLabel: 'Price per meter (COP)',
  materialPricePlaceholder: '140000',
  materialRemovedToast: 'Material removed',
  materialSavedToast: 'Material saved',
  materialSelectLabel: 'Material',
  materialWidthLabel: 'Width in cm',
  materialWidthPlaceholder: '140',
  materials: 'Materials',
  materialsListDialogDescription: 'Meters used per material.',
  materialsListDialogTitle: 'Materials list',
  materialsPanelDescription: 'Materials panel.',
  newCatalogMaterial: 'New material',
  noCombination: 'No combinations',
  nextSheet: 'Next sheet',
  pdfDownloadButton: 'Download',
  pdfPreviewError: 'Could not render the PDF preview',
  pdfPreviewLoading: 'Preparing preview...',
  pdfPreviewPagesLabel: 'Pages',
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
  pieceRemovedToast: 'Piece removed',
  pieceRemoveMaterialRequirement: 'Remove material',
  pieceReplaceDxfLabel: 'Replace DXF file',
  pieceSave: 'Save piece',
  pieceSavedToast: 'Piece saved',
  pieceScopeAllLabel: 'All combinations',
  pieceWidthLabel: 'Width in cm',
  pieces: 'Pieces',
  piecesListDialogDescription: 'Choose how to group the pieces list.',
  piecesListDialogTitle: 'Pieces list',
  piecesListGroupByLabel: 'Group by',
  piecesListGroupByMaterial: 'Material',
  piecesListGroupByPiece: 'Piece',
  piecesListShowThumbnails: 'Show piece outline',
  piecesPanelDescription: 'Pieces panel.',
  previousSheet: 'Previous sheet',
  product: 'Product',
  productPanelDescription: 'Product panel.',
  productionCutView: 'Corte producción',
  productionMaterialLabel: 'Material',
  productionNoMaterialDescription: 'No production materials.',
  productionSheetLabel: 'Sheet',
  removeCombinationMaterial: 'Remove material role',
  saveAddition: 'Save addition',
  saveCombination: 'Save combination',
  saveMaterial: 'Save material',
  saving: 'Saving',
  selectExistingMaterial: 'Use catalog',
  sidebarTitle: 'Workspace panel',
  stickers: 'Stickers',
  stickersDialogDescription: 'Adjust the gap, then preview and download.',
  stickersDialogTitle: 'Labels preview',
  stickersDownload: 'Download labels',
  stickersGapLabel: 'Gap between labels',
  stickersPanelDescription: 'Stickers panel.',
  techSheetCostLabel: 'Cost',
  techSheetDialogDescription: 'Technical sheet dialog.',
  techSheetDialogTitle: 'Technical sheet',
  techSheetDownload: 'Technical sheet',
  techSheetProfitLabel: 'Profit',
  techSheetSaleLabel: 'Sale price',
  updated: 'Updated',
  uploads: 'Uploads',
  uploadsPanelDescription: 'Uploads panel.',
  viewLabel: 'View',
  workspace: 'Workspace',
  zoomCenter: 'Center view',
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

const additionActions: ProductWorkspaceAdditionActions = {
  create: async () => ({ status: 'success' }),
  delete: async () => ({ status: 'success' }),
  update: async () => ({ status: 'success' })
}

const additions = [
  {
    category: 'herrajes' as const,
    id: 'addition-one',
    name: 'Zipper',
    quantity: 1.5,
    unitPriceCop: 1200,
    updatedAt: '2026-07-06T12:00:00.000Z'
  }
]

const catalogMaterials = [
  {
    hexColor: '#222222',
    iconKey: 'SwatchBook' as const,
    id: 'material-one',
    labelName: null,
    name: 'Canvas',
    priceCop: 140000,
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
    salePriceCop: 150000,
    updatedAt: '2026-07-06T12:00:00.000Z'
  }
]

const materialActions: ProductWorkspaceMaterialActions = {
  add: async () => ({ status: 'success' }),
  delete: async () => ({ status: 'success' }),
  edit: async () => ({ status: 'success' })
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
      additionActions={additionActions}
      additions={additions}
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
