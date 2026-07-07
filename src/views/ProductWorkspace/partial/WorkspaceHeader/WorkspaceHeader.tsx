import { Download, Home } from 'lucide-react'
import Link from 'next/link'
import type { ChangeEvent, ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/core/utils/class-name/class-name.utils'

import { useProductWorkspace } from '../../product-workspace.context'
import type {
  ProductWorkspaceCombination,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspaceView
} from '../../product-workspace.types'

type WorkspaceHeaderProps = {
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly product: ProductWorkspaceItem
}

const selectClassName = cn(
  'h-9 min-w-40 rounded-none border border-input bg-background px-3 text-sm',
  'font-medium outline-none focus-visible:border-ring focus-visible:ring-2',
  'focus-visible:ring-ring/30'
)

function WorkspaceSelector(props: {
  readonly label: string
  readonly children: ReactElement | readonly ReactElement[]
}): ReactElement {
  return (
    <label className="grid min-w-0 gap-1">
      <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
        {props.label}
      </span>
      {props.children}
    </label>
  )
}

function WorkspaceTitle(props: {
  readonly labels: ProductWorkspaceLabels
  readonly product: ProductWorkspaceItem
}): ReactElement {
  return (
    <div className="min-w-0 border-l pl-4 pr-2">
      <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
        {props.labels.workspace}
      </p>
      <p className="max-w-48 truncate text-lg font-semibold uppercase tracking-[0.16em]">
        {props.product.name}
      </p>
    </div>
  )
}

/**
 * Renders the workspace top header.
 *
 * @param props - Workspace header props.
 * @returns Header element.
 */
export function WorkspaceHeader(props: WorkspaceHeaderProps): ReactElement {
  const { combinations, labels, product } = props
  const {
    activeCombinationId,
    activeView,
    selectCombination,
    selectView
  } = useProductWorkspace()

  function handleCombinationChange(event: ChangeEvent<HTMLSelectElement>): void {
    selectCombination(event.target.value)
  }

  function handleViewChange(event: ChangeEvent<HTMLSelectElement>): void {
    selectView(event.target.value as ProductWorkspaceView)
  }

  return (
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-3 py-2 sm:px-5">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <Button aria-label={labels.home} asChild size="icon-sm" variant="ghost">
          <Link href="/">
            <Home aria-hidden="true" />
          </Link>
        </Button>

        <WorkspaceTitle labels={labels} product={product} />

        <WorkspaceSelector label={labels.combinationLabel}>
          <select
            aria-label={labels.combinationLabel}
            className={selectClassName}
            disabled={combinations.length === 0}
            onChange={handleCombinationChange}
            value={activeCombinationId ?? ''}
          >
            {combinations.length === 0 ? (
              <option value="">{labels.noCombination}</option>
            ) : null}
            {combinations.map(combination => (
              <option key={combination.id} value={combination.id}>
                {combination.name}
              </option>
            ))}
          </select>
        </WorkspaceSelector>
        <WorkspaceSelector label={labels.viewLabel}>
          <select
            aria-label={labels.viewLabel}
            className={selectClassName}
            onChange={handleViewChange}
            value={activeView}
          >
            <option value="despiece">{labels.despieceView}</option>
          </select>
        </WorkspaceSelector>
        <span className="max-w-52 truncate text-xs text-muted-foreground">
          {product.name}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" type="button">
          <Download aria-hidden="true" data-icon="inline-start" />
          <span className="hidden sm:inline">{labels.export}</span>
        </Button>
      </div>
    </header>
  )
}
