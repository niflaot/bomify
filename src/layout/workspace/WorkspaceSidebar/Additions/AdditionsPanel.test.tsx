import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { labels } from '@/views/ProductWorkspace/testing/product-workspace.test-fixtures'
import type { ProductWorkspaceAddition } from '@/views/ProductWorkspace/types/product-workspace.types'

import { AdditionsPanel } from './AdditionsPanel'

const actions = {
  create: jest.fn(async () => ({ status: 'success' as const })),
  delete: jest.fn(async () => ({ status: 'success' as const })),
  update: jest.fn(async () => ({ status: 'success' as const }))
}

const additions: ProductWorkspaceAddition[] = [
  {
    category: 'herrajes',
    id: 'addition-one',
    name: 'Zipper',
    quantity: 1.5,
    unitPriceCop: 1200,
    updatedAt: '2026-07-06T12:00:00.000Z'
  },
  {
    category: 'mano_obra',
    id: 'addition-two',
    name: 'Sewing',
    quantity: 1,
    unitPriceCop: 5000,
    updatedAt: '2026-07-06T12:00:00.000Z'
  }
]

describe('AdditionsPanel', () => {
  it('shows the empty state when there are no additions', () => {
    render(
      <AdditionsPanel actions={actions} additions={[]} labels={labels} productId="product-one" />
    )

    expect(screen.getByText(labels.additionEmptyTitle)).toBeInTheDocument()
  })

  it('groups additions by category and shows the computed total', () => {
    render(
      <AdditionsPanel
        actions={actions}
        additions={additions}
        labels={labels}
        productId="product-one"
      />
    )

    expect(screen.getByText(labels.additionCategoryHerrajes)).toBeInTheDocument()
    expect(screen.getByText(labels.additionCategoryManoDeObra)).toBeInTheDocument()
    expect(screen.getByText('Zipper')).toBeInTheDocument()
    expect(screen.getByText('$1.800')).toBeInTheDocument()
    expect(screen.getByText('Sewing')).toBeInTheDocument()
    expect(screen.getByText('$5.000')).toBeInTheDocument()
  })

  it('opens the create dialog with a category select defaulting to Herrajes', async () => {
    const user = userEvent.setup()

    render(
      <AdditionsPanel actions={actions} additions={[]} labels={labels} productId="product-one" />
    )

    await user.click(screen.getByRole('button', { name: labels.addAddition }))

    expect(screen.getByRole('combobox')).toHaveTextContent(labels.additionCategoryHerrajes)
  })
})
