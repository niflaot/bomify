'use client'

import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { Input } from '@/components/ui/input'
import { formatCop } from '@/core/utils/currency/currency.utils'

import type {
  ProductWorkspaceLabels,
  ProductWorkspaceMaterial,
  ProductWorkspaceMaterialActions,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { MaterialAddDialog } from './MaterialAddDialog'
import { MaterialDeleteDialog } from './MaterialDeleteDialog'
import { MaterialEditDialog } from './MaterialEditDialog'
import { MaterialSwatch } from './MaterialSwatch'

type MaterialsPanelProps = {
  readonly actions: ProductWorkspaceMaterialActions
  readonly catalogMaterials: readonly ProductWorkspaceMaterial[]
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}

function MaterialCard(props: {
  readonly actions: ProductWorkspaceMaterialActions
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
  readonly productMaterial: ProductWorkspaceProductMaterial
}): ReactElement {
  const { actions, labels, productId, productMaterial } = props
  const { material } = productMaterial

  return (
    <li className="grid gap-3 border p-3">
      <div className="flex items-center gap-3">
        <MaterialSwatch
          className="grid size-10 shrink-0 place-items-center border"
          hexColor={material.hexColor}
          iconClassName="size-5"
          iconKey={material.iconKey}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{material.name}</p>
          <p className="text-xs text-muted-foreground">
            {material.widthCm} cm · {formatCop(material.priceCop)}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <MaterialEditDialog
          action={actions.edit}
          labels={labels}
          productId={productId}
          productMaterial={productMaterial}
        />
        <MaterialDeleteDialog
          action={actions.delete}
          labels={labels}
          productId={productId}
          productMaterial={productMaterial}
        />
      </div>
    </li>
  )
}

function EmptyMaterials(props: { readonly labels: ProductWorkspaceLabels }): ReactElement {
  const { labels } = props

  return (
    <div className="border border-dashed bg-muted/30 p-4 text-sm">
      <p className="font-semibold">{labels.materialEmptyTitle}</p>
      <p className="mt-2 leading-6 text-muted-foreground">{labels.materialEmptyDescription}</p>
    </div>
  )
}

/**
 * Renders product material links and material dialogs.
 *
 * @param props - Materials panel props.
 * @returns Materials panel element.
 */
export function MaterialsPanel(props: MaterialsPanelProps): ReactElement {
  const {
    actions,
    catalogMaterials,
    labels,
    productId,
    productMaterials
  } = props
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleMaterials = useMemo(
    () =>
      productMaterials.filter(productMaterial => {
        if (!normalizedQuery) {
          return true
        }

        return productMaterial.material.name.toLowerCase().includes(normalizedQuery)
      }),
    [normalizedQuery, productMaterials]
  )

  return (
    <div className="grid gap-4">
      {/* TODO: Move global catalog creation/editing into a dedicated materials admin screen. */}
      <MaterialAddDialog
        action={actions.add}
        labels={labels}
        materials={catalogMaterials}
        productId={productId}
      />
      <Input
        aria-label={labels.materialCatalogSearchLabel}
        onChange={event => {
          setQuery(event.target.value)
        }}
        placeholder={labels.materialCatalogSearchPlaceholder}
        type="search"
        value={query}
      />
      {visibleMaterials.length > 0 ? (
        <ul className="grid gap-3">
          {visibleMaterials.map(productMaterial => (
            <MaterialCard
              actions={actions}
              key={productMaterial.id}
              labels={labels}
              productId={productId}
              productMaterial={productMaterial}
            />
          ))}
        </ul>
      ) : (
        <EmptyMaterials labels={labels} />
      )}
    </div>
  )
}
