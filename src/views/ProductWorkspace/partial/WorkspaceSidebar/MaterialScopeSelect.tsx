import type { ReactElement } from 'react'

import { Label } from '@/components/ui/label'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels
} from '../../product-workspace.types'

type MaterialScopeSelectProps = {
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly defaultCombinationId?: string | null
  readonly inputId: string
  readonly labels: ProductWorkspaceLabels
}

/**
 * Renders the material scope selector for all combinations or one combination.
 *
 * @param props - Material scope props.
 * @returns Material scope select element.
 */
export function MaterialScopeSelect(props: MaterialScopeSelectProps): ReactElement {
  const { combinations, defaultCombinationId, inputId, labels } = props

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId}>{labels.materialScopeLabel}</Label>
      <select
        className="h-10 w-full rounded-none border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        defaultValue={defaultCombinationId ?? ''}
        id={inputId}
        name="combinationId"
      >
        <option value="">{labels.allCombinations}</option>
        {combinations.map(combination => (
          <option key={combination.id} value={combination.id}>
            {combination.name}
          </option>
        ))}
      </select>
    </div>
  )
}
