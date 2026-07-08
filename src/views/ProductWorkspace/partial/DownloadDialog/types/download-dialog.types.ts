import type {
  ProductWorkspaceCombination,
  ProductWorkspaceItem,
  ProductWorkspaceLabels,
  ProductWorkspacePiece
} from '../../../types/product-workspace.types'

/**
 * Props for the workspace download dialog.
 */
export type DownloadDialogProps = {
  readonly combinations: readonly ProductWorkspaceCombination[]
  readonly labels: ProductWorkspaceLabels
  readonly pieces: readonly ProductWorkspacePiece[]
  readonly product: ProductWorkspaceItem
}
