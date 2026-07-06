/**
 * Product data rendered by the workspace shell.
 */
export type ProductWorkspaceItem = {
  readonly id: string
  readonly name: string
  readonly description: string | null
  readonly photoUrl: string | null
  readonly updatedAt: string
}

/**
 * Workspace panel keys available from the left rail.
 */
export type ProductWorkspacePanel =
  | 'product'
  | 'pieces'
  | 'materials'
  | 'combinations'
  | 'uploads'
  | 'stickers'

/**
 * Text labels used by the product workspace.
 */
export type ProductWorkspaceLabels = {
  readonly home: string
  readonly workspace: string
  readonly save: string
  readonly export: string
  readonly calculate: string
  readonly sidebarTitle: string
  readonly product: string
  readonly productPanelDescription: string
  readonly pieces: string
  readonly piecesPanelDescription: string
  readonly materials: string
  readonly materialsPanelDescription: string
  readonly combinations: string
  readonly combinationsPanelDescription: string
  readonly uploads: string
  readonly uploadsPanelDescription: string
  readonly stickers: string
  readonly stickersPanelDescription: string
  readonly canvasLabel: string
  readonly canvasEmptyTitle: string
  readonly canvasEmptyDescription: string
  readonly updated: string
}
