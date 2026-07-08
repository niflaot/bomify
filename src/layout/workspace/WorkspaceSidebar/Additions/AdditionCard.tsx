'use client'

import { Pencil } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import { ADDITION_CATEGORY_ICONS } from '@/core/constants/addition-category.constants'
import { formatCop } from '@/core/utils/currency/currency.utils'
import { formatQuantity } from '@/core/utils/quantity/quantity.utils'

import type {
  ProductWorkspaceAddition,
  ProductWorkspaceAdditionActions,
  ProductWorkspaceLabels
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { AdditionDeleteDialog } from './AdditionDeleteDialog'
import { AdditionFormDialog } from './AdditionFormDialog'

type AdditionCardProps = {
  readonly actions: ProductWorkspaceAdditionActions
  readonly addition: ProductWorkspaceAddition
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
}

/**
 * Renders one addition (hardware/labor/misc line item) with edit/delete
 * actions and its computed total cost.
 *
 * @param props - Addition card props.
 * @returns Addition card element.
 */
export function AdditionCard(props: AdditionCardProps): ReactElement {
  const { actions, addition, labels, productId } = props
  const Icon = ADDITION_CATEGORY_ICONS[addition.category]
  const totalCop = Math.round(addition.quantity * addition.unitPriceCop)

  return (
    <li className="grid gap-3 border p-3">
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center border bg-muted/40">
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{addition.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatQuantity(addition.quantity)} × {formatCop(addition.unitPriceCop)}
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold">{formatCop(totalCop)}</p>
      </div>
      <div className="flex justify-end gap-2">
        <AdditionFormDialog
          action={actions.update}
          addition={addition}
          labels={labels}
          productId={productId}
          trigger={
            <Button
              aria-label={`${labels.editAddition}: ${addition.name}`}
              size="icon-xs"
              type="button"
              variant="outline"
            >
              <Pencil aria-hidden="true" />
            </Button>
          }
          variant="update"
        />
        <AdditionDeleteDialog
          action={actions.delete}
          addition={addition}
          labels={labels}
          productId={productId}
        />
      </div>
    </li>
  )
}
