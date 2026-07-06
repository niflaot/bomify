import { Pencil, Plus } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceCombinationActions,
  ProductWorkspaceLabels
} from '../../product-workspace.types'
import { CombinationFormDialog } from './CombinationFormDialog'
import { CombinationDeleteDialog } from './CombinationDeleteDialog'

type CombinationsPanelProps = {
  readonly actions: ProductWorkspaceCombinationActions
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
}

function CombinationRow(props: {
  readonly actions: ProductWorkspaceCombinationActions
  readonly combination: ProductWorkspaceCombination
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
}): ReactElement {
  const { actions, combination, labels, productId } = props

  return (
    <li className="grid gap-3 border p-3">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="size-7 shrink-0 border"
          style={{ backgroundColor: combination.hexColor }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{combination.name}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {combination.hexColor}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <CombinationFormDialog
          action={actions.update}
          combination={combination}
          labels={labels}
          productId={productId}
          trigger={
            <Button
              aria-label={`${labels.editCombination}: ${combination.name}`}
              size="icon-xs"
              type="button"
              variant="outline"
            >
              <Pencil aria-hidden="true" />
            </Button>
          }
          variant="update"
        />
        <CombinationDeleteDialog
          action={actions.delete}
          combination={combination}
          labels={labels}
          productId={productId}
        />
      </div>
    </li>
  )
}

function EmptyCombinations(props: {
  readonly labels: ProductWorkspaceLabels
}): ReactElement {
  const { labels } = props

  return (
    <div className="border border-dashed bg-muted/30 p-4 text-sm">
      <p className="font-semibold">{labels.combinationEmptyTitle}</p>
      <p className="mt-2 leading-6 text-muted-foreground">
        {labels.combinationEmptyDescription}
      </p>
    </div>
  )
}

/**
 * Renders product combinations and dialog entry points.
 *
 * @param props - Combinations panel props.
 * @returns Combinations panel body.
 */
export function CombinationsPanel(props: CombinationsPanelProps): ReactElement {
  const { actions, combinations, labels, productId } = props

  return (
    <div className="grid gap-4">
      <CombinationFormDialog
        action={actions.create}
        labels={labels}
        productId={productId}
        trigger={
          <Button className="w-full justify-start" type="button" variant="outline">
            <Plus aria-hidden="true" data-icon="inline-start" />
            {labels.addCombination}
          </Button>
        }
        variant="create"
      />

      {combinations.length > 0 ? (
        <ul className="grid gap-3">
          {combinations.map(combination => (
            <CombinationRow
              actions={actions}
              combination={combination}
              key={combination.id}
              labels={labels}
              productId={productId}
            />
          ))}
        </ul>
      ) : (
        <EmptyCombinations labels={labels} />
      )}
    </div>
  )
}
