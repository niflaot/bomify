'use client'

import { Plus } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import {
  ADDITION_CATEGORIES,
  ADDITION_CATEGORY_ICONS
} from '@/core/constants/addition-category.constants'
import type { ProductAdditionCategory } from '@/core/types/product-addition.types'

import type {
  ProductWorkspaceAddition,
  ProductWorkspaceAdditionActions,
  ProductWorkspaceLabels
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { AdditionCard } from './AdditionCard'
import { AdditionFormDialog } from './AdditionFormDialog'

type AdditionsPanelProps = {
  readonly actions: ProductWorkspaceAdditionActions
  readonly additions: readonly ProductWorkspaceAddition[]
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
}

function categoryLabel(
  labels: ProductWorkspaceLabels,
  category: ProductAdditionCategory
): string {
  const map: Record<ProductAdditionCategory, string> = {
    herrajes: labels.additionCategoryHerrajes,
    mano_obra: labels.additionCategoryManoDeObra,
    varios: labels.additionCategoryVarios
  }

  return map[category]
}

function EmptyAdditions(props: { readonly labels: ProductWorkspaceLabels }): ReactElement {
  const { labels } = props

  return (
    <div className="border border-dashed bg-muted/30 p-4 text-sm">
      <p className="font-semibold">{labels.additionEmptyTitle}</p>
      <p className="mt-2 leading-6 text-muted-foreground">{labels.additionEmptyDescription}</p>
    </div>
  )
}

/**
 * Renders product additions (hardware, labor, and other costs), grouped by
 * category, and the create/edit/delete dialogs.
 *
 * @param props - Additions panel props.
 * @returns Additions panel element.
 */
export function AdditionsPanel(props: AdditionsPanelProps): ReactElement {
  const { actions, additions, labels, productId } = props

  return (
    <div className="grid gap-4">
      <AdditionFormDialog
        action={actions.create}
        labels={labels}
        productId={productId}
        trigger={
          <Button className="w-full justify-start" type="button" variant="outline">
            <Plus aria-hidden="true" data-icon="inline-start" />
            {labels.addAddition}
          </Button>
        }
        variant="create"
      />

      {additions.length > 0 ? (
        <div className="grid gap-4">
          {ADDITION_CATEGORIES.map(category => {
            const items = additions.filter(addition => addition.category === category)

            if (items.length === 0) {
              return null
            }

            const Icon = ADDITION_CATEGORY_ICONS[category]

            return (
              <div className="grid gap-2" key={category}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Icon aria-hidden="true" className="size-3.5" />
                  {categoryLabel(labels, category)}
                </div>
                <ul className="grid gap-3">
                  {items.map(addition => (
                    <AdditionCard
                      actions={actions}
                      addition={addition}
                      key={addition.id}
                      labels={labels}
                      productId={productId}
                    />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyAdditions labels={labels} />
      )}
    </div>
  )
}
