import { Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { useProductWorkspace } from '@/views/ProductWorkspace/context/product-workspace.context'
import { DownloadDialog } from '@/views/ProductWorkspace/partial/DownloadDialog/DownloadDialog'
import { TechSheetDialog } from '@/views/ProductWorkspace/partial/TechSheetDialog/TechSheetDialog'
import type {
  ProductWorkspaceAddition,
  ProductWorkspaceCombination,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspacePiece,
  ProductWorkspaceView
} from '@/views/ProductWorkspace/types/product-workspace.types'

type WorkspaceHeaderProps = {
  readonly additions: readonly ProductWorkspaceAddition[]
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
  readonly product: ProductWorkspaceItem
}

function WorkspaceSelector(props: {
  readonly label: string
  readonly children: ReactNode
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
    <div className="flex min-w-0 items-center gap-3 border-l pl-4 pr-2">
      <Image
        alt=""
        aria-hidden="true"
        className="size-7 shrink-0"
        height={28}
        priority
        src="/logo.svg"
        width={28}
      />
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground">
          {props.labels.workspace}
        </p>
        <p className="max-w-48 truncate text-lg font-semibold uppercase tracking-[0.16em]">
          {props.product.name}
        </p>
      </div>
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
  const { additions, combinations, labels, pieces, product } = props
  const {
    activeCombinationId,
    activeView,
    selectCombination,
    selectView
  } = useProductWorkspace()

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
          <Select
            aria-label={labels.combinationLabel}
            disabled={combinations.length === 0}
            onValueChange={selectCombination}
            value={activeCombinationId ?? ''}
          >
            <SelectTrigger
              aria-label={labels.combinationLabel}
              className="h-9 min-w-40 font-medium"
            >
              <SelectValue placeholder={labels.noCombination} />
            </SelectTrigger>
            <SelectContent>
              {combinations.map(combination => (
                <SelectItem key={combination.id} value={combination.id}>
                  {combination.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </WorkspaceSelector>
        <WorkspaceSelector label={labels.viewLabel}>
          <Select
            aria-label={labels.viewLabel}
            onValueChange={value => { selectView(value as ProductWorkspaceView) }}
            value={activeView}
          >
            <SelectTrigger
              aria-label={labels.viewLabel}
              className="h-9 min-w-40 font-medium"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="despiece">{labels.despieceView}</SelectItem>
              <SelectItem value="productionCut">{labels.productionCutView}</SelectItem>
            </SelectContent>
          </Select>
        </WorkspaceSelector>
      </div>

      <div className="flex items-center gap-2">
        <TechSheetDialog
          additions={additions}
          combinations={combinations}
          labels={labels}
          pieces={pieces}
          product={product}
        />
        <DownloadDialog
          combinations={combinations}
          labels={labels}
          pieces={pieces}
          product={product}
        />
      </div>
    </header>
  )
}
