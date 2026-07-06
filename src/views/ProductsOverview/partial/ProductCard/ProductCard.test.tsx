import { render, screen } from '@testing-library/react'

import type { ProductsOverviewLabels } from '../../products-overview.types'
import { ProductCard } from './ProductCard'

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

describe('ProductCard', () => {
  it('renders product details and card actions', () => {
    render(
      <ProductCard
        deleteAction={jest.fn()}
        labels={labels}
        locale="en"
        product={{
          description: 'Everyday bag',
          id: 'one',
          name: 'Kairos Backpack',
          photoUrl: null,
          updatedAt: '2026-07-06T12:00:00.000Z'
        }}
      />
    )

    expect(screen.getByText('Kairos Backpack')).toBeInTheDocument()
    expect(screen.getByText('Everyday bag')).toBeInTheDocument()
    expect(screen.getByLabelText('Edit Kairos Backpack')).toBeInTheDocument()
    expect(screen.getByLabelText('Delete Kairos Backpack')).toBeInTheDocument()
  })
})
