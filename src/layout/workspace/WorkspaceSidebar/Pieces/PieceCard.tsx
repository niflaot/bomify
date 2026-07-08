import { Pencil } from 'lucide-react'
import type { ReactElement } from 'react'

import { PieceRenderer } from '@/components/PieceRenderer'
import { Button } from '@/components/ui/button'

import type {
  ProductWorkspaceCombination,
  ProductWorkspaceLabels,
  ProductWorkspacePiece,
  ProductWorkspacePieceActions,
  ProductWorkspacePieceMaterialRequirement,
  ProductWorkspaceProductMaterial
} from '@/views/ProductWorkspace/types/product-workspace.types'
import { MaterialSwatch } from '../Materials/MaterialSwatch'
import { PieceDeleteDialog } from './PieceDeleteDialog'
import { PieceFormDialog } from './PieceFormDialog'

type PieceCardProps = {
  readonly actions: ProductWorkspacePieceActions
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly piece: ProductWorkspacePiece
  readonly productId: string
  readonly productMaterials: readonly ProductWorkspaceProductMaterial[]
}

function formatDimension(widthMm: number, heightMm: number): string {
  const widthCm = Number((widthMm / 10).toFixed(2))
  const heightCm = Number((heightMm / 10).toFixed(2))

  return `${widthCm} cm x ${heightCm} cm`
}

function getRequirementLabel(
  requirement: ProductWorkspacePieceMaterialRequirement
): string {
  if (requirement.productMaterial) {
    return `${requirement.productMaterial.material.name} x${requirement.quantity}`
  }

  if (requirement.combinationMaterial) {
    return `${requirement.combinationMaterial.roleId} x${requirement.quantity}`
  }

  return `x${requirement.quantity}`
}

function getRequirementColor(
  requirement: ProductWorkspacePieceMaterialRequirement
): string {
  return requirement.productMaterial?.material.hexColor
    ?? requirement.combinationMaterial?.productMaterial.material.hexColor
    ?? '#111111'
}

function getRequirementIcon(
  requirement: ProductWorkspacePieceMaterialRequirement
): ProductWorkspaceProductMaterial['material']['iconKey'] {
  return requirement.productMaterial?.material.iconKey
    ?? requirement.combinationMaterial?.productMaterial.material.iconKey
    ?? 'SwatchBook'
}

function PiecePreview(props: {
  readonly labels: ProductWorkspaceLabels
  readonly piece: ProductWorkspacePiece
}): ReactElement {
  const { labels, piece } = props

  return (
    <div
      className="grid min-h-36 place-items-center border bg-background p-3"
      style={{
        backgroundImage:
          'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '12px 12px'
      }}
    >
      {piece.dxfUrl ? (
        <PieceRenderer
          ariaLabel={`${labels.pieces}: ${piece.name}`}
          hoverStrokeColor="var(--primary)"
          measurements={{ heightMm: piece.heightMm, widthMm: piece.widthMm }}
          showMeasurements={false}
          source={piece.dxfUrl}
          sourceType="dxf"
          strokeColor="var(--foreground)"
          strokeWidth={0.75}
        />
      ) : (
        <div className="h-20 w-full border border-dashed" />
      )}
    </div>
  )
}

/**
 * Renders one piece card with DXF preview and material quantities.
 *
 * @param props - Piece card props.
 * @returns Piece card element.
 */
export function PieceCard(props: PieceCardProps): ReactElement {
  const { actions, combinations, labels, piece, productId, productMaterials } = props

  return (
    <article className="grid gap-3 border bg-background p-3">
      <PiecePreview labels={labels} piece={piece} />
      <div className="grid gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {piece.number}. {piece.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDimension(piece.widthMm, piece.heightMm)}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <PieceFormDialog
              action={actions.update}
              combinations={combinations}
              labels={labels}
              piece={piece}
              productId={productId}
              productMaterials={productMaterials}
              trigger={
                <Button
                  aria-label={`${labels.editPiece}: ${piece.name}`}
                  size="icon-xs"
                  type="button"
                  variant="outline"
                >
                  <Pencil aria-hidden="true" />
                </Button>
              }
              variant="update"
            />
            <PieceDeleteDialog
              action={actions.delete}
              labels={labels}
              piece={piece}
              productId={productId}
            />
          </div>
        </div>
        <p className="truncate text-xs text-muted-foreground">{piece.dxfFileName}</p>
      </div>
      {piece.materialRequirements.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {piece.materialRequirements.map(requirement => (
            <li className="flex items-center gap-1 border px-2 py-1 text-xs" key={requirement.id}>
              <MaterialSwatch
                className="grid size-4 place-items-center"
                hexColor={getRequirementColor(requirement)}
                iconClassName="size-2.5"
                iconKey={getRequirementIcon(requirement)}
              />
              {getRequirementLabel(requirement)}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
