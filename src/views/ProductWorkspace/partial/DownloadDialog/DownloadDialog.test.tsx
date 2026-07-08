import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement, ReactNode } from 'react'

import { labels } from '@/views/ProductWorkspace/testing/product-workspace.test-fixtures'
import { ProductWorkspaceProvider, useProductWorkspace } from '@/views/ProductWorkspace/context/product-workspace.context'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceItem,
  ProductWorkspacePiece,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'

import { DownloadDialog } from './DownloadDialog'

const productMaterial: ProductWorkspaceProductMaterial = {
  id: 'product-material-one',
  material: {
    hexColor: '#111111',
    iconKey: 'SwatchBook',
    id: 'material-one',
    labelName: null,
    name: 'Canvas',
    priceCop: null,
    updatedAt: '2026-07-06T12:00:00.000Z',
    widthCm: 140
  },
  updatedAt: '2026-07-06T12:00:00.000Z'
}

const combination: ProductWorkspaceCombination = {
  hexColor: '#0033ff',
  id: 'combination-one',
  materialAssignments: [],
  name: 'Blue',
  updatedAt: '2026-07-06T12:00:00.000Z'
}

const pieces: ProductWorkspacePiece[] = [{
  dxfFileName: 'front.dxf',
  dxfUrl: '/front.dxf',
  heightMm: 100,
  id: 'piece-one',
  materialRequirements: [{
    combinationMaterial: null,
    id: 'requirement-one',
    productMaterial,
    quantity: 2
  }],
  name: 'Front',
  number: 1,
  updatedAt: '2026-07-06T12:00:00.000Z',
  widthMm: 300
}]

const product: ProductWorkspaceItem = {
  description: null,
  id: 'product-one',
  name: 'Kairos Backpack',
  photoUrl: null,
  updatedAt: '2026-07-06T12:00:00.000Z'
}

function SwitchToProductionView(): ReactElement {
  const { selectView } = useProductWorkspace()

  return (
    <button onClick={() => { selectView('productionCut') }} type="button">
      switch to production
    </button>
  )
}

function renderDialog(children: ReactNode = null): ReturnType<typeof render> {
  return render(
    <ProductWorkspaceProvider defaultCombinationId={combination.id}>
      {children}
      <DownloadDialog
        combinations={[combination]}
        labels={labels}
        pieces={pieces}
        product={product}
      />
    </ProductWorkspaceProvider>
  )
}

async function openScopeOptions(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  const scopeField = screen.getByText(labels.downloadScopeLabel).closest('label')

  expect(scopeField).not.toBeNull()

  if (scopeField) {
    await user.click(within(scopeField).getByRole('combobox'))
  }
}

describe('DownloadDialog', () => {
  it('opens with format and scope fields in despiece view', async () => {
    const user = userEvent.setup()

    renderDialog()
    await user.click(screen.getByRole('button', { name: labels.export }))

    expect(screen.getByText(labels.downloadDialogTitle)).toBeInTheDocument()
    expect(screen.getByText(labels.downloadFormatLabel)).toBeInTheDocument()
    expect(screen.getByText(labels.downloadScopeLabel)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: new RegExp(labels.export, 'i') })).toBeEnabled()
  })

  it('offers "one file per material" only in production view', async () => {
    const user = userEvent.setup()

    renderDialog()
    await user.click(screen.getByRole('button', { name: labels.export }))
    await openScopeOptions(user)

    expect(screen.queryByRole('option', { name: labels.downloadScopePerMaterial })).not.toBeInTheDocument()
  })

  it('shows "one file per material" and "one file per sheet" in production view', async () => {
    const user = userEvent.setup()

    renderDialog(<SwitchToProductionView />)
    await user.click(screen.getByRole('button', { name: 'switch to production' }))
    await user.click(screen.getByRole('button', { name: labels.export }))
    await openScopeOptions(user)

    expect(await screen.findByRole('option', { name: labels.downloadScopePerMaterial })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: labels.downloadScopePerSheet })).toBeInTheDocument()
  })

  it('lets the user pick "one file per pliego" instead of a single combined file in despiece view', async () => {
    const user = userEvent.setup()

    renderDialog()
    await user.click(screen.getByRole('button', { name: labels.export }))
    await openScopeOptions(user)

    expect(await screen.findByRole('option', { name: labels.downloadScopePerPliego })).toBeInTheDocument()
  })
})
