'use client'

import { ChevronDown, Pencil, Plus } from 'lucide-react'
import type { ReactElement } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/core/utils/class-name/class-name.utils'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceCombinationActions,
  ProductWorkspaceLabels,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { CombinationFormDialog } from './CombinationFormDialog'
import { CombinationDeleteDialog } from './CombinationDeleteDialog'
import { MaterialSwatch } from '../Materials/MaterialSwatch'

type CombinationsPanelProps = {
  readonly actions: ProductWorkspaceCombinationActions
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}

function formatMaterialAssignmentLabel(
  assignment: ProductWorkspaceCombination['materialAssignments'][number]
): string {
  return `${assignment.roleId} - ${assignment.productMaterial.material.name}`
}

function CombinationRow(props: {
  readonly actions: ProductWorkspaceCombinationActions
  readonly combination: ProductWorkspaceCombination
  readonly labels: ProductWorkspaceLabels
  readonly productId: string
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}): ReactElement {
  const { actions, combination, labels, productId, productMaterials } = props
  const [assignmentsOpen, setAssignmentsOpen] = useState(true)
  const hasAssignments = combination.materialAssignments.length > 0

  return (
    <li className="grid gap-3 border p-3">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="mt-1 size-7 shrink-0 border"
          style={{ backgroundColor: combination.hexColor }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{combination.name}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {combination.hexColor}
          </p>
        </div>
        {hasAssignments ? (
          <Button
            aria-label={`${labels.combinationMaterialToggleLabel}: ${combination.name}`}
            aria-pressed={assignmentsOpen}
            onClick={() => {
              setAssignmentsOpen(open => !open)
            }}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <ChevronDown
              aria-hidden="true"
              className={cn('transition-transform', !assignmentsOpen && '-rotate-90')}
            />
          </Button>
        ) : null}
      </div>
      {hasAssignments && assignmentsOpen ? (
        <ul className="grid gap-2 border-l pl-3">
          {combination.materialAssignments.map(assignment => (
            <li
              className="grid grid-cols-[auto_1fr] items-center gap-2 text-xs"
              key={assignment.id}
            >
              <MaterialSwatch
                className="grid size-6 place-items-center border"
                hexColor={assignment.productMaterial.material.hexColor}
                iconClassName="size-3"
                iconKey={assignment.productMaterial.material.iconKey}
              />
              <span className="min-w-0 truncate text-muted-foreground">
                {formatMaterialAssignmentLabel(assignment)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex justify-end gap-2">
        <CombinationFormDialog
          action={actions.update}
          combination={combination}
          labels={labels}
          productId={productId}
          productMaterials={productMaterials}
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
  const { actions, combinations, labels, productId, productMaterials } = props

  return (
    <div className="grid gap-4">
      <CombinationFormDialog
        action={actions.create}
        labels={labels}
        productId={productId}
        productMaterials={productMaterials}
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
              productMaterials={productMaterials}
            />
          ))}
        </ul>
      ) : (
        <EmptyCombinations labels={labels} />
      )}
    </div>
  )
}
