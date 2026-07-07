import type { LucideIcon } from 'lucide-react'
import {
  Boxes,
  ChartNoAxesColumn,
  FileUp,
  Layers3,
  Package,
  Palette,
  Printer
} from 'lucide-react'
import type { ReactElement } from 'react'

import type {
  ProductWorkspaceMaterial,
  ProductWorkspaceMaterialActions,
  ProductWorkspaceCombination,
  ProductWorkspaceCombinationActions,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspacePanel,
  ProductWorkspacePiece,
  ProductWorkspacePieceActions,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/product-workspace.types'
import { CombinationsPanel } from './Combinations/CombinationsPanel'
import { ConsumptionPanel } from './Consumption/ConsumptionPanel'
import { MaterialsPanel } from './Materials/MaterialsPanel'
import { PiecesPanel } from './Pieces/PiecesPanel'

type WorkspacePanelContentProps = {
  readonly catalogMaterials: readonly ProductWorkspaceMaterial[]
  readonly combinationActions: ProductWorkspaceCombinationActions
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly materialActions: ProductWorkspaceMaterialActions
  readonly panel: ProductWorkspacePanel
  readonly pieceActions: ProductWorkspacePieceActions
  readonly pieces: readonly ProductWorkspacePiece[]
  readonly product: ProductWorkspaceItem
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}

type PanelCopy = {
  readonly description: string
  readonly icon: LucideIcon
  readonly title: string
}

function getPanelCopy(
  labels: ProductWorkspaceLabels,
  panel: ProductWorkspacePanel
): PanelCopy {
  const copies: Record<ProductWorkspacePanel, PanelCopy> = {
    combinations: {
      description: labels.combinationsPanelDescription,
      icon: Layers3,
      title: labels.combinations
    },
    consumption: {
      description: labels.consumptionPanelDescription,
      icon: ChartNoAxesColumn,
      title: labels.consumption
    },
    materials: {
      description: labels.materialsPanelDescription,
      icon: Palette,
      title: labels.materials
    },
    pieces: {
      description: labels.piecesPanelDescription,
      icon: Boxes,
      title: labels.pieces
    },
    product: {
      description: labels.productPanelDescription,
      icon: Package,
      title: labels.product
    },
    stickers: {
      description: labels.stickersPanelDescription,
      icon: Printer,
      title: labels.stickers
    },
    uploads: {
      description: labels.uploadsPanelDescription,
      icon: FileUp,
      title: labels.uploads
    }
  }

  return copies[panel]
}

function PlaceholderLine(props: { readonly className?: string }): ReactElement {
  return <div className={props.className} />
}

function ProductPanelBody(): ReactElement {
  return (
    <div className="grid gap-4">
      <div className="aspect-[4/3] border border-dashed bg-muted/40" />
      <div className="grid gap-2">
        <PlaceholderLine className="h-3 w-2/3 bg-muted" />
        <PlaceholderLine className="h-3 w-full bg-muted" />
        <PlaceholderLine className="h-3 w-4/5 bg-muted" />
      </div>
    </div>
  )
}

function UploadsPanelBody(): ReactElement {
  return (
    <div className="grid gap-4">
      <div className="grid h-32 place-items-center border border-dashed bg-muted/30">
        <FileUp aria-hidden="true" className="size-8 text-muted-foreground" />
      </div>
      <PlaceholderLine className="h-3 w-full bg-muted" />
      <PlaceholderLine className="h-3 w-3/5 bg-muted" />
    </div>
  )
}

function StickersPanelBody(): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[0, 1, 2, 3, 4, 5].map(index => (
        <div className="aspect-[8/5] border border-dashed bg-muted/30" key={index} />
      ))}
    </div>
  )
}

function renderPanelBody(props: WorkspacePanelContentProps): ReactElement {
  const {
    catalogMaterials,
    combinationActions,
    combinations,
    labels,
    materialActions,
    panel,
    pieceActions,
    pieces,
    product,
    productMaterials
  } = props

  if (panel === 'product') {
    return <ProductPanelBody />
  }

  if (panel === 'materials') {
    return (
      <MaterialsPanel
        actions={materialActions}
        catalogMaterials={catalogMaterials}
        labels={labels}
        productId={product.id}
        productMaterials={productMaterials}
      />
    )
  }

  if (panel === 'combinations') {
    return (
      <CombinationsPanel
        actions={combinationActions}
        combinations={combinations}
        labels={labels}
        productId={product.id}
        productMaterials={productMaterials}
      />
    )
  }

  if (panel === 'pieces') {
    return (
      <PiecesPanel
        actions={pieceActions}
        combinations={combinations}
        labels={labels}
        pieces={pieces}
        productId={product.id}
        productMaterials={productMaterials}
      />
    )
  }

  if (panel === 'consumption') {
    return (
      <ConsumptionPanel
        combinations={combinations}
        labels={labels}
        pieces={pieces}
      />
    )
  }

  if (panel === 'uploads') {
    return <UploadsPanelBody />
  }

  if (panel === 'stickers') {
    return <StickersPanelBody />
  }

  return <ProductPanelBody />
}

/**
 * Renders the active workspace panel content.
 *
 * @param props - Active panel props.
 * @returns Active panel content.
 */
export function WorkspacePanelContent(
  props: WorkspacePanelContentProps
): ReactElement {
  const { labels, panel } = props
  const copy = getPanelCopy(labels, panel)
  const Icon = copy.icon

  return (
    <section className="grid gap-5 p-4">
      <div className="grid gap-2">
        <div className="flex items-center gap-3">
          <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold uppercase tracking-widest">
            {copy.title}
          </h2>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{copy.description}</p>
      </div>
      {renderPanelBody(props)}
    </section>
  )
}
