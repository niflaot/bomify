import {
  Boxes,
  FileUp,
  Layers3,
  Package,
  Printer,
  SwatchBook
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactElement } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/core/utils/class-name.utils'

import { useProductWorkspace } from '../../product-workspace.context'
import type {
  ProductWorkspaceMaterial,
  ProductWorkspaceMaterialActions,
  ProductWorkspaceProductMaterial,
  ProductWorkspaceCombination,
  ProductWorkspaceCombinationActions,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspacePanel
} from '../../product-workspace.types'
import { WorkspacePanelContent } from './WorkspacePanelContent'

type WorkspaceSidebarProps = {
  readonly catalogMaterials: readonly ProductWorkspaceMaterial[]
  readonly combinationActions: ProductWorkspaceCombinationActions
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly materialActions: ProductWorkspaceMaterialActions
  readonly product: ProductWorkspaceItem
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}

type WorkspaceRailItem = {
  readonly icon: LucideIcon
  readonly key: ProductWorkspacePanel
}

const railItems: readonly WorkspaceRailItem[] = [
  { key: 'combinations', icon: Layers3 },
  { key: 'product', icon: Package },
  { key: 'pieces', icon: Boxes },
  { key: 'materials', icon: SwatchBook },
  { key: 'uploads', icon: FileUp },
  { key: 'stickers', icon: Printer }
]

function itemLabel(
  labels: ProductWorkspaceLabels,
  key: ProductWorkspacePanel
): string {
  const labelMap: Record<ProductWorkspacePanel, string> = {
    combinations: labels.combinations,
    materials: labels.materials,
    pieces: labels.pieces,
    product: labels.product,
    stickers: labels.stickers,
    uploads: labels.uploads
  }

  return labelMap[key]
}

/**
 * Renders the left workspace rail and active sidebar panel.
 *
 * @param props - Workspace sidebar props.
 * @returns Sidebar element.
 */
export function WorkspaceSidebar(props: WorkspaceSidebarProps): ReactElement {
  const {
    catalogMaterials,
    combinationActions,
    combinations,
    labels,
    materialActions,
    product,
    productMaterials
  } = props
  const { activePanel, panelOpen, selectPanel } = useProductWorkspace()

  return (
    <aside className="flex min-h-0 bg-background">
      <nav
        aria-label={labels.sidebarTitle}
        className="flex w-20 shrink-0 flex-col items-center border-r"
      >
        {railItems.map(item => {
          const Icon = item.icon
          const label = itemLabel(labels, item.key)
          const selected = item.key === activePanel

          return (
            <Button
              aria-expanded={selected ? panelOpen : false}
              aria-label={label}
              aria-pressed={selected}
              className={cn(
                'h-[4.5rem] w-full flex-col gap-1 border-0 px-1 py-2 text-[0.65rem]',
                'normal-case tracking-normal text-muted-foreground',
                selected && 'bg-muted text-foreground'
              )}
              key={item.key}
              onClick={() => {
                selectPanel(item.key)
              }}
              type="button"
              variant="ghost"
            >
              <Icon aria-hidden="true" className="size-4" />
              <span className="max-w-full truncate">{label}</span>
            </Button>
          )
        })}
      </nav>

      <div
        className={cn(
          'grid min-h-0 overflow-hidden bg-card transition-[width]',
          panelOpen ? 'w-80 border-r' : 'w-0'
        )}
        data-testid="workspace-sidebar-panel"
      >
        <div className="grid min-h-0 w-80 grid-rows-[auto_1fr]">
          <header className="border-b p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {labels.sidebarTitle}
            </p>
          </header>
          <div className="min-h-0 overflow-y-auto">
            <WorkspacePanelContent
              catalogMaterials={catalogMaterials}
              combinationActions={combinationActions}
              combinations={combinations}
              labels={labels}
              materialActions={materialActions}
              panel={activePanel}
              product={product}
              productMaterials={productMaterials}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
