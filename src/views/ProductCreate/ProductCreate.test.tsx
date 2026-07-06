import { render, screen } from '@testing-library/react'

import { ProductCreate } from './ProductCreate'
import type { ProductCreateLabels } from './product-create.types'

const labels: ProductCreateLabels = {
  cancel: 'Cancel',
  descriptionLabel: 'Description',
  descriptionPlaceholder: 'Optional notes.',
  eyebrow: 'Bomify',
  nameLabel: 'Product name',
  namePlaceholder: 'Kairos Backpack',
  photoHelp: 'Photos are stored in MinIO/S3.',
  photoLabel: 'Product photo',
  submit: 'Create product',
  submitting: 'Creating',
  subtitle: 'Create the product shell first.',
  title: 'Add product'
}

describe('ProductCreate', () => {
  it('renders the product creation shell and form', () => {
    render(
      <ProductCreate
        action={async () => ({})}
        labels={labels}
      />
    )

    expect(screen.getByRole('heading', { name: 'Add product' })).toBeInTheDocument()
    expect(screen.getByLabelText('Product name')).toBeInTheDocument()
    expect(screen.getByText('Create product')).toBeInTheDocument()
  })
})
