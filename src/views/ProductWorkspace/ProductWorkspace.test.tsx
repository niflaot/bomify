import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ProductWorkspace } from './ProductWorkspace'
import type {
  ProductWorkspaceCombinationActions,
  ProductWorkspaceLabels
} from './product-workspace.types'

const labels: ProductWorkspaceLabels = {
  addCombination: 'Add combination',
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
  combinations: 'Combinations',
  combinationsPanelDescription: 'Combination panel.',
  createCombination: 'Create combination',
  deleteCombination: 'Delete',
  deleting: 'Deleting',
  editCombination: 'Edit',
  export: 'Export',
  home: 'Products home',
  materials: 'Materials',
  materialsPanelDescription: 'Materials panel.',
  pieces: 'Pieces',
  piecesPanelDescription: 'Pieces panel.',
  product: 'Product',
  productPanelDescription: 'Product panel.',
  save: 'Save',
  saveCombination: 'Save combination',
  saving: 'Saving',
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

const combinations = [
  {
    hexColor: '#111111',
    id: 'combination-one',
    name: 'Leather standard',
    updatedAt: '2026-07-06T12:00:00.000Z'
  }
]

const combinationActions: ProductWorkspaceCombinationActions = {
  create: async () => ({ status: 'success' }),
  delete: async () => ({ status: 'success' }),
  update: async () => ({ status: 'success' })
}

function renderWorkspace(): ReturnType<typeof render> {
  return render(
    <ProductWorkspace
      combinationActions={combinationActions}
      combinations={combinations}
      labels={labels}
      product={product}
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

    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    await user.click(screen.getByRole('button', { name: 'Edit: Leather standard' }))

    expect(screen.getByRole('heading', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('Leather standard')
  })
})
