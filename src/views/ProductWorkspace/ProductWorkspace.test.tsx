import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ProductWorkspace } from './ProductWorkspace'
import type { ProductWorkspaceLabels } from './product-workspace.types'

const labels: ProductWorkspaceLabels = {
  calculate: 'Calculate',
  canvasEmptyDescription: 'Canvas placeholder description.',
  canvasEmptyTitle: 'Canvas placeholder',
  canvasLabel: 'Product canvas',
  combinations: 'Combinations',
  combinationsPanelDescription: 'Combination panel.',
  export: 'Export',
  home: 'Products home',
  materials: 'Materials',
  materialsPanelDescription: 'Materials panel.',
  pieces: 'Pieces',
  piecesPanelDescription: 'Pieces panel.',
  product: 'Product',
  productPanelDescription: 'Product panel.',
  save: 'Save',
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

describe('ProductWorkspace', () => {
  it('renders the product workspace shell', () => {
    render(<ProductWorkspace labels={labels} product={product} />)

    expect(screen.getByRole('heading', { name: 'Explorer' })).toBeInTheDocument()
    expect(screen.getByLabelText('Products home')).toHaveAttribute('href', '/')
    expect(screen.getByLabelText('Product canvas')).toBeInTheDocument()
    expect(screen.getByText('Workspace panel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pieces' })).toBeInTheDocument()
  })

  it('toggles and switches the active left workspace panel', async () => {
    const user = userEvent.setup()

    render(<ProductWorkspace labels={labels} product={product} />)

    expect(screen.getByRole('heading', { name: 'Pieces' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Pieces' }))

    expect(screen.getByTestId('workspace-sidebar-panel')).toHaveClass('w-0')

    await user.click(screen.getByRole('button', { name: 'Materials' }))

    expect(screen.getByTestId('workspace-sidebar-panel')).toHaveClass('w-80')
    expect(screen.getByRole('heading', { name: 'Materials' })).toBeInTheDocument()
  })
})
