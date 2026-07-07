import { render, screen } from '@testing-library/react'

import { ProductCreateForm } from './ProductCreateForm'
import type { ProductCreateLabels } from '../../product-create.types'

const labels: ProductCreateLabels = {
  cancel: 'Cancel',
  descriptionLabel: 'Description',
  descriptionPlaceholder: 'Optional notes.',
  eyebrow: 'Bomify',
  formErrorToast: 'Could not create product',
  nameLabel: 'Product name',
  namePlaceholder: 'Kairos Backpack',
  photoHelp: 'Photos are stored in MinIO/S3.',
  photoLabel: 'Product photo',
  submit: 'Create product',
  submitting: 'Creating',
  subtitle: 'Create the product shell first.',
  title: 'Add product'
}

describe('ProductCreateForm', () => {
  it('renders accessible product fields', () => {
    render(<ProductCreateForm action={async () => ({})} labels={labels} />)

    expect(screen.getByLabelText('Product name')).toHaveAttribute('name', 'name')
    expect(screen.getByLabelText('Description')).toHaveAttribute('name', 'description')
    expect(screen.getByLabelText('Product photo')).toHaveAttribute('name', 'photo')
    expect(screen.getByRole('button', { name: /create product/i })).toBeInTheDocument()
  })
})
