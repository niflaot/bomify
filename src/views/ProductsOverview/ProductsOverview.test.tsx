import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ProductsOverview } from './ProductsOverview'
import type { ProductsOverviewLabels } from './products-overview.types'

const labels: ProductsOverviewLabels = {
  deleteProduct: 'Delete {name}',
  deleteProductConfirmation: 'Delete {name}?',
  edited: 'Edited',
  editProduct: 'Edit {name}',
  emptyDescription: 'Create a product to start.',
  emptyTitle: 'No products yet',
  loadErrorDescription: 'Check the database connection.',
  loadErrorTitle: 'Products unavailable',
  newProduct: 'Add product',
  noDescription: 'No description',
  productsCount: 'products',
  recent: 'Recent',
  searchPlaceholder: 'Search products',
  subtitle: 'Organize production files.',
  title: 'Bomify'
}

const deleteAction = jest.fn()

describe('ProductsOverview', () => {
  it('renders product cards and filters them by search text', async () => {
    const user = userEvent.setup()

    render(
      <ProductsOverview
        deleteAction={deleteAction}
        labels={labels}
        locale="en"
        products={[
          {
            description: 'Everyday bag',
            id: 'one',
            name: 'Kairos Backpack',
            photoUrl: null,
            updatedAt: '2026-07-06T12:00:00.000Z'
          },
          {
            description: 'Compact wallet',
            id: 'two',
            name: 'Milo Wallet',
            photoUrl: null,
            updatedAt: '2026-07-05T12:00:00.000Z'
          }
        ]}
      />
    )

    expect(screen.getByText('Kairos Backpack')).toBeInTheDocument()
    expect(screen.getByText('Milo Wallet')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search products'), 'wallet')

    expect(screen.queryByText('Kairos Backpack')).not.toBeInTheDocument()
    expect(screen.getByText('Milo Wallet')).toBeInTheDocument()
  })

  it('renders an empty state when no products match', async () => {
    const user = userEvent.setup()

    render(
      <ProductsOverview
        deleteAction={deleteAction}
        labels={labels}
        locale="en"
        products={[
          {
            description: null,
            id: 'one',
            name: 'Kairos Backpack',
            photoUrl: null,
            updatedAt: '2026-07-06T12:00:00.000Z'
          }
        ]}
      />
    )

    await user.type(screen.getByLabelText('Search products'), 'wallet')

    expect(screen.getByText('No products yet')).toBeInTheDocument()
  })

  it('renders a deterministic fallback when products cannot load', () => {
    render(
      <ProductsOverview
        deleteAction={deleteAction}
        labels={labels}
        loadError
        locale="en"
        products={[]}
      />
    )

    expect(screen.getByText('Products unavailable')).toBeInTheDocument()
  })
})
