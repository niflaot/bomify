import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWorkspace } from './product-workspace.test-fixtures'

describe('ProductWorkspace', () => {
  it('renders the product workspace shell', () => {
    renderWorkspace()

    expect(screen.getByLabelText('Products home')).toHaveAttribute('href', '/')
    expect(screen.getByRole('combobox', { name: 'Combination' })).toHaveValue(
      'combination-one'
    )
    expect(screen.getByRole('combobox', { name: 'View' })).toHaveValue('despiece')
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument()
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    expect(screen.getByLabelText('Product canvas')).toBeInTheDocument()
    expect(screen.getByText('Canvas placeholder')).toBeInTheDocument()
    expect(screen.getByText('Workspace panel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Combinations' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Product' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Uploads' })).not.toBeInTheDocument()
    expect(screen.getAllByText('Leather standard').length).toBeGreaterThan(0)
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

    expect(screen.getAllByText('Canvas').length).toBeGreaterThan(0)
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

  it('opens the pieces panel and edits scoped material requirements', async () => {
    const user = userEvent.setup()

    renderWorkspace()

    await user.click(screen.getByRole('button', { name: 'Pieces' }))

    expect(screen.getByRole('heading', { name: 'Pieces' })).toBeInTheDocument()
    expect(screen.getByText('1. Front pocket')).toBeInTheDocument()
    expect(screen.getByText('30.5 cm x 10 cm')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add piece' }))

    expect(screen.getByRole('heading', { name: 'Add piece' })).toBeInTheDocument()
    expect(screen.getByLabelText('DXF file')).toBeRequired()
    expect(screen.getAllByText('Drag a DXF here.').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Choose DXF' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add material' }))

    expect(screen.getByRole('combobox', { name: 'Material' })).toHaveValue(
      'product-material-one'
    )
    expect(screen.getByLabelText('Quantity 1')).toHaveValue(1)

    await user.click(screen.getByRole('tab', { name: 'Leather standard' }))
    await user.click(screen.getByRole('button', { name: 'Add material' }))

    expect(screen.getByRole('combobox', { name: 'Material' })).toHaveValue('assignment-one')
  })
})
