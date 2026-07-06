import { Calculator, Download, Home, Save } from 'lucide-react'
import Link from 'next/link'
import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'

import type { ProductWorkspaceItem, ProductWorkspaceLabels } from '../../product-workspace.types'

type WorkspaceHeaderProps = {
  readonly labels: ProductWorkspaceLabels
  readonly product: ProductWorkspaceItem
}

/**
 * Renders the workspace top header.
 *
 * @param props - Workspace header props.
 * @returns Header element.
 */
export function WorkspaceHeader(props: WorkspaceHeaderProps): ReactElement {
  const { labels, product } = props

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <Button aria-label={labels.home} asChild size="icon-sm" variant="ghost">
          <Link href="/">
            <Home aria-hidden="true" />
          </Link>
        </Button>
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-widest text-muted-foreground">
            {labels.workspace}
          </p>
          <h1 className="truncate text-sm font-semibold uppercase tracking-widest sm:text-base">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" type="button" variant="outline">
          <Calculator aria-hidden="true" data-icon="inline-start" />
          <span className="hidden sm:inline">{labels.calculate}</span>
        </Button>
        <Button size="sm" type="button" variant="outline">
          <Download aria-hidden="true" data-icon="inline-start" />
          <span className="hidden sm:inline">{labels.export}</span>
        </Button>
        <Button size="sm" type="button">
          <Save aria-hidden="true" data-icon="inline-start" />
          <span className="hidden sm:inline">{labels.save}</span>
        </Button>
      </div>
    </header>
  )
}
