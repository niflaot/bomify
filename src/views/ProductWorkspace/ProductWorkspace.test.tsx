import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ProductWorkspace } from './ProductWorkspace'
import type {
  ProductWorkspaceCombinationActions,
  ProductWorkspaceLabels,
  ProductWorkspaceMaterialActions
} from './product-workspace.types'

const labels: ProductWorkspaceLabels = {
  addCombination: 'Add combination',
  addCombinationMaterial: 'Add material role',
  addMaterial: 'Add material',
  calculate: 'Calculate',
  cancel: 'Cancel',
  canvasEmptyDescription: 'Canvas placeholder description.',
  canvasEmptyTitle: 'Canvas placeholder',
  canvasLabel: 'Product canvas',
  closeDialog: 'Close dialog',
  combinationColorLabel: 'Hex color',
  combinationCreateTitle: 'New combination',
  combinationDeleteDescription: 'Delete confirmation.',
  combinationDeleteTitle: 'Delete combination',
  combinationEmptyDescription: 'Create a combination.',
  combinationEmptyTitle: 'No combinations yet',
  combinationNameLabel: 'Name',
  combinationNamePlaceholder: 'Leather standard',
  combinationMaterialAssignmentsLabel: 'Material roles',
  combinationMaterialEmptyDescription: 'Attach materials first.',
  combinationMaterialMaterialLabel: 'Material',
  combinationMaterialRoleLabel: 'Role id',
  combinationMaterialToggleLabel: 'Toggle assigned materials',
  combinations: 'Combinations',
  combinationsPanelDescription: 'Combination panel.',
  createCatalogMaterial: 'Create catalog material',
  createCombination: 'Create combination',
  deleteCombination: 'Delete',
  deleteMaterial: 'Remove',
  deleting: 'Deleting',
  editCombination: 'Edit',
  export: 'Export',
  home: 'Products home',
  materials: 'Materials',
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
  materialsPanelDescription: 'Materials panel.',
  materialSelectLabel: 'Material',
  materialWidthLabel: 'Width in cm',
  materialWidthPlaceholder: '140',
  newCatalogMaterial: 'New material',
  pieces: 'Pieces',
  piecesPanelDescription: 'Pieces panel.',
  product: 'Product',
  productPanelDescription: 'Product panel.',
  save: 'Save',
  saveCombination: 'Save combination',
  saveMaterial: 'Save material',
  saving: 'Saving',
  selectExistingMaterial: 'Use catalog',
  removeCombinationMaterial: 'Remove material role',
  sidebarTitle: 'Workspace panel',
  stickers: 'Stickers',
  stickersPanelDescription: 'Stickers panel.',
  updated: 'Updated',
  uploads: 'Uploads',
  uploadsPanelDescription: 'Uploads panel.',
  workspace: 'Workspace'
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

function renderWorkspace(): ReturnType<typeof render> {
  return render(
    <ProductWorkspace
      catalogMaterials={catalogMaterials}
      combinationActions={combinationActions}
      combinations={combinations}
      labels={labels}
      materialActions={materialActions}
      product={product}
      productMaterials={productMaterials}
    />
  )
}

describe('ProductWorkspace', () => {
  it('renders the product workspace shell', () => {
    renderWorkspace()

    expect(screen.getByRole('heading', { name: 'Explorer' })).toBeInTheDocument()
    expect(screen.getByLabelText('Products home')).toHaveAttribute('href', '/')
    expect(screen.getByLabelText('Product canvas')).toBeInTheDocument()
    expect(screen.getByText('Workspace panel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Combinations' })).toBeInTheDocument()
    expect(screen.getByText('Leather standard')).toBeInTheDocument()
  })

  it('toggles and switches the active left workspace panel', async () => {
    const user = userEvent.setup()

    renderWorkspace()

    expect(screen.getByRole('heading', { name: 'Combinations' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Combinations' }))

    expect(screen.getByTestId('workspace-sidebar-panel')).toHaveClass('w-0')

    await user.click(screen.getByRole('button', { name: 'Materials' }))

    expect(screen.getByTestId('workspace-sidebar-panel')).toHaveClass('w-80')
    expect(screen.getByRole('heading', { name: 'Materials' })).toBeInTheDocument()
  })

  it('opens combination create and edit dialogs from the panel', async () => {
    const user = userEvent.setup()

    renderWorkspace()

    await user.click(screen.getByRole('button', { name: 'Add combination' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'New combination' })).toBeInTheDocument()
    expect(screen.getByText('Material roles')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add material role' }))

    expect(screen.getByLabelText('Role id 1')).toHaveValue('material-1')
    expect(screen.getByRole('combobox', { name: 'Material' })).toHaveValue(
      'product-material-one'
    )

    await user.click(screen.getByRole('button', { name: 'Remove material role 1' }))

    expect(screen.queryByLabelText('Role id 1')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    await user.click(screen.getByRole('button', { name: 'Edit: Leather standard' }))

    expect(screen.getByRole('heading', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('Leather standard')
    expect(screen.getByLabelText('Role id 1')).toHaveValue('lona')
    expect(screen.getByText('lona - Canvas')).toBeInTheDocument()
  })

  it('opens the materials panel and interactive material icon picker', async () => {
    const user = userEvent.setup()

    renderWorkspace()

    await user.click(screen.getByRole('button', { name: 'Materials' }))

    expect(screen.getByText('Canvas')).toBeInTheDocument()
    expect(screen.getByText('140 cm')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add material' }))
    await user.click(screen.getByRole('button', { name: 'New material' }))

    const iconSearch = screen.getByLabelText('Search icons')

    await user.type(iconSearch, 'SwatchBook')

    expect(screen.getByRole('button', { name: 'Icon: Swatch Book' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    await user.clear(iconSearch)
    await user.type(iconSearch, 'Shield')
    await user.click(screen.getByRole('button', { name: 'Icon: Shield' }))

    expect(screen.getByRole('button', { name: 'Icon: Shield' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })
})
