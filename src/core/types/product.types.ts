/**
 * Minimal datasheet shape required to resolve a product display name.
 */
export type ProductDatasheetNameSource = {
  readonly realm?: string | null
  readonly name?: string | null
}

/**
 * Minimal product shape required by display-name helpers.
 */
export type ProductDisplayNameSource = {
  readonly sku: string
  readonly datasheets?: readonly ProductDatasheetNameSource[] | null
}
